# 🪝 HRthis Hook System Documentation

## Overview

HRthis implements a comprehensive hook system for both frontend (React) and backend (FastAPI) to improve code reusability, maintainability, and separation of concerns.

## Frontend Hooks

### 📝 Form Management

#### `useFormHandler<T>`
Complete form state management with Zod validation.

**Features:**
- Field-level validation
- Touch state tracking
- Async submission handling
- Error management per field
- Form reset functionality

**Usage:**
```typescript
import { useFormHandler } from '@/hooks';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters')
});

const form = useFormHandler<LoginData>({
  initialValues: { email: '', password: '' },
  validationSchema: loginSchema,
  validateOnChange: true,
  validateOnBlur: true,
  onSubmit: async (values) => {
    await login(values);
  },
  onError: (error) => {
    console.error('Form error:', error);
  }
});

// In component
<input 
  value={form.values.email}
  onChange={(e) => form.handleChange('email')(e.target.value)}
  onBlur={form.handleBlur('email')}
/>
{form.errors.email && <span>{form.errors.email}</span>}
```

### 🌐 API Handling

#### `useApiRequest<T>`
Advanced API request management with caching and retry logic.

**Features:**
- Request caching with TTL
- Automatic retry on failure
- Optimistic updates
- Request debouncing
- Abort controller support
- Loading/error states

**Usage:**
```typescript
const { data, loading, error, refetch, reset } = useApiRequest(
  fetchEmployees,
  [searchTerm], // Dependencies
  {
    cacheKey: 'employees-list',
    ttl: 5 * 60 * 1000, // 5 minutes
    retries: 3,
    retryDelay: 1000,
    optimisticUpdate: (current) => [...current, newEmployee],
    onSuccess: (data) => console.log('Loaded:', data),
    onError: (error) => console.error('Failed:', error),
    refetchInterval: 30000, // Poll every 30s
    enabled: isAuthenticated
  }
);
```

### 🎨 UI/UX Hooks

#### `useToast()`
Toast notification system with multiple types and auto-dismiss.

**Features:**
- Success, error, warning, info types
- Auto-dismiss with configurable duration
- Action buttons in toasts
- Keyboard shortcuts (ESC to dismiss)
- Queue management

**Usage:**
```typescript
const toast = useToast();

// Simple notifications
toast.success('Saved!', 'Your changes have been saved');
toast.error('Error', 'Something went wrong');
toast.warning('Warning', 'Please check your input');
toast.info('Info', 'New update available');

// With action button
toast.show({
  type: 'info',
  title: 'Update Available',
  message: 'A new version is ready',
  duration: 10000,
  action: {
    label: 'Update Now',
    onClick: () => updateApp()
  }
});
```

#### `useDebounce<T>`
Debounce values to reduce API calls and improve performance.

**Features:**
- Configurable delay
- Type-safe
- Cleanup on unmount

**Usage:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    searchAPI(debouncedSearch);
  }
}, [debouncedSearch]);
```

#### `useDebouncedCallback`
Debounce function calls.

```typescript
const debouncedSave = useDebouncedCallback(
  (value) => saveToServer(value),
  1000,
  [dependencies]
);

// Call multiple times, executes once after delay
debouncedSave(data);
```

### 🔐 Permissions & Security

#### `usePermission()`
Complete RBAC (Role-Based Access Control) system.

**Features:**
- Role-based permissions
- Resource-level permissions
- UI element visibility control
- Permission gates
- Helper functions for common checks

**Roles:**
- `EMPLOYEE` - Basic permissions
- `ADMIN` - Extended permissions
- `SUPERADMIN` - Full system access

**Usage:**
```typescript
const {
  hasPermission,
  hasRole,
  isAdmin,
  canEdit,
  canDelete,
  showIf,
  user
} = usePermission();

// Check specific permission
if (hasPermission('edit:employees')) {
  // Show edit button
}

// Check role
if (isAdmin) {
  // Show admin panel
}

// Resource-based check
if (canEdit(employee)) {
  // Allow editing
}

// Conditional rendering
{showIf('manage:system') && <AdminPanel />}

// Permission gate component
<PermissionGate permission="delete:employees">
  <DeleteButton />
</PermissionGate>

// HOC pattern
const AdminOnlyComponent = withPermission(
  MyComponent,
  'manage:system',
  FallbackComponent
);
```

### 💾 State Management

#### `useLocalStorage<T>`
Type-safe localStorage with cross-tab synchronization.

**Features:**
- JSON serialization/deserialization
- Cross-tab sync via storage events
- TTL support for cache invalidation
- Fallback values
- Custom serializers

**Usage:**
```typescript
const [preferences, setPreferences] = useLocalStorage('user-prefs', {
  theme: 'light',
  language: 'de',
  notifications: true
}, {
  ttl: 24 * 60 * 60 * 1000, // 1 day
  syncTabs: true,
  fallbackValue: defaultPrefs
});

// Specialized hooks
const [user, setUser] = useUserPreferences();
const [settings, setSettings] = useAppSettings();
const [session, setSession] = useSessionStorage('session-data', {});
```

## Backend Hooks

### 🗄️ Database Event Hooks

SQLAlchemy event listeners for automatic database operations.

#### Employee Hooks
```python
@event.listens_for(Employee, 'before_insert')
def generate_employee_number(mapper, connection, target):
    """Auto-generate employee number: PN-YYYY0001"""
    if not target.employee_number:
        year = datetime.now().year
        # Get next number for year
        result = connection.execute(
            text("SELECT COUNT(*) FROM employees WHERE employee_number LIKE :pattern"),
            {"pattern": f"PN-{year}%"}
        )
        count = result.scalar() or 0
        target.employee_number = f"PN-{year}{count + 1:04d}"
