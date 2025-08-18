#!/bin/bash

# HRthis Simplified Deployment Script
# This script provides options for simplified deployment

set -e

echo "🚀 HRthis Simplified Deployment"
echo "================================"
echo ""
echo "Choose deployment strategy:"
echo "1) Static Frontend (Netlify) + Managed Backend (Railway) [RECOMMENDED]"
echo "2) Single Docker Container with Caddy"
echo "3) Optimized Coolify Setup"
echo "4) Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🌟 Setting up Static + Managed deployment..."
        echo ""
        
        # Check if required tools are installed
        if ! command -v npm &> /dev/null; then
            echo "❌ npm is not installed. Please install Node.js first."
            exit 1
        fi
        
        # Frontend deployment
        echo "📦 Building Frontend..."
        cd HRthis/HRthis
        
        # Check if backend URL is set
        read -p "Enter your backend URL (e.g., https://hrthis-backend.railway.app): " BACKEND_URL
        
        # Build frontend
        REACT_APP_API_URL=$BACKEND_URL npm run build
        
        # Create netlify.toml
        cat > netlify.toml << EOF
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  REACT_APP_API_URL = "$BACKEND_URL"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
EOF
        
        echo "✅ Frontend built successfully!"
        echo "📝 netlify.toml created"
        echo ""
        echo "Next steps:"
        echo "1. Install Netlify CLI: npm install -g netlify-cli"
        echo "2. Login to Netlify: netlify login"
        echo "3. Deploy: netlify deploy --prod --dir=build"
        echo "4. Configure custom domain hrthis.kibubot.com in Netlify dashboard"
        echo ""
        
        # Backend deployment helper
        cd ../../browo-hrthis-backend
        
        # Create railway.toml
        cat > railway.toml << EOF
[build]
  builder = "dockerfile"

[variables]
  PORT = "8000"

[deploy]
  healthcheckPath = "/docs"
  healthcheckTimeout = 300s
  restartPolicyType = "ON_FAILURE"
EOF
        
        echo "📝 railway.toml created for backend"
        echo ""
        echo "Backend deployment steps:"
        echo "1. Install Railway CLI: npm install -g @railway/cli"
        echo "2. Login to Railway: railway login"
        echo "3. Create new project: railway new"
        echo "4. Add PostgreSQL: railway add postgresql"
        echo "5. Deploy: railway up"
        echo "6. Set environment variables in Railway dashboard:"
        echo "   - SECRET_KEY=your-secret-key"
        echo "   - ALGORITHM=HS256"
        echo "   - ACCESS_TOKEN_EXPIRE_MINUTES=30"
        
        ;;
        
    2)
        echo ""
        echo "🐳 Setting up Single Docker Container deployment..."
        echo ""
        
        # Create simplified docker-compose
        cd /Users/halteverbotsocialmacpro/Desktop/arsvivai/HRthis
        
        cat > docker-compose.simple.yml << EOF
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:16
    container_name: hrthis-db
    environment:
      POSTGRES_DB: hrthis
      POSTGRES_USER: hrthis
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-changeme123}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hrthis"]
      interval: 10s
      timeout: 5s
      retries: 3

  # Backend
  backend:
    build: ./browo-hrthis-backend
    container_name: hrthis-backend
    environment:
      DATABASE_URL: postgresql://hrthis:\${POSTGRES_PASSWORD:-changeme123}@postgres:5432/hrthis
      SECRET_KEY: \${SECRET_KEY:-change-this-secret-key-in-production}
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 30
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./browo-hrthis-backend/uploads:/app/uploads
    restart: unless-stopped

  # Reverse Proxy with Caddy (simpler than Traefik)
  caddy:
    image: caddy:2-alpine
    container_name: hrthis-caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./HRthis/HRthis/build:/srv/frontend:ro
      - caddy_data:/data
      - caddy_config:/config
    restart: unless-stopped
    depends_on:
      - backend

volumes:
  postgres_data:
  caddy_data:
  caddy_config:
EOF

        # Create Caddyfile
        cat > Caddyfile << EOF
# Frontend
hrthis.kibubot.com {
    root * /srv/frontend
    file_server
    
    # SPA routing - serve index.html for all routes
    try_files {path} /index.html
    
    # Security headers
    header {
        # Enable HSTS
        Strict-Transport-Security max-age=31536000;
        # Prevent MIME sniffing
        X-Content-Type-Options nosniff
        # Prevent clickjacking
        X-Frame-Options DENY
        # XSS protection
        X-XSS-Protection "1; mode=block"
    }
    
    # Cache static assets
    @static {
        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2
    }
    header @static {
        Cache-Control "public, max-age=31536000, immutable"
    }
}

# Backend API
hrthis-api.kibubot.com {
    reverse_proxy backend:8000
    
    # CORS headers
    header {
        Access-Control-Allow-Origin https://hrthis.kibubot.com
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Authorization, Content-Type"
        Access-Control-Max-Age 86400
    }
}
EOF

        # Create environment file
        cat > .env.simple << EOF
# Database
POSTGRES_PASSWORD=changeme123

