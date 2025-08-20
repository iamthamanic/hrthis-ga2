"""
Employee Service Layer
Provides secure database operations for employee management
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from sqlalchemy.exc import IntegrityError
import logging

from app.models.employee import Employee, EmployeeStatus
from app.schemas.employee import EmployeeCreate, EmployeeUpdate

logger = logging.getLogger(__name__)


class EmployeeService:
    """Service class for employee-related operations"""
    
    @staticmethod
    def generate_employee_number(db: Session) -> str:
        """
        Generate unique employee number with format: PN-YYYYNNNN
        Uses proper parameterized queries to prevent SQL injection
        """
        current_year = datetime.now().year
        prefix = f"PN-{current_year}"
        
        # Use SQLAlchemy ORM query - safe from SQL injection
        last_employee = db.query(Employee)\
            .filter(Employee.employee_number.like(f"{prefix}%"))\
            .order_by(Employee.employee_number.desc())\
            .first()
        
        if last_employee and last_employee.employee_number:
            try:
                # Extract sequence number safely
                last_sequence = int(last_employee.employee_number.split('-')[-1])
                new_sequence = last_sequence + 1
            except (ValueError, IndexError):
                logger.warning(f"Invalid employee number format: {last_employee.employee_number}")
                new_sequence = 1
        else:
            new_sequence = 1
        
        return f"{prefix}{new_sequence:04d}"
    
    @staticmethod
    def create_employee(
        db: Session,
        employee_data: EmployeeCreate,
        created_by: Optional[str] = None
    ) -> Employee:
        """
        Create new employee with validation and secure defaults
        """
        # Generate employee number if not provided
        if not employee_data.employee_number:
            employee_data.employee_number = EmployeeService.generate_employee_number(db)
        
        # Create employee instance
        db_employee = Employee(**employee_data.dict())
        
        # Set metadata
        db_employee.created_at = datetime.utcnow()
        db_employee.created_by = created_by
        db_employee.status = db_employee.status or EmployeeStatus.ACTIVE
        
        try:
            db.add(db_employee)
            db.commit()
            db.refresh(db_employee)
            logger.info(f"Created employee: {db_employee.employee_number}")
            return db_employee
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Failed to create employee: {str(e)}")
            raise ValueError(f"Employee with this email or employee number already exists")
    
    @staticmethod
    def update_employee(
        db: Session,
        employee_id: str,
        update_data: EmployeeUpdate,
        updated_by: Optional[str] = None
    ) -> Optional[Employee]:
        """
        Update employee with validation
        """
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        
        if not employee:
            return None
        
        # Update fields
        update_dict = update_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(employee, field, value)
        
        # Set metadata
        employee.updated_at = datetime.utcnow()
        employee.updated_by = updated_by
        
        try:
            db.commit()
            db.refresh(employee)
            logger.info(f"Updated employee: {employee.employee_number}")
            return employee
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Failed to update employee: {str(e)}")
            raise ValueError(f"Update would violate unique constraint")
    
    @staticmethod
    def search_employees(
        db: Session,
        search_term: Optional[str] = None,
        department: Optional[str] = None,
        status: Optional[EmployeeStatus] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Employee]:
        """
        Search employees with filters - SQL injection safe
        """
        query = db.query(Employee)
        
        # Apply filters using SQLAlchemy ORM - safe from injection
        if search_term:
            # Use parameterized LIKE query
            search_pattern = f"%{search_term}%"
            query = query.filter(
                or_(
                    Employee.first_name.ilike(search_pattern),
                    Employee.last_name.ilike(search_pattern),
                    Employee.email.ilike(search_pattern),
                    Employee.employee_number.ilike(search_pattern)
                )
            )
        
        if department:
            query = query.filter(Employee.department == department)
        
        if status:
            query = query.filter(Employee.status == status)
        
        # Apply pagination
        return query.limit(limit).offset(offset).all()
    
    @staticmethod
    def get_employee_stats(db: Session) -> Dict[str, Any]:
        """
        Get employee statistics - uses ORM aggregation functions
        """
        total_count = db.query(func.count(Employee.id)).scalar()
        
        active_count = db.query(func.count(Employee.id))\
            .filter(Employee.status == EmployeeStatus.ACTIVE)\
            .scalar()
        
        departments = db.query(
            Employee.department,
            func.count(Employee.id).label('count')
        ).group_by(Employee.department).all()
        
        return {
            "total": total_count,
            "active": active_count,
            "inactive": total_count - active_count,
            "by_department": {
                dept: count for dept, count in departments if dept
            }
        }
    
    @staticmethod
    def validate_unique_fields(
        db: Session,
        email: Optional[str] = None,
        employee_number: Optional[str] = None,
        exclude_id: Optional[str] = None
    ) -> Dict[str, bool]:
        """
        Check if email or employee_number already exists
        """
        result = {
            "email_exists": False,
            "employee_number_exists": False
        }
        
        if email:
            query = db.query(Employee).filter(Employee.email == email)
            if exclude_id:
                query = query.filter(Employee.id != exclude_id)
            result["email_exists"] = query.first() is not None
        
        if employee_number:
            query = db.query(Employee).filter(Employee.employee_number == employee_number)
            if exclude_id:
                query = query.filter(Employee.id != exclude_id)
            result["employee_number_exists"] = query.first() is not None
        
        return result