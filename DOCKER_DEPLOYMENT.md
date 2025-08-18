# HRthis Docker Deployment Guide

## 🚀 Quick Start

### One-Command Deployment
```bash
./start-docker.sh
```

This will:
1. Build Frontend (React) and Backend (FastAPI) containers
2. Start all services (Frontend, Backend, Database)
3. Initialize demo users automatically
4. Show you the access URLs and credentials

## 📦 What's Included

### Services
- **Frontend**: React application on port 4173
- **Backend**: FastAPI with JWT authentication on port 8002
- **Database**: SQLite (default) or PostgreSQL (optional)
- **File Storage**: Persistent volume for uploads

### Architecture
```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │
│  (React:4173)   │     │  (FastAPI:8002) │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │    Database     │
                        │    (SQLite)     │
                        └─────────────────┘
```

## 🔐 Login Credentials

### Employee Account
- **Email**: `max.mustermann@hrthis.de`
- **Password**: `password`
- **Role**: Employee
- **Features**: View own profile, request leave, see dashboard

### Admin Account
- **Email**: `anna.admin@hrthis.de`
- **Password**: `password`
- **Role**: Admin
- **Features**: Manage all employees, approve requests, full access

### Additional Test Account
- **Email**: `tom.test@hrthis.de`
- **Password**: `password`
- **Role**: Employee (Part-time)

## 🛠️ Manual Docker Commands

### Start Everything
```bash
# Using docker-compose directly
docker-compose -f docker-compose.local.yml up -d

# Or with build
docker-compose -f docker-compose.local.yml up --build -d
```

### Stop Everything
```bash
docker-compose -f docker-compose.local.yml down
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.local.yml logs -f

# Specific service
docker-compose -f docker-compose.local.yml logs -f backend
docker-compose -f docker-compose.local.yml logs -f frontend
```

### Restart Services
```bash
docker-compose -f docker-compose.local.yml restart
```

### Reset Everything (including data)
```bash
docker-compose -f docker-compose.local.yml down -v
rm -rf backend-data uploads
```

## 🔧 Configuration

### Environment Variables
Edit `.env.docker` to customize:

```env
# Ports
FRONTEND_PORT=4173
BACKEND_PORT=8002

# API URL (for frontend to connect to backend)
REACT_APP_API_URL=http://localhost:8002

# Database (SQLite by default)
DATABASE_URL=sqlite:///./data/hrthis.db

# Security
SECRET_KEY=your-secret-key-here
```

### Using PostgreSQL Instead of SQLite

1. Uncomment PostgreSQL service in `docker-compose.local.yml`
2. Update `.env.docker`:
```env
DATABASE_URL=postgresql://hrthis:hrthis123@postgres:5432/hrthis
```
3. Restart services

## 📊 Available Endpoints

### Frontend
- **Application**: http://localhost:4173
- **Login Page**: http://localhost:4173/login
- **Dashboard**: http://localhost:4173/dashboard

### Backend API
- **API Base**: http://localhost:8002
- **API Documentation**: http://localhost:8002/docs
- **Health Check**: http://localhost:8002/health

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `GET /api/employees/` - List all employees (Admin only)
- `POST /api/employees/` - Create employee (Admin only)
- `PATCH /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee (Admin only)

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check logs
docker-compose -f docker-compose.local.yml logs backend

# Rebuild backend
docker-compose -f docker-compose.local.yml build backend
```

### Frontend Can't Connect to Backend
1. Check CORS settings in backend
2. Verify `REACT_APP_API_URL` in frontend environment
3. Ensure backend is running: `curl http://localhost:8002/health`

### Database Issues
```bash
# Reset database
docker-compose -f docker-compose.local.yml down -v
rm -rf backend-data
./start-docker.sh
```

### Port Already in Use
```bash
# Find process using port
lsof -i :4173  # Frontend
lsof -i :8002  # Backend

# Kill process
kill -9 <PID>
```

## 🚀 Production Deployment

For production, consider:

1. **Use PostgreSQL** instead of SQLite
2. **Set strong SECRET_KEY** in environment
3. **Configure proper CORS origins**
4. **Use HTTPS with proper certificates**
5. **Set up backup strategy for database**
6. **Configure monitoring and logging**

### Production Docker Compose
Use `docker-compose.production.yml` with:
- PostgreSQL database
- Traefik for SSL/routing
- Volume mounts for persistence
- Health checks
- Restart policies

## 📝 Development Tips

### Access Container Shell
```bash
# Backend shell
docker-compose -f docker-compose.local.yml exec backend /bin/bash

# Frontend shell
docker-compose -f docker-compose.local.yml exec frontend /bin/sh
```

### Run Backend Commands
```bash
# Create new migration
docker-compose -f docker-compose.local.yml exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose -f docker-compose.local.yml exec backend alembic upgrade head

# Initialize demo users manually
docker-compose -f docker-compose.local.yml exec backend python init_demo_users.py
```

### Hot Reload (Development)
Backend automatically reloads on code changes when volumes are mounted.

## 🔗 Related Documentation

- [Frontend README](./HRthis/README.md)
- [Backend README](./browo-hrthis-backend/README.md)
- [Deployment Options](./DEPLOYMENT_COMPARISON.md)
- [API Documentation](http://localhost:8002/docs) (when running)

---

## Quick Reference Card

```
🚀 Start:        ./start-docker.sh
🛑 Stop:         docker-compose -f docker-compose.local.yml down
📊 Status:       docker-compose -f docker-compose.local.yml ps
📜 Logs:         docker-compose -f docker-compose.local.yml logs -f
🔄 Restart:      docker-compose -f docker-compose.local.yml restart

🌐 Frontend:     http://localhost:4173
🔧 Backend:      http://localhost:8002
📚 API Docs:     http://localhost:8002/docs

👤 Employee:     max.mustermann@hrthis.de / password
👨‍💼 Admin:        anna.admin@hrthis.de / password
```

---
*Last updated: August 2025*