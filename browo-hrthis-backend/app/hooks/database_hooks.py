"""
SQLAlchemy Event Hooks for Database Operations
Provides automatic actions on database events like insert, update, delete
"""

from datetime import datetime
from typing import Any, Dict, Optional
from sqlalchemy import event
from sqlalchemy.orm import Session, Mapper
from sqlalchemy.orm.attributes import get_history
import logging
import json
from app.models.employee import Employee, Base
from app.services.email_service import EmailService

logger = logging.getLogger(__name__)

# Audit trail storage (in production, use a proper audit table)
audit_trail = []

class DatabaseHooks:
    """Central manager for database event hooks"""
    
    @staticmethod
    def register_all_hooks():
        """Register all database hooks"""
        DatabaseHooks.register_employee_hooks()
        DatabaseHooks.register_audit_hooks()
        DatabaseHooks.register_cache_hooks()
    
    @staticmethod
    def register_employee_hooks():
        """Register hooks specific to Employee model"""
        
        @event.listens_for(Employee, 'before_insert')
        def before_employee_insert(mapper: Mapper, connection, target: Employee):
            """Auto-generate employee number before insert"""
            if not target.employee_number:
                # Generate employee number based on current year and sequence
                current_year = datetime.now().year
                
                # Get the last employee number for this year
                # In production, use a proper sequence or atomic counter
                from app.core.database import get_db
                db = next(get_db())
                
                last_employee = db.query(Employee).filter(
                    Employee.employee_number.like(f'PN-{current_year}%')
                ).order_by(Employee.employee_number.desc()).first()
                
                if last_employee and last_employee.employee_number:
                    # Extract the sequence number
                    last_sequence = int(last_employee.employee_number.split('-')[-1])
                    new_sequence = last_sequence + 1
                else:
                    new_sequence = 1
                
                target.employee_number = f'PN-{current_year}{new_sequence:04d}'
                logger.info(f"Generated employee number: {target.employee_number}")
            
            # Set creation timestamp
            if not target.created_at:
                target.created_at = datetime.utcnow()
            
            # Set default status
            if not target.status:
                from app.models.employee import EmployeeStatus
                target.status = EmployeeStatus.ACTIVE
            
            # Validate required fields
            if not target.email:
                raise ValueError("Email is required for new employee")
            
            logger.info(f"Creating new employee: {target.email}")
        
        @event.listens_for(Employee, 'after_insert')
        def after_employee_insert(mapper: Mapper, connection, target: Employee):
            """Send welcome email after employee creation"""
            try:
                # Send welcome email asynchronously
                email_service = EmailService()
                
                # Determine email template based on role
                if target.is_admin:
                    template = "admin_welcome"
                else:
                    template = "employee_welcome"
                
                # Queue email for sending (in production, use a proper queue)
                email_data = {
                    "to": target.email,
                    "template": template,
                    "data": {
                        "first_name": target.first_name,
                        "last_name": target.last_name,
                        "employee_number": target.employee_number,
                        "position": target.position,
                        "start_date": target.start_date.isoformat() if target.start_date else None
                    }
                }
                
                # In production, add to email queue instead of sending directly
                logger.info(f"Queued welcome email for {target.email}")
                
                # Trigger onboarding workflow
                _trigger_onboarding_workflow(target)
                
            except Exception as e:
                logger.error(f"Error in after_employee_insert hook: {e}")
        
        @event.listens_for(Employee, 'before_update')
        def before_employee_update(mapper: Mapper, connection, target: Employee):
            """Audit trail logging before update"""
            # Update the updated_at timestamp
            target.updated_at = datetime.utcnow()
            
            # Create audit log entry
            changes = {}
            for attr in mapper.attrs:
                hist = get_history(target, attr.key)
                if hist.has_changes():
                    changes[attr.key] = {
                        "old": hist.deleted[0] if hist.deleted else None,
                        "new": hist.added[0] if hist.added else None
                    }
            
            if changes:
                audit_entry = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "entity": "Employee",
                    "entity_id": target.id,
                    "action": "UPDATE",
                    "changes": changes,
                    "user": target.updated_by if hasattr(target, 'updated_by') else "system"
                }
                audit_trail.append(audit_entry)
                logger.info(f"Audit log: Employee {target.id} updated with changes: {list(changes.keys())}")
        
        @event.listens_for(Employee, 'after_update')
        def after_employee_update(mapper: Mapper, connection, target: Employee):
            """Cache invalidation and notifications after update"""
            # Invalidate cache for this employee
            _invalidate_employee_cache(target.id)
            
            # Check for significant changes that require notifications
            for attr in mapper.attrs:
                hist = get_history(target, attr.key)
                if hist.has_changes():
                    # Notify on salary changes
                    if attr.key == 'salary' and hist.deleted and hist.added:
                        old_salary = hist.deleted[0]
                        new_salary = hist.added[0]
                        if old_salary != new_salary:
                            _notify_salary_change(target, old_salary, new_salary)
                    
                    # Notify on status changes
                    if attr.key == 'status' and hist.deleted and hist.added:
                        old_status = hist.deleted[0]
                        new_status = hist.added[0]
                        if old_status != new_status:
                            _notify_status_change(target, old_status, new_status)
        
        @event.listens_for(Employee, 'before_delete')
        def before_employee_delete(mapper: Mapper, connection, target: Employee):
            """Soft delete implementation"""
            # Instead of actual deletion, mark as terminated
            from app.models.employee import EmployeeStatus
            
            # Log the deletion attempt
            audit_entry = {
                "timestamp": datetime.utcnow().isoformat(),
                "entity": "Employee",
                "entity_id": target.id,
                "action": "DELETE_ATTEMPT",
                "user": target.updated_by if hasattr(target, 'updated_by') else "system"
            }
            audit_trail.append(audit_entry)
            
            # Prevent actual deletion - raise exception to stop it
            raise ValueError(
                "Direct deletion not allowed. Please set status to TERMINATED instead."
            )
    
    @staticmethod
    def register_audit_hooks():
        """Register general audit hooks for all models"""
        
        @event.listens_for(Base, 'after_insert', propagate=True)
        def receive_after_insert(mapper, connection, target):
            """Generic audit for all inserts"""
            if hasattr(target, '__tablename__'):
                logger.debug(f"Inserted {target.__tablename__}: {target.id if hasattr(target, 'id') else 'no-id'}")
        
        @event.listens_for(Base, 'after_delete', propagate=True)
        def receive_after_delete(mapper, connection, target):
            """Generic audit for all deletes"""
            if hasattr(target, '__tablename__'):
                logger.warning(f"Deleted {target.__tablename__}: {target.id if hasattr(target, 'id') else 'no-id'}")
    
    @staticmethod
    def register_cache_hooks():
        """Register cache invalidation hooks"""
        
        @event.listens_for(Session, 'after_commit')
        def receive_after_commit(session: Session):
            """Invalidate relevant caches after commit"""
            # In production, implement proper cache invalidation
            logger.debug("Database commit completed - cache invalidation triggered")
        
        @event.listens_for(Session, 'after_rollback')
        def receive_after_rollback(session: Session):
            """Handle rollback events"""
            logger.warning("Database rollback occurred")