```

#### Audit Trail
```python
@event.listens_for(Employee, 'after_update')
def log_employee_changes(mapper, connection, target):
    """Log all changes for audit trail"""
    state = inspect(target)
    for attr in state.attrs:
        if attr.history.has_changes():
            old_value = attr.history.deleted[0] if attr.history.deleted else None
            new_value = attr.value
            # Log to audit table
            audit_log.info(f"Changed {attr.key}: {old_value} -> {new_value}")
```

#### Cache Invalidation
```python
@event.listens_for(Session, 'after_commit')
def invalidate_cache(session):
    """Clear cache after database commits"""
    cache.delete_pattern('employees:*')
```

### 🔧 Middleware Hooks

FastAPI middleware for request/response processing.

#### Request Hooks
```python
class RequestHooksMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Pre-request hooks
        await self.log_request(request)
        await self.check_rate_limit(request)
        
        # Process request
        response = await call_next(request)
        
        # Post-response hooks
        response = await self.add_security_headers(response)
        response = await self.track_performance(response)
        
        return response
```

#### Rate Limiting
```python
async def check_rate_limit(self, request: Request):
    """Rate limit: 100 requests per minute per IP"""
    client_ip = request.client.host
    key = f"rate_limit:{client_ip}"
    
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, 60)
    
    if count > 100:
        raise HTTPException(429, "Rate limit exceeded")
```

#### Security Headers
```python
async def add_security_headers(self, response: Response):
    """Add security headers to all responses"""
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response
```

## Integration Examples

### Complete Form with API Integration
```typescript
const EmployeeForm = () => {
  const toast = useToast();
  const { hasPermission } = usePermission();
  
  const { execute: saveEmployee } = useApiRequest(
    (data) => api.post('/employees', data),
    [],
    {
      immediate: false,
      onSuccess: () => toast.success('Saved', 'Employee created'),
      onError: (e) => toast.error('Error', e.message)
    }
  );
  
  const form = useFormHandler<EmployeeData>({
    initialValues: { name: '', email: '', position: '' },
    validationSchema: employeeSchema,
    onSubmit: async (values) => {
      if (!hasPermission('create:employees')) {
        toast.error('Forbidden', 'No permission');
        return;
      }
      await saveEmployee(values);
    }
  });
  
  return (
    <form onSubmit={form.handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Search with Debouncing
```typescript
const EmployeeSearch = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { data: employees, loading } = useApiRequest(
    () => api.get(`/employees?search=${debouncedSearch}`),
    [debouncedSearch],
    {
      cacheKey: `search:${debouncedSearch}`,
      enabled: debouncedSearch.length > 2
    }
  );
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search employees..."
      />
      {loading && <Spinner />}
      {employees?.map(emp => <EmployeeCard key={emp.id} {...emp} />)}
    </div>
  );
};
```

## Best Practices

### Do's ✅
- Use hooks for all reusable logic
- Combine multiple hooks for complex features
- Keep hooks pure and testable
- Use TypeScript for type safety
- Handle loading and error states
- Clean up resources in useEffect returns

### Don'ts ❌
- Don't call hooks conditionally
- Don't use hooks outside React components
- Don't mutate state directly
- Don't ignore cleanup functions
- Don't make hooks too complex (split if needed)

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';

test('useFormHandler validates input', async () => {
  const { result } = renderHook(() => 
    useFormHandler({
      initialValues: { email: '' },
      validationSchema: emailSchema,
      onSubmit: jest.fn()
    })
  );
  
  act(() => {
    result.current.setFieldValue('email', 'invalid');
    result.current.validateField('email');
  });
  
  expect(result.current.errors.email).toBe('Invalid email');
});
```

## Performance Considerations

1. **Memoization**: Use `useMemo` and `useCallback` in hooks
2. **Debouncing**: Always debounce search and frequent API calls
3. **Caching**: Implement proper cache keys and TTL
4. **Cleanup**: Always clean up subscriptions and timers
5. **Lazy Loading**: Load heavy hooks only when needed

## Migration Guide

### From Class Components
```typescript
// Before (Class)
class MyComponent extends React.Component {
  state = { data: null, loading: false };
  
  componentDidMount() {
    this.fetchData();
  }
  
  fetchData = async () => {
    this.setState({ loading: true });
    try {
      const data = await api.get('/data');
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };
}

// After (Hooks)
const MyComponent = () => {
  const { data, loading, error } = useApiRequest(
    () => api.get('/data'),
    [],
    { cacheKey: 'my-data' }
  );
  
  return loading ? <Spinner /> : <DataView data={data} />;
};
```

## Troubleshooting

### Common Issues

1. **"Hooks can only be called inside function components"**
   - Ensure you're calling hooks at the top level of a React component
   
2. **"Maximum update depth exceeded"**
   - Check dependencies in useEffect/useCallback
   - Ensure callbacks are memoized

3. **"Cannot read property of undefined"**
   - Add null checks and fallback values
   - Use optional chaining (?.)

4. **Race conditions in API calls**
   - Use abort controllers (built into useApiRequest)
   - Check if component is still mounted

## Future Enhancements

- [ ] useWebSocket - Real-time data subscriptions
- [ ] useInfiniteScroll - Pagination helper
- [ ] useKeyboard - Keyboard shortcut management
- [ ] useMediaQuery - Responsive design helper
- [ ] useAnimation - Animation state management
- [ ] useClipboard - Copy/paste functionality
- [ ] useGeolocation - Location tracking
- [ ] useOnlineStatus - Network state monitoring

---

For more information or to contribute new hooks, please refer to the main README.md or open an issue in the repository.