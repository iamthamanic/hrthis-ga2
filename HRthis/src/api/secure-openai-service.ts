/**
 * SECURE OPENAI SERVICE
 * 
 * This service replaces the insecure openai-service.ts with secure backend proxy calls.
 * 
 * 🔒 SECURITY IMPROVEMENTS:
 * - No client-side API keys
 * - Backend proxy architecture
 * - Bearer token authentication
 * - Proper error handling
 */

import { AIMessage, AIRequestOptions, AIResponse } from "../types/ai";

import { secureOpenAIService } from "./secure-ai-proxy";

/**
 * Get text response from OpenAI via secure backend proxy
 * 
 * @param messages - Array of AI messages
 * @param options - Optional request options (model, temperature, etc.)
 * @param token - Optional authentication token
 * @returns Promise<AIResponse>
 */
export const getOpenAITextResponse = async (
  messages: AIMessage[],
  options?: AIRequestOptions,
  token?: string
): Promise<AIResponse> => {
  try {
    // Set default model for OpenAI if not specified
    const requestOptions: AIRequestOptions = {
      model: "gpt-4o-2024-11-20",
      maxTokens: 2048,
      temperature: 0.7,
      ...options,
    };

    return await secureOpenAIService.getTextResponse(messages, requestOptions, token);
  } catch (error) {
    // Enhanced error handling with context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Secure OpenAI Service Error: ${errorMessage}`);
  }
};

/**
 * Get chat response from OpenAI via secure backend proxy
 * 
 * @param prompt - Text prompt to send
 * @param options - Optional request options
 * @param token - Optional authentication token
 * @returns Promise<AIResponse>
 */
export const getOpenAIChatResponse = async (
  prompt: string,
  options?: AIRequestOptions,
  token?: string
): Promise<AIResponse> => {
  return await getOpenAITextResponse([{ role: "user", content: prompt }], options, token);
};

/**
 * BACKWARD COMPATIBILITY EXPORTS
 * 
 * These maintain the same function signatures as the original service
 * for seamless migration from insecure to secure implementation.
 */

// Legacy function names for backward compatibility
export const getOpenAIResponse = getOpenAITextResponse;
export const openaiChat = getOpenAIChatResponse;

/**
 * Service configuration and utilities
 */
export const openaiServiceConfig = {
  defaultModel: "gpt-4o-2024-11-20",
  supportedModels: [
    "gpt-4.1-2025-04-14",
    "o4-mini-2025-04-16",
    "gpt-4o-2024-11-20",
    "gpt-4o-mini",
    "gpt-3.5-turbo"
  ],
  
  /**
   * Validate model name
   */
  isValidModel: (model: string): boolean => {
    return openaiServiceConfig.supportedModels.includes(model);
  },

  /**
   * Get optimal model for task type
   */
  getOptimalModel: (taskType: 'chat' | 'analysis' | 'creative' | 'code'): string => {
    switch (taskType) {
      case 'code':
        return "gpt-4.1-2025-04-14";
      case 'analysis':
        return "gpt-4o-2024-11-20";
      case 'creative':
        return "gpt-4o-2024-11-20";
      case 'chat':
      default:
        return "gpt-4o-2024-11-20";
    }
  },

  /**
   * Get cost-optimized model
   */
  getCostOptimizedModel: (): string => {
    return "o4-mini-2025-04-16";
  },
};

/**
 * Advanced OpenAI features via secure proxy
 */
export const advancedOpenAIFeatures = {
  /**
   * Generate response with function calling
   */
  getFunctionCallResponse: async (
    messages: AIMessage[],
    functions: any[],
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    const requestOptions: AIRequestOptions = {
      ...options,
      // Add function calling options to be handled by backend
      functions,
    };

    return await getOpenAITextResponse(messages, requestOptions, token);
  },

  /**
   * Generate response with vision capabilities
   */
  getVisionResponse: async (
    prompt: string,
    imageUrl: string,
    options?: AIRequestOptions,
    token?: string
  ): Promise<AIResponse> => {
    const messages: AIMessage[] = [
      {
        role: "user",
        content: `${prompt}\n\nImage URL: ${imageUrl}`,
      }
    ];

    const requestOptions: AIRequestOptions = {
      model: "gpt-4o-2024-11-20", // Vision-capable model
      ...options,
    };

    return await getOpenAITextResponse(messages, requestOptions, token);
  },
};

/**
 * Security validation
 */
export const validateSecureOpenAISetup = (): void => {
  // Check if old insecure API keys are still present
  if (process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY && process.env.NODE_ENV === 'production') {
    console.error('🚨 SECURITY WARNING: EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY detected in production!');
    console.error('Please remove client-side API keys and use the secure backend proxy.');
  }
};

// Run security validation on module load
validateSecureOpenAISetup();