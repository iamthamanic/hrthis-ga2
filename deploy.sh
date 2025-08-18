#!/bin/bash

# HRthis Universal Deployment Script
# Usage: ./deploy.sh [local|netlify|docker|hetzner]

set -e

echo "🚀 HRthis Deployment Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check deployment type
DEPLOY_TYPE=${1:-local}

case $DEPLOY_TYPE in
    local)
        print_info "Starting local production server..."
        
        # Check if build exists
        if [ ! -d "HRthis/build" ]; then
            print_status "Building production version..."
            cd HRthis
            npm run build
            cd ..
        fi
        
        # Check if serve is installed
        if ! command -v serve &> /dev/null; then
            print_info "Installing serve..."
            npm install -g serve
        fi
        
        # Start local server
        print_status "Starting server on port 4173..."
        print_info "Zugangsdaten im Demo-Modus:"
        print_info "  Email: max.mustermann@hrthis.de"
        print_info "  Passwort: password"
        print_info ""
        print_info "Admin-Zugang:"
        print_info "  Email: anna.admin@hrthis.de"
        print_info "  Passwort: password"
        cd HRthis
        serve -s build -l 4173
        ;;
        
    netlify)
        print_info "Deploying to Netlify..."
        
        # Check if netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            print_error "Netlify CLI not found. Installing..."
            npm install -g netlify-cli
        fi
        
        # Build the project
        print_status "Building production version..."
        cd HRthis
        npm run build
        
        # Deploy to Netlify
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=build
        
        print_status "Deployment complete! Check Netlify dashboard for URL."
        ;;
        
    docker)
        print_info "Building Docker image..."
        
        # Check if Dockerfile exists
        if [ ! -f "HRthis/Dockerfile" ]; then
            print_error "Dockerfile not found in HRthis directory"
            exit 1
        fi
        
        # Build Docker image
        cd HRthis
        docker build -t hrthis:latest .
        
        print_status "Docker image built: hrthis:latest"
        print_info "To run: docker run -p 4173:3000 hrthis:latest"
        
        # Ask if should run now
        read -p "Start container now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker run -d -p 4173:3000 --name hrthis-app hrthis:latest
            print_status "Container started at http://localhost:4173"
        fi
        ;;
        
    hetzner)
        print_info "Deploying to Hetzner Server..."
        
        # Check if production files exist
        if [ ! -f "docker-compose.production.yml" ]; then
            print_error "docker-compose.production.yml not found!"
            exit 1
        fi
        
        # Pull latest changes
        print_status "Pulling latest changes..."
        git pull origin main || true
        
        # Build and deploy
        print_status "Building Docker images..."
        docker-compose -f docker-compose.production.yml build
        
        print_status "Restarting containers..."
        docker-compose -f docker-compose.production.yml down
        docker-compose -f docker-compose.production.yml up -d
        
        print_status "Deployment complete!"
        print_info "Services available at:"
        print_info "  Frontend: https://hrthis.kibubot.com"
        print_info "  API: https://hrthis-api.kibubot.com"
        ;;
        
    *)
        print_error "Unknown deployment type: $DEPLOY_TYPE"
        echo ""
        echo "Usage: ./deploy.sh [local|netlify|docker|hetzner]"
        echo ""
        echo "Options:"
        echo "  local    - Start local production server on port 4173"
        echo "  netlify  - Deploy to Netlify"
        echo "  docker   - Build Docker image"
        echo "  hetzner  - Deploy to Hetzner server"
        exit 1
        ;;
esac