# Backend
SECRET_KEY=change-this-secret-key-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (optional - for Brevo integration)
# BREVO_API_KEY=your-brevo-api-key
# FROM_EMAIL=noreply@hrthis.kibubot.com
EOF

        # Build frontend first
        echo "📦 Building frontend..."
        cd HRthis/HRthis
        REACT_APP_API_URL=https://hrthis-api.kibubot.com npm run build
        cd ../..
        
        echo "✅ Simple Docker setup created!"
        echo ""
        echo "Files created:"
        echo "- docker-compose.simple.yml (simplified Docker Compose)"
        echo "- Caddyfile (replaces complex Traefik config)"
        echo "- .env.simple (environment variables)"
        echo ""
        echo "Next steps:"
        echo "1. Edit .env.simple with your secure passwords"
        echo "2. Run: docker-compose -f docker-compose.simple.yml up --build -d"
        echo "3. Check logs: docker-compose -f docker-compose.simple.yml logs -f"
        echo ""
        echo "🌟 Benefits of this setup:"
        echo "- Single configuration file instead of 6"
        echo "- Automatic HTTPS with Caddy"
        echo "- No complex Traefik configuration"
        echo "- Built-in health checks"
        echo "- Security headers included"
        
        ;;
        
    3)
        echo ""
        echo "☁️ Setting up Optimized Coolify deployment..."
        echo ""
        
        # Create Coolify-optimized configurations
        cd /Users/halteverbotsocialmacpro/Desktop/arsvivai/HRthis
        
        # Frontend configuration for Coolify
        cd HRthis/HRthis
        cat > Dockerfile.coolify << EOF
# Multi-stage build for React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=\$REACT_APP_API_URL

RUN npm run build

# Production stage with nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Optimized nginx config for SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /static/ { \
        root /usr/share/nginx/html; \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

        # Backend configuration for Coolify
        cd ../../browo-hrthis-backend
        cat > Dockerfile.coolify << EOF
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    libpq-dev \\
    libmagic1 \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/docs || exit 1

EXPOSE 8000

# Run with gunicorn for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
EOF

        cd ..
        
        # Create Coolify deployment guide
        cat > COOLIFY_DEPLOYMENT.md << EOF
# Coolify Deployment Guide

## Frontend App Setup

1. **Create New App in Coolify:**
   - Type: Docker
   - Repository: Your Git repository
   - Dockerfile: Dockerfile.coolify (in HRthis/HRthis/)

2. **Environment Variables:**
   \`\`\`
   REACT_APP_API_URL=https://your-backend-domain.com
   \`\`\`

3. **Build Settings:**
   - Build Context: ./HRthis/HRthis
   - Dockerfile: Dockerfile.coolify

4. **Domain:**
   - Add custom domain: hrthis.kibubot.com
   - Enable automatic SSL

## Backend App Setup

1. **Create New App in Coolify:**
   - Type: Docker
   - Repository: Your Git repository
   - Dockerfile: Dockerfile.coolify (in browo-hrthis-backend/)

2. **Add PostgreSQL Database:**
   - Create new PostgreSQL service in Coolify
   - Note the connection details

3. **Environment Variables:**
   \`\`\`
   DATABASE_URL=postgresql://user:pass@postgres-service:5432/hrthis
   SECRET_KEY=your-super-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   \`\`\`

4. **Build Settings:**
   - Build Context: ./browo-hrthis-backend
   - Dockerfile: Dockerfile.coolify

5. **Health Check:**
   - Enabled automatically via Dockerfile

## Benefits of Coolify Setup:

✅ **Simplified Management:**
- Single interface for both apps
- Built-in database management
- Automatic SSL certificates
- One-click deployments

✅ **Reduced Complexity:**
- No docker-compose files needed
- No manual Traefik configuration
- Coolify handles reverse proxy
- Built-in monitoring and logs

✅ **Scalability:**
- Easy horizontal scaling
- Resource monitoring
- Automatic restarts on failure

## Migration Steps:

1. Create frontend app in Coolify with hrthis.kibubot.com domain
2. Create backend app in Coolify
3. Add PostgreSQL database service
4. Configure environment variables
5. Deploy both applications
6. Test functionality
7. Update DNS if needed
8. Remove old infrastructure

This approach uses Coolify's strengths while avoiding its complexities!
EOF

        echo "✅ Coolify-optimized setup created!"
        echo ""
        echo "Files created:"
        echo "- HRthis/HRthis/Dockerfile.coolify (optimized frontend)"
        echo "- browo-hrthis-backend/Dockerfile.coolify (optimized backend)"
        echo "- COOLIFY_DEPLOYMENT.md (detailed setup guide)"
        echo ""
        echo "🌟 Benefits of Coolify approach:"
        echo "- Use Coolify's built-in reverse proxy (no Traefik needed)"
        echo "- Separate apps for frontend and backend"
        echo "- Built-in database management"
        echo "- One-click deployments"
        echo "- Integrated monitoring"
        
        ;;
        
    4)
        echo "Goodbye!"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1-4."
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📖 For detailed documentation, see:"
echo "   - SIMPLIFIED_DEPLOYMENT_STRATEGY.md"
echo "   - COOLIFY_DEPLOYMENT.md (if you chose option 3)"
echo ""
echo "💡 Need help? Check the troubleshooting sections in the documentation."