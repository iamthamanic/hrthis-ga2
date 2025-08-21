#!/bin/bash

# E2E Test Orchestration Script
# This script manages the complete E2E test lifecycle

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.test.yml"
PROJECT_NAME="hrthis-e2e"
TIMEOUT=300  # 5 minutes timeout for services to be ready

# Functions
print_status() {
    echo -e "${BLUE}[STATUS]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

cleanup() {
    print_status "Cleaning up test environment..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down -v --remove-orphans
    print_success "Cleanup completed"
}

wait_for_service() {
    local service=$1
    local url=$2
    local timeout=$3
    local elapsed=0
    
    print_status "Waiting for $service to be ready at $url..."
    
    while [ $elapsed -lt $timeout ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_success "$service is ready!"
            return 0
        fi
        
        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done
    
    print_error "$service failed to start within $timeout seconds"
    return 1
}

# Trap to ensure cleanup on exit
trap cleanup EXIT INT TERM

# Main execution
main() {
    print_status "Starting E2E Test Suite"
    echo "======================================="
    
    # Step 1: Clean any existing test containers
    print_status "Removing any existing test containers..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down -v --remove-orphans 2>/dev/null || true
    
    # Step 2: Build services
    print_status "Building test services..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME build
    
    # Step 3: Start database and backend
    print_status "Starting database and backend services..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d test-db test-backend
    
    # Step 4: Wait for backend to be ready
    wait_for_service "Backend API" "http://localhost:8003/docs" 60
    if [ $? -ne 0 ]; then
        print_error "Backend failed to start. Checking logs..."
        docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs test-backend
        exit 1
    fi
    
    # Step 5: Start frontend
    print_status "Starting frontend service..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d test-frontend
    
    # Step 6: Wait for frontend to be ready
    wait_for_service "Frontend" "http://localhost:3001" 60
    if [ $? -ne 0 ]; then
        print_error "Frontend failed to start. Checking logs..."
        docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs test-frontend
        exit 1
    fi
    
    # Step 7: Run E2E tests
    print_status "Running E2E tests..."
    echo "======================================="
    
    # Run tests directly (not in container for now)
    cd HRthis
    
    # Set environment variables for tests
    export BASE_URL=http://localhost:3001
    export API_URL=http://localhost:8003
    
    # Run Playwright tests
    if npx playwright test; then
        print_success "All E2E tests passed!"
        TEST_RESULT=0
    else
        print_error "Some E2E tests failed!"
        TEST_RESULT=1
    fi
    
    # Step 8: Generate and display report
    if [ -f "playwright-report/index.html" ]; then
        print_status "Test report generated at: $(pwd)/playwright-report/index.html"
        
        # Try to open report in browser (macOS)
        if command -v open &> /dev/null; then
            open playwright-report/index.html
        fi
    fi
    
    # Step 9: Show logs if tests failed
    if [ $TEST_RESULT -ne 0 ]; then
        print_warning "Showing service logs for debugging..."
        echo "======================================="
        echo "Backend logs:"
        docker-compose -f ../$COMPOSE_FILE -p $PROJECT_NAME logs --tail=50 test-backend
        echo "======================================="
        echo "Frontend logs:"
        docker-compose -f ../$COMPOSE_FILE -p $PROJECT_NAME logs --tail=50 test-frontend
    fi
    
    cd ..
    
    # Return test result
    exit $TEST_RESULT
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --keep-alive)
            trap - EXIT  # Remove cleanup trap
            KEEP_ALIVE=true
            shift
            ;;
        --headless)
            export HEADLESS=true
            shift
            ;;
        --debug)
            export DEBUG=true
            set -x
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--keep-alive] [--headless] [--debug]"
            echo "  --keep-alive: Keep services running after tests"
            echo "  --headless: Run tests in headless mode"
            echo "  --debug: Enable debug output"
            exit 1
            ;;
    esac
done

# Run main function
main

# Keep services alive if requested
if [ "$KEEP_ALIVE" = true ]; then
    print_warning "Services are still running. To stop them, run:"
    echo "docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down -v"
fi