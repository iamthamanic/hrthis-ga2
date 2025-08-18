# 🔒 Security Migration Guide: From Insecure to Secure AI Services

## 🚨 Critical Security Issue Fixed

This guide documents the migration from **insecure client-side API keys** to a **secure backend proxy architecture** for all AI services (OpenAI, Anthropic, Grok).

---

## 📊 Migration Overview

| Component | Status | Action Required |
|-----------|--------|-----------------|
| `secure-ai-proxy.ts` | ✅ **Complete** | New unified secure API proxy |
| `secure-anthropic-service.ts` | ✅ **Complete** | Secure Anthropic service |
| `secure-openai-service.ts` | ✅ **Complete** | Secure OpenAI service |
| `secure-grok-service.ts` | ✅ **Complete** | Secure Grok service |
| `chat-service.ts` | ✅ **Updated** | Now exports secure services |
| Backend endpoints | ⏳ **Pending** | Need implementation |

---

## 🛡️ Security Improvements

### Before (Insecure):
```typescript
// ❌ INSECURE: Client-side API keys exposed
const apiKey = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
const client = new OpenAI({ apiKey });
```

### After (Secure):
```typescript
// ✅ SECURE: Backend proxy with token authentication
import { secureOpenAIService } from './secure-ai-proxy';
const response = await secureOpenAIService.getTextResponse(messages, options, userToken);
```

---

## 🚀 How to Use the New Secure Services

### 1. Import Secure Services
```typescript
// Replace old insecure imports
import { 
  secureAIService,
  secureOpenAIService,
  secureAnthropicService,
  secureGrokService 
} from './api/secure-ai-proxy';
```

### 2. Use Secure API Calls
```typescript
// Get user authentication token (from your auth system)
const userToken = getUserAuthToken();

// OpenAI
const openaiResponse = await secureOpenAIService.getTextResponse(
  [{ role: "user", content: "Hello!" }],
  { model: "gpt-4o-2024-11-20" },
  userToken
);

// Anthropic
const anthropicResponse = await secureAnthropicService.getTextResponse(
  [{ role: "user", content: "Hello!" }],
  { model: "claude-3-5-sonnet-20240620" },
  userToken
);

// Grok
const grokResponse = await secureGrokService.getTextResponse(
  [{ role: "user", content: "Hello!" }],
  { model: "grok-3-latest" },
  userToken
);
```

### 3. Unified Service Usage
```typescript
// Use any AI service through unified interface
const response = await secureAIService.getResponse(
  'openai', // or 'anthropic', 'grok'
  [{ role: "user", content: "Hello!" }],
  { model: "gpt-4o-2024-11-20" },
  userToken
);
```

---

## 🔧 Backend Implementation Required

### Required Endpoints

The secure services expect these backend endpoints to be implemented:

#### 1. `/api/ai/openai` (POST)
```json
{
  "messages": [{"role": "user", "content": "Hello"}],
  "options": {
    "model": "gpt-4o-2024-11-20",
    "temperature": 0.7,
    "maxTokens": 2048
  },
  "service": "openai"
}
```

#### 2. `/api/ai/anthropic` (POST)
```json
{
  "messages": [{"role": "user", "content": "Hello"}],
  "options": {
    "model": "claude-3-5-sonnet-20240620",
    "temperature": 0.7,
    "maxTokens": 2048
  },
  "service": "anthropic"
}
```

#### 3. `/api/ai/grok` (POST)
```json
{
  "messages": [{"role": "user", "content": "Hello"}],
  "options": {
    "model": "grok-3-latest",
    "temperature": 0.7,
    "maxTokens": 2048
  },
  "service": "grok"
}
```

### Authentication
All endpoints should:
- Require `Authorization: Bearer <token>` header
- Validate user tokens server-side
- Use server-side environment variables for API keys (without `EXPO_PUBLIC_` prefix)

---

## 🔄 Migration Steps

### For Developers:

#### Step 1: Update Component Imports
```typescript
// Old (insecure)
import { getOpenAITextResponse } from './api/openai-service';

// New (secure)
import { getOpenAITextResponse } from './api/secure-openai-service';
// or
import { secureOpenAIService } from './api/secure-ai-proxy';
```

#### Step 2: Add Token Parameter
```typescript
// Old (insecure)
const response = await getOpenAITextResponse(messages, options);

// New (secure)
const userToken = getUserToken(); // Get from your auth system
const response = await getOpenAITextResponse(messages, options, userToken);
```

#### Step 3: Handle Demo Mode
The secure services automatically handle demo mode when `REACT_APP_API_URL` is not configured:
```typescript
// Check if running in demo mode
if (!secureAIService.isSecureBackendAvailable()) {
  console.log('Running in demo mode');
}
```

### For Backend Developers:

#### Step 1: Create AI Proxy Endpoints
Implement the three required endpoints (`/api/ai/openai`, `/api/ai/anthropic`, `/api/ai/grok`)

#### Step 2: Move API Keys to Server
```bash
# Server environment (secure)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key  
GROK_API_KEY=your_grok_key

# Remove from client environment
# EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY=... ❌ DELETE
# EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY=... ❌ DELETE
# EXPO_PUBLIC_VIBECODE_GROK_API_KEY=... ❌ DELETE
```

#### Step 3: Implement Token Validation
```typescript
// Example middleware
const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !isValidToken(token)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = getUserFromToken(token);
  next();
};
```

---

## 🧪 Testing

### Verify Security Migration
```typescript
import { migrationHelpers } from './api/secure-ai-proxy';

// Check for security issues
const securityCheck = migrationHelpers.validateSecureSetup();
console.log('Security status:', securityCheck);

// Detect old insecure usage
const hasInsecureUsage = migrationHelpers.detectInsecureAPIUsage();
if (hasInsecureUsage) {
  console.error('⚠️ Insecure API usage detected!');
}
```

### Test Demo Mode
```typescript
// Works without backend (returns mock responses)
const response = await secureOpenAIService.getTextResponse(
  [{ role: "user", content: "Test" }]
);
console.log(response.content); // Shows demo response
```

---

## 🚨 Production Checklist

- [ ] ✅ All components updated to use secure services
- [ ] ✅ Backend endpoints implemented (`/api/ai/*`)
- [ ] ✅ Server-side API keys configured
- [ ] ✅ Client-side `EXPO_PUBLIC_*` keys removed
- [ ] ✅ Token authentication working
- [ ] ✅ Security validation passing
- [ ] ✅ Demo mode tested
- [ ] ✅ Error handling tested

---

## 📚 API Reference

### Secure Services Available:

- `secureAIService` - Unified interface for all AI services
- `secureOpenAIService` - OpenAI-specific secure service
- `secureAnthropicService` - Anthropic-specific secure service  
- `secureGrokService` - Grok-specific secure service
- `migrationHelpers` - Security validation utilities

### Backward Compatibility:

All new secure services maintain the same function signatures as the original insecure services, ensuring seamless migration:

```typescript
// Same function signature, now secure
getOpenAITextResponse(messages, options, token?) // ✅ Now secure
getAnthropicTextResponse(messages, options, token?) // ✅ Now secure
getGrokTextResponse(messages, options, token?) // ✅ Now secure
```

---

## 🆘 Support

If you encounter issues during migration:

1. Check console for security warnings
2. Verify backend endpoints are implemented
3. Ensure tokens are being passed correctly
4. Test in demo mode first
5. Review this migration guide

**Remember**: The secure services will work in demo mode even without backend implementation, but production requires proper backend endpoints.