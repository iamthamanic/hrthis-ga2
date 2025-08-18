/**
 * SECURE ANTHROPIC SERVICE
 * 
 * This service replaces the insecure anthropic-service.ts with secure backend proxy calls.
 * 
 * 🔒 SECURITY IMPROVEMENTS:
 * - No client-side API keys
 * - Backend proxy architecture
 * - Bearer token authentication
 * - Proper error handling
 */

import { AIMessage, AIRequestOptions, AIResponse } from "../types/ai";
import { secureAnthropicService } from "./secure-ai-proxy";

/**
 * Get text response from Anthropic via secure backend proxy
 * 
 * @param messages - Array of AI messages
 * @param options - Optional request options (model, temperature, etc.)
 * @param token - Optional authentication token
 * @returns Promise<AIResponse>
 */
export const getAnthropicTextResponse = async (
  messages: AIMessage[],
  options?: AIRequestOptions,
  token?: string
): Promise<AIResponse> => {
  try {
    // Set default model for Anthropic if not specified
    const requestOptions: AIRequestOptions = {
      model: "claude-3-5-sonnet-20240620",
      maxTokens: 2048,
      temperature: 0.7,
      ...options,
    };

    return await secureAnthropicService.getTextResponse(messages, requestOptions, token);
  } catch (error) {
    // Enhanced error handling with context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Secure Anthropic Service Error: ${errorMessage}`);
  }
};

/**
 * Get chat response from Anthropic via secure backend proxy
 * 
 * @param prompt - Text prompt to send
 * @param options - Optional request options
 * @param token - Optional authentication token
 * @returns Promise<AIResponse>
 */
export const getAnthropicChatResponse = async (
  prompt: string,
  options?: AIRequestOptions,
  token?: string
): Promise<AIResponse> => {
  return await getAnthropicTextResponse([{ role: "user", content: prompt }], options, token);
};

/**
 * BACKWARD COMPATIBILITY EXPORTS
 * 
 * These maintain the same function signatures as the original service
 * for seamless migration from insecure to secure implementation.
 */

// Legacy function names for backward compatibility
export const getAnthropicResponse = getAnthropicTextResponse;
export const anthropicChat = getAnthropicChatResponse;

/**
 * Service configuration and utilities
 */
export const anthropicServiceConfig = {
  defaultModel: "claude-3-5-sonnet-20240620",
  supportedModels: [
    "claude-sonnet-4-20250514",
    "claude-3-7-sonnet-latest", 
    "claude-3-5-haiku-latest",
    "claude-3-5-sonnet-20240620"
  ],
  
  /**
   * Validate model name
   */
  isValidModel: (model: string): boolean => {
    return anthropicServiceConfig.supportedModels.includes(model);
  },

  /**
   * Get optimal model for task type
   */
  getOptimalModel: (taskType: 'chat' | 'analysis' | 'creative' | 'code'): string => {
    switch (taskType) {
      case 'code':
        return "claude-sonnet-4-20250514";
      case 'analysis':
        return "claude-3-7-sonnet-latest";
      case 'creative':
        return "claude-3-5-sonnet-20240620";
      case 'chat':
      default:
        return "claude-3-5-sonnet-20240620";
    }
  },
};

/**
 * Security validation
 */
export const validateSecureAnthropicSetup = (): void => {
  // Check if old insecure API keys are still present
  if (process.env.EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY && process.env.NODE_ENV === 'production') {
    console.error('🚨 SECURITY WARNING: EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY detected in production!');
    console.error('Please remove client-side API keys and use the secure backend proxy.');
  }
};

// Run security validation on module load
validateSecureAnthropicSetup();