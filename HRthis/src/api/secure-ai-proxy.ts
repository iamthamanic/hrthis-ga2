/**
 * SECURE AI PROXY SERVICE
 * 
 * This service replaces direct client-side API calls to AI services with secure backend proxy calls.
 * It eliminates the need for client-side API keys and uses proper authentication.
 * 
 * 🔒 SECURITY FEATURES:
 * - No client-side API keys
 * - Bearer token authentication
 * - Backend proxy architecture
 * - Request/response validation
 * 
 * 🚀 USAGE:
 * Replace all direct AI service calls with this secure proxy
 */

import { AIMessage, AIRequestOptions, AIResponse } from "../types/ai";

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL;
const USE_REAL_API = Boolean(API_BASE_URL && API_BASE_URL.trim() !== '');

// AI Service endpoints
const AI_ENDPOINTS = {
  openai: '/api/ai/openai',
  anthropic: '/api/ai/anthropic', 
  grok: '/api/ai/grok',
} as const;

/**
 * AI Service Types
 */
export type AIServiceType = 'openai' | 'anthropic' | 'grok';

/**
 * Secure AI Request Interface
 */
interface SecureAIRequest {
  messages: AIMessage[];
  options?: AIRequestOptions;
  service: AIServiceType;
}

/**
 * Generic secure API request handler for AI services
 * @internal For testing purposes, this is exported
 */
export async function secureAIRequest<T>(
  endpoint: string, 
  data: SecureAIRequest,
  token?: string
): Promise<T> {
  // Fallback to mock/demo mode if no backend configured
  if (!USE_REAL_API) {
    console.warn('🔒 Secure AI Proxy: Backend not configured, falling back to demo mode');
    return generateMockAIResponse(data) as T;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authentication if token provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid or expired token');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded: Please try again later');
      }
      if (response.status === 503) {
        throw new Error('AI service temporarily unavailable');
      }
      
      const errorText = await response.text();
      throw new Error(`AI Proxy API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`AI Proxy request failed: ${String(error)}`);
  }
}

/**
 * Mock AI response for demo mode
 */
function generateMockAIResponse(request: SecureAIRequest): AIResponse {
  const lastMessage = request.messages[request.messages.length - 1];
  const service = request.service.toUpperCase();
  
  return {
    content: `🤖 [${service} DEMO MODE] This is a simulated response to: "${lastMessage.content}"\n\nIn production, this would be processed by the secure backend proxy using the ${service} API without exposing client-side keys.`,
    usage: {
      promptTokens: 50,
      completionTokens: 100,
      totalTokens: 150,
    },
  };
}

/**
 * SECURE OPENAI SERVICE
 */
export const secureOpenAIService = {
  /**
   * Get text response from OpenAI via secure backend proxy
   */
  getTextResponse: async (
    messages: AIMessage[],
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    return secureAIRequest<AIResponse>(
      AI_ENDPOINTS.openai,
      { messages, options, service: 'openai' },
      token
    );
  },

  /**
   * Get chat response from OpenAI via secure backend proxy
   */
  getChatResponse: async (
    prompt: string,
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    return secureOpenAIService.getTextResponse(
      [{ role: "user", content: prompt }],
      options,
      token
    );
  },
};

/**
 * SECURE ANTHROPIC SERVICE
 */
export const secureAnthropicService = {
  /**
   * Get text response from Anthropic via secure backend proxy
   */
  getTextResponse: async (
    messages: AIMessage[],
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    return secureAIRequest<AIResponse>(
      AI_ENDPOINTS.anthropic,
      { messages, options, service: 'anthropic' },
      token
    );
  },

  /**
   * Get chat response from Anthropic via secure backend proxy
   */
  getChatResponse: async (
    prompt: string,
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    return secureAnthropicService.getTextResponse(
      [{ role: "user", content: prompt }],
      options,
      token
    );
  },
};

/**
 * SECURE GROK SERVICE
 */
export const secureGrokService = {
  /**
   * Get text response from Grok via secure backend proxy
   */
  getTextResponse: async (
    messages: AIMessage[],
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    return secureAIRequest<AIResponse>(
      AI_ENDPOINTS.grok,
      { messages, options, service: 'grok' },
      token
    );
  },

  /**
   * Get chat response from Grok via secure backend proxy
   */
  getChatResponse: async (
    prompt: string,
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    return secureGrokService.getTextResponse(
      [{ role: "user", content: prompt }],
      options,
      token
    );
  },
};

/**
 * UNIFIED SECURE AI SERVICE
 */
export const secureAIService = {
  openai: secureOpenAIService,
  anthropic: secureAnthropicService,
  grok: secureGrokService,

  /**
   * Get response from any AI service
   */
  getResponse: async (
    service: AIServiceType,
    messages: AIMessage[],
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    switch (service) {
      case 'openai':
        return secureOpenAIService.getTextResponse(messages, options, token);
      case 'anthropic':
        return secureAnthropicService.getTextResponse(messages, options, token);
      case 'grok':
        return secureGrokService.getTextResponse(messages, options, token);
      default:
        throw new Error(`Unsupported AI service: ${service}`);
    }
  },

  /**
   * Check if secure backend is available
   */
  isSecureBackendAvailable: (): boolean => USE_REAL_API,

  /**
   * Get backend configuration info
   */
  getBackendInfo: () => ({
    baseURL: API_BASE_URL,
    isRealAPIEnabled: USE_REAL_API,
    availableServices: ['openai', 'anthropic', 'grok'] as AIServiceType[],
  }),
};

/**
 * MIGRATION HELPERS
 */
export const migrationHelpers = {
  /**
   * Check if old insecure API is still being used
   */
  detectInsecureAPIUsage: (): boolean => {
    const hasPublicKeys = !!(
      process.env.EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY ||
      process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY ||
      process.env.EXPO_PUBLIC_VIBECODE_GROK_API_KEY
    );

    if (hasPublicKeys && process.env.NODE_ENV === 'production') {
      console.error('🚨 SECURITY ERROR: Client-side API keys detected in production!');
      return true;
    }

    return false;
  },

  /**
   * Validate secure setup
   */
  validateSecureSetup: (): { isSecure: boolean; warnings: string[] } => {
    const warnings: string[] = [];
    let isSecure = true;

    // Check for client-side keys
    if (migrationHelpers.detectInsecureAPIUsage()) {
      warnings.push('Client-side API keys detected');
      isSecure = false;
    }

    // Check backend configuration
    if (!USE_REAL_API) {
      warnings.push('Backend API URL not configured');
      isSecure = false;
    }

    return { isSecure, warnings };
  },
};

// Default export for convenience
export default secureAIService;