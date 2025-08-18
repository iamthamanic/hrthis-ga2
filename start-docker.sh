#!/bin/bash

# HRthis Docker Startup Script
# Starts the complete stack: Frontend + Backend + Database

set -e

echo "🚀 HRthis Docker Stack Startup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
print_info "Stopping existing containers..."
docker-compose -f docker-compose.local.yml down 2>/dev/null || true

# Load environment variables
if [ -f .env.docker ]; then
    print_status "Loading environment from .env.docker"
    export $(cat .env.docker | grep -v '^#' | xargs)
fi

# Build and start containers
print_info "Building Docker images..."
docker-compose -f docker-compose.local.yml build

print_info "Starting services..."
docker-compose -f docker-compose.local.yml up -d

# Wait for services to be ready
print_info "Waiting for services to start..."
sleep 5

# Check backend health
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:8002/health > /dev/null 2>&1; then
        print_status "Backend is healthy"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        print_error "Backend failed to start"
        docker-compose -f docker-compose.local.yml logs backend
        exit 1
    fi
    sleep 2
done

# Initialize demo users
print_info "Initializing demo users..."
docker-compose -f docker-compose.local.yml exec -T backend python init_demo_users.py || true

# Show status
print_status "All services started successfully!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.local.yml ps
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:    http://localhost:4173"
echo "   Backend API: http://localhost:8002"
echo "   API Docs:    http://localhost:8002/docs"
echo ""
echo "🔐 Demo Login Credentials:"
echo ""
echo "   Employee Account:"
echo "   Email:    max.mustermann@hrthis.de"
echo "   Password: password"
echo ""
echo "   Admin Account:"
echo "   Email:    anna.admin@hrthis.de"
echo "   Password: password"
echo ""
echo "📋 Useful Commands:"
echo "   View logs:    docker-compose -f docker-compose.local.yml logs -f"
echo "   Stop all:     docker-compose -f docker-compose.local.yml down"
echo "   Restart:      docker-compose -f docker-compose.local.yml restart"
echo ""
print_status "Ready to use! Open http://localhost:4173 in your browser."