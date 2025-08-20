"""
HRthis Backend API
FastAPI application for HR management system
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

# Create uploads directory
uploads_dir = Path("./uploads")
uploads_dir.mkdir(exist_ok=True)

app = FastAPI(
    title="HRthis Backend API",
    description="Backend API for HRthis HR Management System",
    version="1.0.0"
)

# Static file serving for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root_redirect():
    """Redirect root to /hrthis"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/hrthis")

@app.get("/hrthis")
def root():
    return {
        "message": "HRthis Backend API",
        "version": "1.0.0",
        "status": "running",
        "base_path": "/hrthis"
    }

@app.get("/hrthis/health")
def health_check():
    return {"status": "healthy"}

# Import routers
from app.api import employees, auth, files, ai_proxy
from app.core.database import create_tables
from app.hooks.database_hooks import DatabaseHooks
from app.middleware.request_hooks import RequestHooksMiddleware
from app.middleware.security_middleware import SecurityMiddleware, CORSSecurityMiddleware

# Get configuration from environment
cors_origins = os.getenv(
    "CORS_ORIGINS", 
    "http://localhost:4173,http://localhost:3000,http://localhost:3001"
).split(",")

rate_limit_enabled = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
rate_limit_per_minute = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))

# Add security middleware (must be added first for proper header processing)
app.add_middleware(
    SecurityMiddleware,
    enable_csp=True,
    enable_rate_limiting=rate_limit_enabled,
    rate_limit=rate_limit_per_minute,
    rate_limit_window=60,
    enable_security_headers=True,
    enable_request_id=True,
    trusted_origins=set(cors_origins)
)

# Add CORS security middleware (replaces default CORSMiddleware)
app.add_middleware(
    CORSSecurityMiddleware,
    allowed_origins=set(cors_origins),
    allowed_methods={"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    allowed_headers={"Content-Type", "Authorization", "X-Request-ID"},
    allow_credentials=True,
    max_age=3600
)

# Add request hooks middleware
app.add_middleware(
    RequestHooksMiddleware,
    log_requests=True,
    add_security_headers=False,  # Security headers now handled by SecurityMiddleware
    enable_rate_limiting=False,  # Rate limiting now handled by SecurityMiddleware
    rate_limit=100,
    enable_performance_tracking=True
)

# Create tables and initialize demo users on startup
@app.on_event("startup")
def startup_event():
    create_tables()
    
    # Register all database hooks
    DatabaseHooks.register_all_hooks()
    print("✅ Database hooks registered")
    
    # Initialize demo users if in development mode
    import os
    if os.getenv("INIT_DEMO_USERS", "true").lower() == "true":
        try:
            from init_demo_users import create_demo_users
            create_demo_users()
        except Exception as e:
            print(f"Warning: Could not initialize demo users: {e}")

# Include routers with /hrthis prefix
app.include_router(auth.router, prefix="/hrthis/api/auth", tags=["authentication"])
app.include_router(employees.router, prefix="/hrthis/api/employees", tags=["employees"])
app.include_router(files.router, prefix="/hrthis/api/files", tags=["file-management"])
app.include_router(ai_proxy.router, prefix="/hrthis/api/ai", tags=["ai-services"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)