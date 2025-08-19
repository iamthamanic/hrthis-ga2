"""
FastAPI Middleware Hooks
Provides request/response interception for logging, security, and monitoring
"""

import time
import json
import logging
from typing import Callable, Optional, Dict, Any
from datetime import datetime, timedelta
from collections import defaultdict

from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger(__name__)

# Rate limiting storage (in production, use Redis)
rate_limit_storage = defaultdict(list)

class RequestHooksMiddleware(BaseHTTPMiddleware):
    """Main middleware for request/response hooks"""
    
    def __init__(self, app: ASGIApp, 
                 log_requests: bool = True,
                 add_security_headers: bool = True,
                 enable_rate_limiting: bool = True,
                 rate_limit: int = 100,  # requests per minute
                 enable_performance_tracking: bool = True):
        super().__init__(app)
        self.log_requests = log_requests
        self.add_security_headers = add_security_headers
        self.enable_rate_limiting = enable_rate_limiting
        self.rate_limit = rate_limit
        self.enable_performance_tracking = enable_performance_tracking
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request and response with hooks"""
        
        # Pre-request hooks
        start_time = time.time()
        request_id = self._generate_request_id()
        
        # Add request ID to request state
        request.state.request_id = request_id
        
        try:
            # Rate limiting check
            if self.enable_rate_limiting:
                if not await self._check_rate_limit(request):
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={"detail": "Rate limit exceeded"}
                    )
            
            # Log incoming request
            if self.log_requests:
                await self._log_request(request, request_id)
            
            # Process request
            response = await call_next(request)
            
            # Post-response hooks
            if self.add_security_headers:
                response = self._add_security_headers(response)
            
            # Add request ID to response
            response.headers["X-Request-ID"] = request_id
            
            # Performance tracking
            if self.enable_performance_tracking:
                process_time = time.time() - start_time
                response.headers["X-Process-Time"] = str(process_time)
                await self._track_performance(request, process_time)
            
            # Log response
            if self.log_requests:
                await self._log_response(request, response, request_id, process_time)
            
            return response
            
        except Exception as e:
            # Error handling hook
            return await self._handle_error(request, e, request_id)
    
    def _generate_request_id(self) -> str:
        """Generate unique request ID"""
        import uuid
        return str(uuid.uuid4())
    
    async def _check_rate_limit(self, request: Request) -> bool:
        """Check if request exceeds rate limit"""
        # Get client identifier (IP or user ID)
        client_id = request.client.host if request.client else "unknown"
        
        # Get user from JWT if authenticated
        if hasattr(request.state, "user"):
            client_id = f"user:{request.state.user.id}"
        
        now = datetime.utcnow()
        minute_ago = now - timedelta(minutes=1)
        
        # Clean old entries
        rate_limit_storage[client_id] = [
            timestamp for timestamp in rate_limit_storage[client_id]
            if timestamp > minute_ago
        ]
        
        # Check limit
        if len(rate_limit_storage[client_id]) >= self.rate_limit:
            logger.warning(f"Rate limit exceeded for {client_id}")
            return False
        
        # Add current request
        rate_limit_storage[client_id].append(now)
        return True
    
    async def _log_request(self, request: Request, request_id: str):
        """Log incoming request details"""
        log_data = {
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "client": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Don't log sensitive paths
        sensitive_paths = ["/api/auth/login", "/api/auth/register"]
        if request.url.path not in sensitive_paths:
            logger.info(f"Request: {json.dumps(log_data)}")
        else:
            logger.info(f"Request: {request_id} - {request.method} {request.url.path}")
    
    async def _log_response(self, request: Request, response: Response, 
                           request_id: str, process_time: float):
        """Log response details"""
        log_data = {
            "request_id": request_id,
            "status_code": response.status_code,
            "process_time": round(process_time, 3),
            "path": request.url.path
        }
        
        if response.status_code >= 400:
            logger.warning(f"Response: {json.dumps(log_data)}")
        else:
            logger.info(f"Response: {json.dumps(log_data)}")
    
    def _add_security_headers(self, response: Response) -> Response:
        """Add security headers to response"""
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
        
        for header, value in security_headers.items():
            response.headers[header] = value
        
        return response
    
    async def _track_performance(self, request: Request, process_time: float):
        """Track performance metrics"""
        # In production, send to monitoring service (e.g., Prometheus, DataDog)
        metrics = {
            "path": request.url.path,
            "method": request.method,
            "duration": process_time,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Log slow requests
        if process_time > 1.0:  # More than 1 second
            logger.warning(f"Slow request detected: {json.dumps(metrics)}")
    
    async def _handle_error(self, request: Request, error: Exception, 
                          request_id: str) -> JSONResponse:
        """Centralized error handling"""
        
        # Log the error
        logger.error(f"Request {request_id} failed: {str(error)}", exc_info=True)
        
        # Determine error response
        if isinstance(error, HTTPException):
            return JSONResponse(
                status_code=error.status_code,
                content={
                    "detail": error.detail,
                    "request_id": request_id
                }
            )
        
        # Generic error response (don't expose internal errors)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "request_id": request_id
            }
        )


class AuthenticationMiddleware(BaseHTTPMiddleware):
    """Middleware for authentication checks"""
    
    def __init__(self, app: ASGIApp, 
                 exclude_paths: Optional[list] = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or [
            "/docs", "/redoc", "/openapi.json",
            "/api/auth/login", "/api/auth/register",
            "/health", "/"
        ]
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Check authentication for protected routes"""
        
        # Skip authentication for excluded paths
        if any(request.url.path.startswith(path) for path in self.exclude_paths):
            return await call_next(request)
        
        # Check for authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Missing authentication"}
            )
        
        # Token validation is handled by dependency injection
        # This is just a pre-check
        return await call_next(request)


