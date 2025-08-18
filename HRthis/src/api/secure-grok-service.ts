/**
 * SECURE GROK SERVICE
 * 
 * This service replaces the insecure grok-service.ts with secure backend proxy calls.
 * 
 * 🔒 SECURITY IMPROVEMENTS:
 * - No client-side API keys
 * - Backend proxy architecture
 * - Bearer token authentication
 * - Proper error handling
 */

import { AIMessage, AIRequestOptions, AIResponse } from "../types/ai";
import { secureGrokService } from "./secure-ai-proxy";

/**
 * Get text response from Grok via secure backend proxy
 * 
 * @param messages - Array of AI messages
 * @param options - Optional request options (model, temperature, etc.)
 * @param token - Optional authentication token
 * @returns Promise<AIResponse>
 */
export const getGrokTextResponse = async (
  messages: AIMessage[],
  options?: AIRequestOptions,
  token?: string
): Promise<AIResponse> => {
  try {
    // Set default model for Grok if not specified
    const requestOptions: AIRequestOptions = {
      model: "grok-3-latest",
      maxTokens: 2048,
      temperature: 0.7,
      ...options,
    };

    return await secureGrokService.getTextResponse(messages, requestOptions, token);
  } catch (error) {
    // Enhanced error handling with context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Secure Grok Service Error: ${errorMessage}`);
  }
};

/**
 * Get chat response from Grok via secure backend proxy
 * 
 * @param prompt - Text prompt to send
 * @param options - Optional request options
 * @param token - Optional authentication token
 * @returns Promise<AIResponse>
 */
export const getGrokChatResponse = async (
  prompt: string,
  options?: AIRequestOptions,
  token?: string
): Promise<AIResponse> => {
  return await getGrokTextResponse([{ role: "user", content: prompt }], options, token);
};

/**
 * BACKWARD COMPATIBILITY EXPORTS
 * 
 * These maintain the same function signatures as the original service
 * for seamless migration from insecure to secure implementation.
 */

// Legacy function names for backward compatibility
export const getGrokResponse = getGrokTextResponse;
export const grokChat = getGrokChatResponse;

/**
 * Service configuration and utilities
 */
export const grokServiceConfig = {
  defaultModel: "grok-3-latest",
  supportedModels: [
    "grok-3-latest",
    "grok-3-fast-latest",
    "grok-3-mini-latest"
  ],
  
  /**
   * Validate model name
   */
  isValidModel: (model: string): boolean => {
    return grokServiceConfig.supportedModels.includes(model);
  },

  /**
   * Get optimal model for task type
   */
  getOptimalModel: (taskType: 'chat' | 'analysis' | 'creative' | 'code' | 'fast'): string => {
    switch (taskType) {
      case 'fast':
        return "grok-3-fast-latest";
      case 'code':
        return "grok-3-latest";
      case 'analysis':
        return "grok-3-latest";
      case 'creative':
        return "grok-3-latest";
      case 'chat':
      default:
        return "grok-3-mini-latest"; // Most cost-effective for chat
    }
  },

  /**
   * Get cost-optimized model
   */
  getCostOptimizedModel: (): string => {
    return "grok-3-mini-latest";
  },

  /**
   * Get performance-optimized model
   */
  getPerformanceOptimizedModel: (): string => {
    return "grok-3-fast-latest";
  },
};

/**
 * Advanced Grok features via secure proxy
 */
export const advancedGrokFeatures = {
  /**
   * Get real-time information response (Grok's specialty)
   */
  getRealTimeResponse: async (
    prompt: string,
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    const enhancedPrompt = `[REAL-TIME REQUEST] ${prompt}\n\nPlease provide up-to-date information if available.`;
    
    const requestOptions: AIRequestOptions = {
      model: "grok-3-latest", // Best model for real-time info
      temperature: 0.3, // Lower temperature for factual responses
      ...options,
    };

    return await getGrokChatResponse(enhancedPrompt, requestOptions, token);
  },

  /**
   * Get Twitter/X-style response (Grok's conversational style)
   */
  getConversationalResponse: async (
    prompt: string,
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    const requestOptions: AIRequestOptions = {
      model: "grok-3-latest",
      temperature: 0.8, // Higher temperature for more creative responses
      ...options,
    };

    return await getGrokChatResponse(prompt, requestOptions, token);
  },

  /**
   * Get fast response for time-sensitive queries
   */
  getFastResponse: async (
    prompt: string,
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    const requestOptions: AIRequestOptions = {
      model: "grok-3-fast-latest",
      maxTokens: 1024, // Shorter responses for speed
      ...options,
    };

    return await getGrokChatResponse(prompt, requestOptions, token);
  },
};

/**
 * Grok-specific utilities
 */
export const grokUtils = {
  /**
   * Format prompt for better Grok responses
   */
  formatPromptForGrok: (prompt: string, context?: string): string => {
    let formattedPrompt = prompt;
    
    if (context) {
      formattedPrompt = `Context: ${context}\n\nQuery: ${prompt}`;
    }
    
    return formattedPrompt;
  },

  /**
   * Optimize options for Grok
   */
  optimizeOptionsForGrok: (options?: AIRequestOptions): AIRequestOptions => {
    return {
      model: "grok-3-latest",
      temperature: 0.7,
      maxTokens: 2048,
      ...options,
    };
  },
};

/**
 * Security validation
 */
export const validateSecureGrokSetup = (): void => {
  // Check if old insecure API keys are still present
  if (process.env.EXPO_PUBLIC_VIBECODE_GROK_API_KEY && process.env.NODE_ENV === 'production') {
    console.error('🚨 SECURITY WARNING: EXPO_PUBLIC_VIBECODE_GROK_API_KEY detected in production!');
    console.error('Please remove client-side API keys and use the secure backend proxy.');
  }
};

// Run security validation on module load
validateSecureGrokSetup();