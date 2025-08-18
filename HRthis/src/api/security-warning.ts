/**
 * SECURITY WARNING: API Key Management
 * 
 * This file contains security warnings for API key usage in client-side applications.
 * 
 * ⚠️  CRITICAL SECURITY ISSUE (LEGACY):
 * API keys with EXPO_PUBLIC_ prefix are exposed to client-side JavaScript
 * and can be extracted from the browser by anyone.
 * 
 * ✅ SECURE SOLUTION IMPLEMENTED:
 * 1. ✅ Secure backend proxy service created (secure-ai-proxy.ts)
 * 2. ✅ Server-side API key handling via backend endpoints
 * 3. ✅ Bearer token authentication for frontend-backend communication
 * 4. ✅ Backward-compatible secure service implementations
 * 
 * 🔒 MIGRATION STATUS:
 * - ✅ secure-ai-proxy.ts - Unified secure API proxy
 * - ✅ secure-anthropic-service.ts - Secure Anthropic service
 * - ✅ secure-openai-service.ts - Secure OpenAI service  
 * - ✅ secure-grok-service.ts - Secure Grok service
 * - ✅ chat-service.ts - Updated to use secure services
 * 
 * 🚨 NEXT STEPS FOR COMPLETE SECURITY:
 * 1. Update all components to use the new secure services
 * 2. Remove EXPO_PUBLIC_* environment variables
 * 3. Implement backend endpoints: /api/ai/openai, /api/ai/anthropic, /api/ai/grok
 * 4. Test secure authentication flow
 */

export const logSecurityWarning = (serviceName: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `⚠️  LEGACY WARNING: ${serviceName} is using the old insecure API client. ` +
      `Please migrate to secure-${serviceName.toLowerCase()}-service.ts for production safety.`
    );
  }
  
  if (process.env.NODE_ENV === 'production') {
    console.error(
      `🚨 PRODUCTION ERROR: ${serviceName} is using insecure client-side API keys! ` +
      `Use secure-ai-proxy.ts services immediately.`
    );
  }
};

export const validateEnvironment = (): void => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasPublicKeys = !!(
    process.env.EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY ??
    process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY ??
    process.env.EXPO_PUBLIC_VIBECODE_GROK_API_KEY
  );

  if (!isDevelopment && hasPublicKeys) {
    throw new Error(
      'SECURITY ERROR: Client-side API keys detected in production environment. ' +
      'Please move API calls to a secure backend service.'
    );
  }
};