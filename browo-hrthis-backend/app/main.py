"""
HRthis Backend API
FastAPI application for HR management system
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# CORS Configuration
cors_origins = os.getenv(
    "CORS_ORIGINS", 
    "http://localhost:4173,http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,  # Frontend URLs from environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
from app.api import employees, auth, files
from app.core.database import create_tables
from app.hooks.database_hooks import DatabaseHooks
from app.middleware.request_hooks import RequestHooksMiddleware

# Add request hooks middleware
app.add_middleware(
    RequestHooksMiddleware,
    log_requests=True,
    add_security_headers=True,
    enable_rate_limiting=True,
    rate_limit=100,  # 100 requests per minute
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)