# Helper functions for hooks

def _trigger_onboarding_workflow(employee: Employee):
    """Trigger the onboarding workflow for new employee"""
    try:
        # Create onboarding tasks
        onboarding_tasks = [
            {"task": "Setup workstation", "assigned_to": "IT", "due_days": 1},
            {"task": "Create email account", "assigned_to": "IT", "due_days": 0},
            {"task": "Schedule orientation", "assigned_to": "HR", "due_days": 2},
            {"task": "Prepare welcome kit", "assigned_to": "HR", "due_days": 1},
            {"task": "Assign mentor", "assigned_to": "Manager", "due_days": 3},
        ]
        
        # In production, create actual task records
        logger.info(f"Created {len(onboarding_tasks)} onboarding tasks for {employee.email}")
        
        # Mark onboarding as initiated
        employee.onboarding_email_sent = datetime.utcnow()
        
    except Exception as e:
        logger.error(f"Error triggering onboarding workflow: {e}")


def _invalidate_employee_cache(employee_id: str):
    """Invalidate cache entries for specific employee"""
    # In production, implement actual cache invalidation
    # For example, using Redis:
    # redis_client.delete(f"employee:{employee_id}")
    # redis_client.delete(f"employee:list")
    logger.debug(f"Cache invalidated for employee {employee_id}")


def _notify_salary_change(employee: Employee, old_salary: int, new_salary: int):
    """Send notification about salary change"""
    try:
        change_percentage = ((new_salary - old_salary) / old_salary) * 100 if old_salary else 100
        
        notification = {
            "type": "SALARY_CHANGE",
            "employee_id": employee.id,
            "employee_name": employee.full_name,
            "old_salary": old_salary,
            "new_salary": new_salary,
            "change_percentage": round(change_percentage, 2),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # In production, send to notification service
        logger.info(f"Salary change notification: {employee.full_name} - {change_percentage:+.2f}%")
        
    except Exception as e:
        logger.error(f"Error sending salary change notification: {e}")


def _notify_status_change(employee: Employee, old_status, new_status):
    """Send notification about employee status change"""
    try:
        notification = {
            "type": "STATUS_CHANGE",
            "employee_id": employee.id,
            "employee_name": employee.full_name,
            "old_status": old_status.value if hasattr(old_status, 'value') else str(old_status),
            "new_status": new_status.value if hasattr(new_status, 'value') else str(new_status),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Special handling for termination
        if str(new_status) == "TERMINATED":
            # Trigger offboarding workflow
            _trigger_offboarding_workflow(employee)
        
        # In production, send to notification service
        logger.info(f"Status change notification: {employee.full_name} - {old_status} → {new_status}")
        
    except Exception as e:
        logger.error(f"Error sending status change notification: {e}")


def _trigger_offboarding_workflow(employee: Employee):
    """Trigger the offboarding workflow for terminated employee"""
    try:
        offboarding_tasks = [
            {"task": "Revoke system access", "assigned_to": "IT", "priority": "HIGH"},
            {"task": "Collect company property", "assigned_to": "HR", "priority": "HIGH"},
            {"task": "Conduct exit interview", "assigned_to": "HR", "priority": "MEDIUM"},
            {"task": "Process final payroll", "assigned_to": "Finance", "priority": "HIGH"},
            {"task": "Update documentation", "assigned_to": "HR", "priority": "LOW"},
        ]
        
        logger.info(f"Created {len(offboarding_tasks)} offboarding tasks for {employee.email}")
        
    except Exception as e:
        logger.error(f"Error triggering offboarding workflow: {e}")


# Export functions
def get_audit_trail(entity_id: Optional[str] = None, 
                   entity_type: Optional[str] = None,
                   limit: int = 100) -> list:
    """Get audit trail entries"""
    result = audit_trail
    
    if entity_id:
        result = [a for a in result if a.get('entity_id') == entity_id]
    
    if entity_type:
        result = [a for a in result if a.get('entity') == entity_type]
    
    return result[-limit:]


def clear_audit_trail():
    """Clear audit trail (for testing only)"""
    global audit_trail
    audit_trail = []