#!/usr/bin/env python3
"""
Initialize demo users for HRthis backend
Creates default users if they don't exist
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.employee import Employee, Base
from app.services.auth import get_password_hash
from datetime import datetime

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/hrthis.db")

# Create engine and session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def create_demo_users():
    """Create demo users if they don't exist"""
    db = SessionLocal()
    
    demo_users = [
        {
            "email": "max.mustermann@hrthis.de",
            "password": "password",
            "first_name": "Max",
            "last_name": "Mustermann",
            "employee_number": "EMP001",
            "role": "EMPLOYEE",
            "position": "Software Developer",
            "department": "IT",
            "employment_type": "fulltime",
            "hire_date": datetime(2023, 1, 15),
            "birth_date": datetime(1990, 5, 20),
            "phone": "+49 123 456789",
            "address": "Musterstraße 1, 12345 Berlin",
            "emergency_contact": {
                "name": "Maria Mustermann",
                "phone": "+49 123 456788",
                "relation": "Ehepartnerin"
            },
            "clothing_sizes": {
                "top": "L",
                "pants": "32",
                "shoes": "42"
            }
        },
        {
            "email": "anna.admin@hrthis.de",
            "password": "password",
            "first_name": "Anna",
            "last_name": "Admin",
            "employee_number": "ADM001",
            "role": "ADMIN",
            "position": "HR Manager",
            "department": "Human Resources",
            "employment_type": "fulltime",
            "hire_date": datetime(2022, 6, 1),
            "birth_date": datetime(1985, 3, 10),
            "phone": "+49 123 456790",
            "address": "Adminweg 5, 12345 Berlin",
            "emergency_contact": {
                "name": "Peter Admin",
                "phone": "+49 123 456791",
                "relation": "Ehemann"
            },
            "clothing_sizes": {
                "top": "M",
                "pants": "28",
                "shoes": "38"
            }
        },
        {
            "email": "tom.test@hrthis.de",
            "password": "password",
            "first_name": "Tom",
            "last_name": "Test",
            "employee_number": "EMP002",
            "role": "EMPLOYEE",
            "position": "QA Engineer",
            "department": "Quality Assurance",
            "employment_type": "parttime",
            "hire_date": datetime(2023, 9, 1),
            "birth_date": datetime(1995, 7, 15),
            "phone": "+49 123 456792",
            "address": "Teststraße 10, 12345 Berlin",
            "clothing_sizes": {
                "top": "XL",
                "pants": "34",
                "shoes": "44"
            }
        }
    ]
    
    for user_data in demo_users:
        # Check if user already exists
        existing_user = db.query(Employee).filter(
            Employee.email == user_data["email"]
        ).first()
        
        if not existing_user:
            # Hash the password
            hashed_password = get_password_hash(user_data["password"])
            
            # Create new employee
            new_employee = Employee(
                id=f"emp-{user_data['employee_number'].lower()}",
                email=user_data["email"],
                password_hash=hashed_password,  # Corrected field name
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                employee_number=user_data["employee_number"],
                role=user_data["role"].upper(),  # Ensure uppercase
                position=user_data["position"],
                department=user_data["department"],
                employment_type=user_data["employment_type"],
                start_date=user_data["hire_date"],  # Corrected field name
                birth_date=user_data["birth_date"],
                phone=user_data["phone"],
                address=user_data["address"],
                emergency_contact=user_data.get("emergency_contact"),
                clothing_sizes=user_data.get("clothing_sizes"),
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            db.add(new_employee)
            print(f"✅ Created demo user: {user_data['email']} (Role: {user_data['role']})")
        else:
            print(f"ℹ️  User already exists: {user_data['email']}")
    
    # Commit changes
    db.commit()
    db.close()
    print("\n✨ Demo users initialization completed!")

if __name__ == "__main__":
    print("🚀 Initializing demo users for HRthis...")
    create_demo_users()