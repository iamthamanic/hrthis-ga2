#!/usr/bin/env python3
"""Test server to debug the employee endpoint issue"""

import sys
import os
import traceback

# Ensure we're in the right directory
os.chdir('/Users/halteverbotsocialmacpro/Desktop/arsvivai/HRthis/browo-hrthis-backend')
sys.path.insert(0, '.')

from app.main import app
from app.core.database import SessionLocal, create_tables
from app.models.employee import Employee
from app.schemas.employee import EmployeeResponse, EmployeeList

# Test the conversion directly
def test_conversion():
    print("Testing conversion...")
    # Ensure tables exist before querying
    try:
        create_tables()
    except Exception as e:
        print(f"Warning: could not create tables: {e}")
    db = SessionLocal()
    try:
        employees = db.query(Employee).all()
        print(f"Found {len(employees)} employees in database")
        
        # Try to convert each one
        responses = []
        for emp in employees:
            print(f"  Converting {emp.email}...")
            try:
                response = EmployeeResponse.from_orm(emp)
                responses.append(response)
                print(f"    ✅ Success")
            except Exception as e:
                print(f"    ❌ Error: {e}")
                traceback.print_exc()
        
        # Try to create the list response
        print("\nCreating EmployeeList...")
        try:
            emp_list = EmployeeList(
                employees=responses,
                total=len(responses),
                page=1,
                size=50
            )
            print(f"✅ EmployeeList created successfully with {emp_list.total} employees")
        except Exception as e:
            print(f"❌ Error creating EmployeeList: {e}")
            traceback.print_exc()
            
    finally:
        db.close()

# Run the test
if __name__ == "__main__":
    print("=" * 50)
    print("TESTING EMPLOYEE ENDPOINT")
    print("=" * 50)
    test_conversion()
    
    print("\n" + "=" * 50)
    print("STARTING SERVER")
    print("=" * 50)
    
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002, log_level="debug")