"""
Security Middleware
Implements comprehensive security headers and protections
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Optional, Set
import hashlib
import secrets
import time
import logging
from collections import defaultdict
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Comprehensive security middleware with:
    - Content Security Policy (CSP)
    - Security Headers (HSTS, X-Frame-Options, etc.)
    - Rate Limiting
    - Request ID tracking
    """
    
    def __init__(
        self,
        app,
        enable_csp: bool = True,
        enable_rate_limiting: bool = True,
        rate_limit: int = 100,  # requests per minute
        rate_limit_window: int = 60,  # seconds
        enable_security_headers: bool = True,
        enable_request_id: bool = True,
        trusted_origins: Optional[Set[str]] = None
    ):
        super().__init__(app)
        self.enable_csp = enable_csp
        self.enable_rate_limiting = enable_rate_limiting
        self.rate_limit = rate_limit
        self.rate_limit_window = rate_limit_window
        self.enable_security_headers = enable_security_headers
        self.enable_request_id = enable_request_id
        self.trusted_origins = trusted_origins or {
            "http://localhost:4173",
            "http://localhost:3000",
            "http://localhost:8002"
        }
        
        # Rate limiting storage
        self.rate_limit_storage: Dict[str, list] = defaultdict(list)
        
    def get_client_ip(self, request: Request) -> str:
        """Get client IP address, considering proxy headers"""
        # Check X-Forwarded-For header (for proxies)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take the first IP in the chain
            return forwarded_for.split(",")[0].strip()
        
        # Check X-Real-IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fall back to direct connection IP
        if request.client:
            return request.client.host
        
        return "unknown"
    
    def check_rate_limit(self, client_ip: str) -> bool:
        """Check if client has exceeded rate limit"""
        if not self.enable_rate_limiting:
            return True
        
        current_time = time.time()
        window_start = current_time - self.rate_limit_window
        
        # Clean old entries
        self.rate_limit_storage[client_ip] = [
            timestamp for timestamp in self.rate_limit_storage[client_ip]
            if timestamp > window_start
        ]
        
        # Check limit
        if len(self.rate_limit_storage[client_ip]) >= self.rate_limit:
            return False
        
        # Add current request
        self.rate_limit_storage[client_ip].append(current_time)
        return True
    
    def generate_csp_header(self, request: Request) -> str:
        """Generate Content Security Policy header"""
        # Generate nonce for inline scripts (if needed)
        nonce = secrets.token_urlsafe(16)
        
        # Build CSP directives
        csp_directives = [
            "default-src 'self'",
            f"script-src 'self' 'nonce-{nonce}' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' http://localhost:8002 http://localhost:4173",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests"
        ]
        
        # Store nonce in request state for use in templates
        request.state.csp_nonce = nonce
        
        return "; ".join(csp_directives)
    
    def add_security_headers(self, response: Response, request: Request):
        """Add comprehensive security headers to response"""
        if not self.enable_security_headers:
            return
        
        # Content Security Policy
        if self.enable_csp:
            response.headers["Content-Security-Policy"] = self.generate_csp_header(request)
        
        # Strict Transport Security (HSTS)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        
        # XSS Protection (for older browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Permissions Policy (formerly Feature Policy)
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), "
            "payment=(), usb=(), magnetometer=(), "
            "accelerometer=(), gyroscope=()"
        )
        
        # Remove server header information
        if "server" in response.headers:
            del response.headers["server"]
        if "x-powered-by" in response.headers:
            del response.headers["x-powered-by"]
    
    def add_request_id(self, request: Request, response: Response):
        """Add unique request ID for tracking"""
        if not self.enable_request_id:
            return
        
        # Generate or retrieve request ID
        request_id = request.headers.get("X-Request-ID")
        if not request_id:
            request_id = secrets.token_urlsafe(16)
        
        # Store in request state
        request.state.request_id = request_id
        
        # Add to response headers
        response.headers["X-Request-ID"] = request_id
    
    async def dispatch(self, request: Request, call_next):
        """Process request with security checks"""
        
        # Get client IP
        client_ip = self.get_client_ip(request)
        
        # Rate limiting
        if not self.check_rate_limit(client_ip):
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return Response(
                content="Rate limit exceeded. Please try again later.",
                status_code=429,
                headers={
                    "Retry-After": str(self.rate_limit_window),
                    "X-RateLimit-Limit": str(self.rate_limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + self.rate_limit_window)
                }
            )
        
        # Process request
        start_time = time.time()
        
        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(f"Request processing error: {str(e)}")
            response = Response(
                content="Internal server error",
                status_code=500
            )
        
        # Add security headers
        self.add_security_headers(response, request)
        
        # Add request ID
        self.add_request_id(request, response)
        
        # Add timing header
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Add rate limit headers
        if self.enable_rate_limiting:
            remaining = self.rate_limit - len(self.rate_limit_storage[client_ip])
            response.headers["X-RateLimit-Limit"] = str(self.rate_limit)
            response.headers["X-RateLimit-Remaining"] = str(max(0, remaining))
            response.headers["X-RateLimit-Reset"] = str(int(time.time()) + self.rate_limit_window)
        
        # Log request
        logger.info(
            f"Request: {request.method} {request.url.path} "
            f"from {client_ip} - Status: {response.status_code} "
            f"- Time: {process_time:.3f}s"
        )
        
        return response


class CORSSecurityMiddleware(BaseHTTPMiddleware):
    """
    Secure CORS middleware with strict origin validation
    """
    
    def __init__(
        self,
        app,
        allowed_origins: Set[str] = None,
        allowed_methods: Set[str] = None,
        allowed_headers: Set[str] = None,
        allow_credentials: bool = True,
        max_age: int = 3600
    ):
        super().__init__(app)
        self.allowed_origins = allowed_origins or {
            "http://localhost:4173",
            "http://localhost:3000",
            "http://localhost:8002"
        }
        self.allowed_methods = allowed_methods or {"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
        self.allowed_headers = allowed_headers or {"Content-Type", "Authorization", "X-Request-ID"}
        self.allow_credentials = allow_credentials
        self.max_age = max_age
    
    def is_origin_allowed(self, origin: str) -> bool:
        """Check if origin is in allowed list"""
        return origin in self.allowed_origins
    
    async def dispatch(self, request: Request, call_next):
        """Handle CORS with security checks"""
        
        origin = request.headers.get("Origin")
        
        # Handle preflight requests
        if request.method == "OPTIONS":
            if origin and self.is_origin_allowed(origin):
                return Response(
                    status_code=200,
                    headers={
                        "Access-Control-Allow-Origin": origin,
                        "Access-Control-Allow-Methods": ", ".join(self.allowed_methods),
                        "Access-Control-Allow-Headers": ", ".join(self.allowed_headers),
                        "Access-Control-Allow-Credentials": str(self.allow_credentials).lower(),
                        "Access-Control-Max-Age": str(self.max_age),
                        "Vary": "Origin"
                    }
                )
            else:
                # Origin not allowed
                return Response(status_code=403, content="Origin not allowed")
        
        # Process actual request
        response = await call_next(request)
        
        # Add CORS headers if origin is allowed
        if origin and self.is_origin_allowed(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = str(self.allow_credentials).lower()
            response.headers["Vary"] = "Origin"
        
        return response