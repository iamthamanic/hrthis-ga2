"""
Authentication Schemas
Pydantic models for auth requests/responses
"""

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from app.models.employee import EmploymentType, UserRole

class LoginRequest(BaseModel):
    """Login request schema - accepts either email or username"""
    email: Optional[str] = None  # Can be email or employee_number
    username: Optional[str] = None  # Alternative to email field
    password: str
    
    @field_validator('email', 'username')
    @classmethod
    def validate_identifier(cls, v, info):
        """Ensure at least one identifier is provided"""
        # This runs after all fields are parsed
        # We'll validate in the endpoint instead
        return v

class RegisterRequest(BaseModel):
    """Registration request schema"""
    email: EmailStr
    password: str
    employee_number: str
    first_name: str
    last_name: str
    position: str
    department: Optional[str] = None
    employment_type: EmploymentType
    start_date: Optional[datetime] = None
    role: Optional[UserRole] = UserRole.USER

class UserInfo(BaseModel):
    """User information schema"""
    id: str
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: str
    is_admin: bool
    employee_number: str
    position: str
    department: Optional[str]
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str
    expires_in: int

class LoginResponse(TokenResponse):
    """Login response with user info"""
    user: UserInfo