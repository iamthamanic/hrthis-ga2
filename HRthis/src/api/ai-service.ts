/**
 * Secure AI Service Client
 * Uses backend proxy for all AI services - no API keys in frontend!
 */

import { getAuthToken } from '../state/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002/hrthis';

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIRequest {
  model?: string;
  messages: AIMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  system?: string;
}

interface AIResponse {
  content?: string;
  message?: string;
  error?: string;
}

class AIServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public service?: string
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

/**
 * Generic AI service request handler
 */
async function makeAIRequest(
  service: 'anthropic' | 'openai' | 'grok',
  request: AIRequest
): Promise<AIResponse> {
  const token = getAuthToken();
  
  if (!token) {
    throw new AIServiceError('Authentication required', 401, service);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/${service}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const error = await response.text();
      throw new AIServiceError(
        `${service} API error: ${error}`,
        response.status,
        service
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new AIServiceError('Request timeout', 504, service);
      }
      throw new AIServiceError(error.message, 500, service);
    }
    
    throw new AIServiceError('Unknown error occurred', 500, service);
  }
}

/**
 * Anthropic Claude API
 */
export const anthropic = {
  async sendMessage(
    messages: AIMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      system?: string;
    }
  ): Promise<AIResponse> {
    return makeAIRequest('anthropic', {
      model: options?.model || 'claude-3-5-sonnet-20241022',
      messages,
      max_tokens: options?.maxTokens || 1024,
      temperature: options?.temperature || 0.7,
      system: options?.system
    });
  },

  models: [
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'claude-3-haiku-20240307'
  ]
};

/**
 * OpenAI GPT API
 */
export const openai = {
  async sendMessage(
    messages: AIMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      stream?: boolean;
    }
  ): Promise<AIResponse> {
    return makeAIRequest('openai', {
      model: options?.model || 'gpt-4-turbo-preview',
      messages,
      max_tokens: options?.maxTokens || 1024,
      temperature: options?.temperature || 0.7,
      stream: options?.stream || false
    });
  },

  models: [
    'gpt-4-turbo-preview',
    'gpt-4',
    'gpt-3.5-turbo'
  ]
};

/**
 * Grok API
 */
export const grok = {
  async sendMessage(
    messages: AIMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<AIResponse> {
    return makeAIRequest('grok', {
      model: options?.model || 'grok-beta',
      messages,
      max_tokens: options?.maxTokens || 1024,
      temperature: options?.temperature || 0.7
    });
  },

  models: ['grok-beta']
};

/**
 * Get AI usage statistics for current user
 */
export async function getAIUsage() {
  const token = getAuthToken();
  
  if (!token) {
    throw new AIServiceError('Authentication required', 401);
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/usage`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new AIServiceError('Failed to fetch usage', response.status);
  }

  return response.json();
}

/**
 * Get available AI models
 */
export async function getAvailableModels() {
  const token = getAuthToken();
  
  if (!token) {
    throw new AIServiceError('Authentication required', 401);
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/models`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new AIServiceError('Failed to fetch models', response.status);
  }

  return response.json();
}

// Export everything as a single service
export const AIService = {
  anthropic,
  openai,
  grok,
  getUsage: getAIUsage,
  getModels: getAvailableModels
};

export default AIService;