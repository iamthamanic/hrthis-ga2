#!/usr/bin/env python3
"""
Fix database enum values from lowercase to uppercase
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/hrthis.db")

# Create engine and session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def fix_enum_values():
    """Update enum values to uppercase"""
    db = SessionLocal()
    
    try:
        # Update employment_type values to uppercase
        result = db.execute(text("""
            UPDATE employees 
            SET employment_type = UPPER(employment_type)
            WHERE employment_type IN ('fulltime', 'parttime', 'minijob', 'internship', 'other')
        """))
        print(f"Updated {result.rowcount} employment_type values")
        
        # Update status values to uppercase
        result = db.execute(text("""
            UPDATE employees 
            SET status = UPPER(status)
            WHERE status IN ('active', 'inactive', 'terminated', 'on_leave')
        """))
        print(f"Updated {result.rowcount} status values")
        
        # Update role values to uppercase
        result = db.execute(text("""
            UPDATE employees 
            SET role = UPPER(role)
            WHERE role IN ('user', 'admin', 'superadmin')
        """))
        print(f"Updated {result.rowcount} role values")
        
        # Fix EMPLOYEE role to USER
        result = db.execute(text("""
            UPDATE employees 
            SET role = 'USER'
            WHERE role = 'EMPLOYEE'
        """))
        print(f"Fixed {result.rowcount} EMPLOYEE roles to USER")
        
        db.commit()
        print("✅ Database enum values fixed successfully")
        
    except Exception as e:
        print(f"❌ Error fixing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_enum_values()