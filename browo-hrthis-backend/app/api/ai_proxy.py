"""
AI Service Proxy - Secure backend proxy for AI services
Handles API keys securely on the backend, never exposing them to frontend
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, AsyncGenerator
import httpx
import json
import os
from datetime import datetime
import logging

from app.api.auth import get_current_user
from app.models.employee import Employee

logger = logging.getLogger(__name__)

router = APIRouter()

# Configuration from environment variables
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROK_API_KEY = os.getenv("GROK_API_KEY")

# API Endpoints
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
GROK_API_URL = "https://api.x.ai/v1/chat/completions"

# Request/Response Models
class AnthropicMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str

class AnthropicRequest(BaseModel):
    model: str = Field(default="claude-3-5-sonnet-20241022")
    messages: List[AnthropicMessage]
    max_tokens: int = Field(default=1024, le=4096)
    temperature: float = Field(default=0.7, ge=0, le=1)
    stream: bool = Field(default=False)
    system: Optional[str] = None

class OpenAIMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str

class OpenAIRequest(BaseModel):
    model: str = Field(default="gpt-4-turbo-preview")
    messages: List[OpenAIMessage]
    max_tokens: int = Field(default=1024, le=4096)
    temperature: float = Field(default=0.7, ge=0, le=1)
    stream: bool = Field(default=False)

class GrokRequest(BaseModel):
    model: str = Field(default="grok-beta")
    messages: List[OpenAIMessage]  # Grok uses same format as OpenAI
    max_tokens: int = Field(default=1024, le=4096)
    temperature: float = Field(default=0.7, ge=0, le=1)
    stream: bool = Field(default=False)

# Rate limiting per user
user_request_counts: Dict[str, Dict[str, int]] = {}

def check_rate_limit(user_id: str, service: str, limit: int = 100) -> bool:
    """Check if user has exceeded rate limit (100 requests per day per service)"""
    today = datetime.now().strftime("%Y-%m-%d")
    key = f"{user_id}:{today}"
    
    if key not in user_request_counts:
        user_request_counts[key] = {}
    
    if service not in user_request_counts[key]:
        user_request_counts[key][service] = 0
    
    if user_request_counts[key][service] >= limit:
        return False
    
    user_request_counts[key][service] += 1
    return True

async def stream_response(response: httpx.Response) -> AsyncGenerator[bytes, None]:
    """Stream response from AI service to client"""
    async for chunk in response.aiter_bytes():
        yield chunk

@router.post("/anthropic")
async def proxy_anthropic(
    request: AnthropicRequest,
    current_user: Employee = Depends(get_current_user)
):
    """Proxy requests to Anthropic API with secure key handling"""
    
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=503, detail="Anthropic service not configured")
    
    # Rate limiting
    if not check_rate_limit(current_user.id, "anthropic"):
        raise HTTPException(status_code=429, detail="Rate limit exceeded (100 requests/day)")
    
    # Log request (without sensitive data)
    logger.info(f"Anthropic request from user {current_user.id}, model: {request.model}")
    
    # Prepare request
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    payload = request.dict(exclude_none=True)
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                ANTHROPIC_API_URL,
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"Anthropic API error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Anthropic API error: {response.text}"
                )
            
            return response.json()
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to Anthropic timed out")
    except Exception as e:
        logger.error(f"Anthropic proxy error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/openai")
async def proxy_openai(
    request: OpenAIRequest,
    current_user: Employee = Depends(get_current_user)
):
    """Proxy requests to OpenAI API with secure key handling"""
    
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="OpenAI service not configured")
    
    # Rate limiting
    if not check_rate_limit(current_user.id, "openai"):
        raise HTTPException(status_code=429, detail="Rate limit exceeded (100 requests/day)")
    
    # Log request
    logger.info(f"OpenAI request from user {current_user.id}, model: {request.model}")
    
    # Prepare request
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = request.dict(exclude_none=True)
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            if request.stream:
                # Handle streaming response
                response = await client.post(
                    OPENAI_API_URL,
                    headers=headers,
                    json=payload,
                    timeout=30.0,
                    follow_redirects=True
                )
                return StreamingResponse(
                    stream_response(response),
                    media_type="text/event-stream"
                )
            else:
                response = await client.post(
                    OPENAI_API_URL,
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"OpenAI API error: {response.text}"
                    )
                
                return response.json()
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to OpenAI timed out")
    except Exception as e:
        logger.error(f"OpenAI proxy error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/grok")
async def proxy_grok(
    request: GrokRequest,
    current_user: Employee = Depends(get_current_user)
):
    """Proxy requests to Grok API with secure key handling"""
    
    if not GROK_API_KEY:
        raise HTTPException(status_code=503, detail="Grok service not configured")
    
    # Rate limiting
    if not check_rate_limit(current_user.id, "grok"):
        raise HTTPException(status_code=429, detail="Rate limit exceeded (100 requests/day)")
    
    # Log request
    logger.info(f"Grok request from user {current_user.id}, model: {request.model}")
    
    # Prepare request
    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = request.dict(exclude_none=True)
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GROK_API_URL,
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"Grok API error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Grok API error: {response.text}"
                )
            
            return response.json()
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to Grok timed out")
    except Exception as e:
        logger.error(f"Grok proxy error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/usage")
async def get_ai_usage(
    current_user: Employee = Depends(get_current_user)
):
    """Get AI service usage statistics for current user"""
    today = datetime.now().strftime("%Y-%m-%d")
    key = f"{current_user.id}:{today}"
    
    usage = user_request_counts.get(key, {})
    
    return {
        "date": today,
        "user_id": current_user.id,
        "usage": {
            "anthropic": usage.get("anthropic", 0),
            "openai": usage.get("openai", 0),
            "grok": usage.get("grok", 0)
        },
        "limits": {
            "anthropic": 100,
            "openai": 100,
            "grok": 100
        }
    }

@router.get("/models")
async def get_available_models(
    current_user: Employee = Depends(get_current_user)
):
    """Get list of available AI models"""
    return {
        "anthropic": {
            "available": bool(ANTHROPIC_API_KEY),
            "models": [
                "claude-3-5-sonnet-20241022",
                "claude-3-opus-20240229",
                "claude-3-haiku-20240307"
            ] if ANTHROPIC_API_KEY else []
        },
        "openai": {
            "available": bool(OPENAI_API_KEY),
            "models": [
                "gpt-4-turbo-preview",
                "gpt-4",
                "gpt-3.5-turbo"
            ] if OPENAI_API_KEY else []
        },
        "grok": {
            "available": bool(GROK_API_KEY),
            "models": [
                "grok-beta"
            ] if GROK_API_KEY else []
        }
    }