class CORSMiddleware(BaseHTTPMiddleware):
    """Enhanced CORS middleware with hooks"""
    
    def __init__(self, app: ASGIApp,
                 allow_origins: list = ["*"],
                 allow_methods: list = ["*"],
                 allow_headers: list = ["*"],
                 allow_credentials: bool = True):
        super().__init__(app)
        self.allow_origins = allow_origins
        self.allow_methods = allow_methods
        self.allow_headers = allow_headers
        self.allow_credentials = allow_credentials
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Handle CORS with additional logging"""
        
        # Handle preflight requests
        if request.method == "OPTIONS":
            return self._preflight_response(request)
        
        # Process request
        response = await call_next(request)
        
        # Add CORS headers
        origin = request.headers.get("origin")
        if origin:
            # Check if origin is allowed
            if self._is_origin_allowed(origin):
                response.headers["Access-Control-Allow-Origin"] = origin
                if self.allow_credentials:
                    response.headers["Access-Control-Allow-Credentials"] = "true"
        
        return response
    
    def _is_origin_allowed(self, origin: str) -> bool:
        """Check if origin is in allowed list"""
        if "*" in self.allow_origins:
            return True
        return origin in self.allow_origins
    
    def _preflight_response(self, request: Request) -> Response:
        """Handle preflight OPTIONS request"""
        headers = {
            "Access-Control-Allow-Methods": ", ".join(self.allow_methods),
            "Access-Control-Allow-Headers": ", ".join(self.allow_headers),
            "Access-Control-Max-Age": "3600"
        }
        
        origin = request.headers.get("origin")
        if origin and self._is_origin_allowed(origin):
            headers["Access-Control-Allow-Origin"] = origin
            if self.allow_credentials:
                headers["Access-Control-Allow-Credentials"] = "true"
        
        return Response(status_code=200, headers=headers)


class CompressionMiddleware(BaseHTTPMiddleware):
    """Middleware for response compression"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Compress response if client supports it"""
        
        response = await call_next(request)
        
        # Check if client accepts compression
        accept_encoding = request.headers.get("accept-encoding", "")
        
        # For now, just add header indicating compression support
        # In production, implement actual compression
        if "gzip" in accept_encoding:
            response.headers["X-Compression-Available"] = "gzip"
        
        return response


# Utility functions for middleware

def create_middleware_stack(app: ASGIApp, config: Dict[str, Any]) -> ASGIApp:
    """Create and configure middleware stack"""
    
    # Add middlewares in order (outermost first)
    if config.get("enable_compression", False):
        app = CompressionMiddleware(app)
    
    if config.get("enable_cors", True):
        app = CORSMiddleware(
            app,
            allow_origins=config.get("cors_origins", ["*"]),
            allow_credentials=config.get("cors_credentials", True)
        )
    
    if config.get("enable_auth_check", True):
        app = AuthenticationMiddleware(
            app,
            exclude_paths=config.get("auth_exclude_paths")
        )
    
    if config.get("enable_request_hooks", True):
        app = RequestHooksMiddleware(
            app,
            log_requests=config.get("log_requests", True),
            add_security_headers=config.get("security_headers", True),
            enable_rate_limiting=config.get("rate_limiting", True),
            rate_limit=config.get("rate_limit", 100),
            enable_performance_tracking=config.get("performance_tracking", True)
        )
    
    return app


# Performance monitoring decorator
def monitor_performance(func: Callable) -> Callable:
    """Decorator to monitor function performance"""
    
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        
        try:
            result = await func(*args, **kwargs)
            elapsed = time.time() - start_time
            
            if elapsed > 0.5:  # Log slow operations
                logger.warning(
                    f"Slow operation: {func.__name__} took {elapsed:.3f}s"
                )
            
            return result
            
        except Exception as e:
            elapsed = time.time() - start_time
            logger.error(
                f"Operation failed: {func.__name__} after {elapsed:.3f}s - {str(e)}"
            )
            raise
    
    return wrapper