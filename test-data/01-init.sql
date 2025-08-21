-- Test Database Initialization Script
-- This creates test data for E2E testing

-- Ensure extensions are created
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test organization
INSERT INTO organizations (id, name, slug, created_at, updated_at)
VALUES 
  ('test-org-1', 'Test Organization', 'test-org', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create test users with different roles
INSERT INTO users (
  id, email, hashed_password, first_name, last_name, 
  role, organization_id, employee_number, position, 
  department, employment_status, created_at, updated_at
)
VALUES 
  -- Admin user (password: admin123)
  (
    'admin-user-1',
    'admin@test.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5L2iGkAB4rFiO',  -- bcrypt hash of 'admin123'
    'Admin',
    'User',
    'ADMIN',
    'test-org-1',
    'PN-00001',
    'System Administrator',
    'IT',
    'ACTIVE',
    NOW(),
    NOW()
  ),
  -- Manager user (password: manager123)
  (
    'manager-user-1',
    'manager@test.com',
    '$2b$12$YRfwz5eXTXDQr7YFPpqFhOaK0LpAQrz8KhYYCqT8xQN8XrD7Aju6.',  -- bcrypt hash of 'manager123'
    'Manager',
    'User',
    'MANAGER',
    'test-org-1',
    'PN-00002',
    'Department Manager',
    'HR',
    'ACTIVE',
    NOW(),
    NOW()
  ),
  -- Regular employee (password: employee123)
  (
    'employee-user-1',
    'employee@test.com',
    '$2b$12$iE5sthN7kBrQY.VKv2p3OeMqzFLQqF/nVKhYvKhXFkJYGqMJwxZ8O',  -- bcrypt hash of 'employee123'
    'John',
    'Doe',
    'EMPLOYEE',
    'test-org-1',
    'PN-00003',
    'Software Developer',
    'IT',
    'ACTIVE',
    NOW(),
    NOW()
  ),
  -- Part-time employee (password: employee123)
  (
    'employee-user-2',
    'parttime@test.com',
    '$2b$12$iE5sthN7kBrQY.VKv2p3OeMqzFLQqF/nVKhYvKhXFkJYGqMJwxZ8O',
    'Jane',
    'Smith',
    'EMPLOYEE',
    'test-org-1',
    'PN-00004',
    'Designer',
    'Marketing',
    'ACTIVE',
    NOW(),
    NOW()
  ),
  -- Inactive employee (password: employee123)
  (
    'employee-user-3',
    'inactive@test.com',
    '$2b$12$iE5sthN7kBrQY.VKv2p3OeMqzFLQqF/nVKhYvKhXFkJYGqMJwxZ8O',
    'Bob',
    'Wilson',
    'EMPLOYEE',
    'test-org-1',
    'PN-00005',
    'Former Employee',
    'Sales',
    'INACTIVE',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Create employee details for test users
INSERT INTO employee_details (
  user_id, weekly_hours, vacation_days, employment_type,
  join_date, birth_date, phone, private_email,
  street, postal_code, city, country,
  iban, bic, bank_name
)
VALUES 
  (
    'admin-user-1',
    40,
    30,
    'FULL_TIME',
    '2020-01-01',
    '1980-05-15',
    '+49 30 12345678',
    'admin.private@gmail.com',
    'Hauptstraße 1',
    '10115',
    'Berlin',
    'Germany',
    'DE89370400440532013000',
    'COBADEFFXXX',
    'Commerzbank'
  ),
  (
    'manager-user-1',
    40,
    28,
    'FULL_TIME',
    '2021-03-15',
    '1985-08-20',
    '+49 30 23456789',
    'manager.private@gmail.com',
    'Friedrichstraße 50',
    '10117',
    'Berlin',
    'Germany',
    'DE89370400440532013001',
    'COBADEFFXXX',
    'Commerzbank'
  ),
  (
    'employee-user-1',
    40,
    25,
    'FULL_TIME',
    '2022-06-01',
    '1990-12-10',
    '+49 30 34567890',
    'john.private@gmail.com',
    'Alexanderplatz 10',
    '10178',
    'Berlin',
    'Germany',
    'DE89370400440532013002',
    'COBADEFFXXX',
    'Commerzbank'
  ),
  (
    'employee-user-2',
    20,
    15,
    'PART_TIME',
    '2023-01-15',
    '1992-03-25',
    '+49 30 45678901',
    'jane.private@gmail.com',
    'Potsdamer Platz 5',
    '10785',
    'Berlin',
    'Germany',
    'DE89370400440532013003',
    'COBADEFFXXX',
    'Commerzbank'
  ),
  (
    'employee-user-3',
    0,
    0,
    'FULL_TIME',
    '2019-09-01',
    '1988-07-30',
    '+49 30 56789012',
    'bob.private@gmail.com',
    'Kurfürstendamm 100',
    '10709',
    'Berlin',
    'Germany',
    'DE89370400440532013004',
    'COBADEFFXXX',
    'Commerzbank'
  )
ON CONFLICT (user_id) DO NOTHING;

-- Create some vacation requests for testing
INSERT INTO vacation_requests (
  id, user_id, start_date, end_date, days_requested,
  status, reason, created_at, updated_at
)
VALUES 
  (
    uuid_generate_v4(),
    'employee-user-1',
    '2024-07-01',
    '2024-07-14',
    10,
    'APPROVED',
    'Summer vacation',
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'employee-user-2',
    '2024-08-15',
    '2024-08-20',
    4,
    'PENDING',
    'Family visit',
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'manager-user-1',
    '2024-09-01',
    '2024-09-07',
    5,
    'APPROVED',
    'Conference attendance',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Output test credentials for reference
SELECT 
  'Test Users Created:' as info
UNION ALL
SELECT 
  '- admin@test.com / admin123 (Admin)'
UNION ALL
SELECT 
  '- manager@test.com / manager123 (Manager)'
UNION ALL
SELECT 
  '- employee@test.com / employee123 (Employee)'
UNION ALL
SELECT 
  '- parttime@test.com / employee123 (Part-time)'
UNION ALL
SELECT 
  '- inactive@test.com / employee123 (Inactive)';