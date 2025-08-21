# 🧪 HRthis E2E Test Setup

## 🚀 Quick Start

### One-Command Full Stack Testing
```bash
cd HRthis
npm run test:e2e:full
```

This command will:
1. ✅ Start PostgreSQL test database
2. ✅ Start Backend API with test data
3. ✅ Start Frontend application
4. ✅ Run all E2E tests
5. ✅ Generate HTML report
6. ✅ Clean up everything

## 📋 Available Test Commands

### Full Stack Testing
```bash
# Run complete E2E tests with Docker
npm run test:e2e:full

# Keep services running after tests (for debugging)
npm run test:e2e:full:keep

# Run tests against already running backend
npm run test:e2e:backend

# Run tests in demo mode (no backend)
npm run test:e2e:demo
```

### Docker Management
```bash
# Start test stack manually
npm run docker:test:up

# Stop and clean test stack
npm run docker:test:down

# View logs
npm run docker:test:logs
```

### Playwright UI
```bash
# Open Playwright test UI
npm run test:e2e:ui

# Debug tests step by step
npm run test:e2e:debug
```

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   PostgreSQL    │◄────│   Backend API   │◄────│    Frontend     │
│   Test DB       │     │    (FastAPI)    │     │     (React)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┴───────────────────────┘
                                 │
                        ┌─────────────────┐
                        │                 │
                        │   Playwright    │
                        │   E2E Tests     │
                        │                 │
                        └─────────────────┘
```

## 📁 Test Structure

```
HRthis/
├── docker-compose.test.yml      # Test stack configuration
├── test-data/
│   └── 01-init.sql             # Test database seed data
├── scripts/
│   └── test-e2e.sh             # Test orchestration script
├── HRthis/
│   ├── e2e/
│   │   ├── auth.spec.ts        # Authentication tests
│   │   ├── employees.spec.ts   # Employee management tests
│   │   ├── full-journey.spec.ts # Complete user journeys
│   │   ├── global.setup.ts     # Test environment setup
│   │   └── global.teardown.ts  # Test cleanup
│   ├── playwright.config.ts    # Playwright configuration
│   ├── Dockerfile.test         # Frontend test container
│   └── Dockerfile.e2e          # E2E test runner container
└── browo-hrthis-backend/
    └── Dockerfile              # Backend container
```

## 🔑 Test Users

The test database includes these pre-configured users:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@test.com | admin123 | ADMIN | Full system access |
| manager@test.com | manager123 | MANAGER | Team management access |
| employee@test.com | employee123 | EMPLOYEE | Regular employee |
| parttime@test.com | employee123 | EMPLOYEE | Part-time employee |
| inactive@test.com | employee123 | EMPLOYEE | Inactive account |

## 🎯 Test Coverage

### Authentication Tests (`auth.spec.ts`)
- ✅ Login with valid/invalid credentials
- ✅ Password visibility toggle
- ✅ Session persistence
- ✅ Logout functionality
- ✅ Protected route access
- ✅ Role-based authentication

### Employee Management Tests (`employees.spec.ts`)
- ✅ List all employees
- ✅ Create new employee
- ✅ Edit employee details
- ✅ Delete employee
- ✅ Search and filter
- ✅ Pagination

### Full User Journey Tests (`full-journey.spec.ts`)
- ✅ Complete employee lifecycle (Create → Edit → Delete)
- ✅ Employee self-service journey
- ✅ Manager approval workflow
- ✅ Search and filter operations
- ✅ Mobile responsive testing
- ✅ Error handling
- ✅ Performance testing

## 🐛 Debugging

### View Service Logs
```bash
# All services
npm run docker:test:logs

# Specific service
docker-compose -f docker-compose.test.yml logs test-backend
docker-compose -f docker-compose.test.yml logs test-frontend
docker-compose -f docker-compose.test.yml logs test-db
```

### Keep Services Running
```bash
# Run tests but keep services alive
npm run test:e2e:full:keep

# Services will be available at:
# - Frontend: http://localhost:3001
# - Backend: http://localhost:8003
# - API Docs: http://localhost:8003/docs
# - Database: localhost:5433
```

### Access Test Database
```bash
# Connect to test database
docker exec -it hrthis-test-db psql -U hrthis_test -d hrthis_test

# View test data
SELECT * FROM users;
SELECT * FROM employee_details;
```

### Debug Specific Test
```bash
# Run single test file
npx playwright test e2e/auth.spec.ts

# Run with headed browser
npx playwright test --headed

# Debug mode
npx playwright test --debug
```

## 📊 Test Reports

After running tests, reports are available at:
- **HTML Report**: `HRthis/playwright-report/index.html`
- **JUnit XML**: `HRthis/test-results/junit.xml`
- **Videos**: `HRthis/test-results/` (on failure)
- **Screenshots**: `HRthis/test-results/` (on failure)

Open HTML report:
```bash
npx playwright show-report
```

## ⚙️ Configuration

### Environment Variables
```bash
# For backend testing
export API_URL=http://localhost:8003
export BASE_URL=http://localhost:3001

# For CI/CD
export CI=true
```

### Playwright Config
Edit `HRthis/playwright.config.ts` to:
- Change browsers
- Adjust timeouts
- Configure retries
- Set viewport sizes

### Docker Config
Edit `docker-compose.test.yml` to:
- Change ports
- Adjust resource limits
- Modify health checks
- Update environment variables

## 🚨 Troubleshooting

### Services Won't Start
```bash
# Clean everything
docker-compose -f docker-compose.test.yml down -v
docker system prune -f

# Rebuild
docker-compose -f docker-compose.test.yml build --no-cache
```

### Port Conflicts
```bash
# Check what's using ports
lsof -i :3001  # Frontend
lsof -i :8003  # Backend
lsof -i :5433  # Database

# Kill processes if needed
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check database is healthy
docker-compose -f docker-compose.test.yml ps
docker-compose -f docker-compose.test.yml exec test-db pg_isready
```

### Test Timeouts
Increase timeouts in `playwright.config.ts`:
```typescript
actionTimeout: 30000,      // 30 seconds
navigationTimeout: 60000,  // 60 seconds
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd HRthis
          npm ci
          npx playwright install --with-deps
      
      - name: Run E2E tests
        run: |
          cd HRthis
          npm run test:e2e:full
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: HRthis/playwright-report/
```

## 📈 Performance Benchmarks

Expected test execution times:
- **Auth tests**: ~30 seconds
- **Employee tests**: ~45 seconds
- **Full journey**: ~60 seconds
- **Total suite**: ~2-3 minutes

System requirements:
- **RAM**: 4GB minimum, 8GB recommended
- **CPU**: 2 cores minimum, 4 cores recommended
- **Disk**: 2GB free space
- **Docker**: Version 20.10+

## 🎉 Success Criteria

Your E2E tests are successful when:
- ✅ All tests pass in < 5 minutes
- ✅ No flaky tests (consistent results)
- ✅ Coverage > 80% of user journeys
- ✅ Works on CI/CD pipeline
- ✅ Easy to debug failures
- ✅ Maintainable test code

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Happy Testing! 🚀**

For issues or questions, check the logs first, then the troubleshooting section.