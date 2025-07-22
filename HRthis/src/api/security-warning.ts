/**
 * SECURITY WARNING: API Key Management
 * 
 * This file contains security warnings for API key usage in client-side applications.
 * 
 * ⚠️  CRITICAL SECURITY ISSUE:
 * API keys with EXPO_PUBLIC_ prefix are exposed to client-side JavaScript
 * and can be extracted from the browser by anyone.
 * 
 * 🔒 RECOMMENDED SOLUTION:
 * 1. Move all API calls to a secure backend service
 * 2. Use server-side environment variables (without EXPO_PUBLIC_ prefix)  
 * 3. Implement proper authentication tokens for frontend-backend communication
 * 
 * 🚨 PRODUCTION READINESS:
 * This code should NOT be deployed to production without fixing the API key exposure.
 */

export const logSecurityWarning = (serviceName: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `🚨 SECURITY WARNING: ${serviceName} API key is exposed client-side. ` +
      `This is only safe for development. Move API calls to backend for production.`
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