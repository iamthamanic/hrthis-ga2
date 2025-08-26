import { getAuthToken } from '../../state/auth';

// Mock auth token
jest.mock('../../state/auth', () => ({
  getAuthToken: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

describe('Secure AI Proxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthToken as jest.Mock).mockReturnValue('test-token');
    (global.fetch as jest.Mock).mockClear();
    
    // Reset modules to ensure clean state
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('secureAIRequest', () => {
    it('should return mock response in demo mode', async () => {
      // Import after mocks are set up
      const { secureAIRequest } = await import('../secure-ai-proxy');
      
      const messages = [{ role: 'user' as const, content: 'Hello' }];
      const result = await secureAIRequest('openai', messages);

      // In demo mode, should return mock response
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('[OPENAI DEMO MODE]');
      expect(result.content).toContain('Hello');
      expect(result).toHaveProperty('usage');
    });

    it('should handle different services in demo mode', async () => {
      const { secureAIRequest } = await import('../secure-ai-proxy');
      
      const services = ['openai', 'anthropic', 'grok'] as const;
      const messages = [{ role: 'user' as const, content: 'Test message' }];

      for (const service of services) {
        const result = await secureAIRequest(service, messages);
        
        expect(result).toHaveProperty('content');
        expect(result.content).toContain(`[${service.toUpperCase()} DEMO MODE]`);
        expect(result.content).toContain('Test message');
        expect(result).toHaveProperty('usage');
      }
    });

    it('should handle options in demo mode', async () => {
      const { secureAIRequest } = await import('../secure-ai-proxy');
      
      const messages = [{ role: 'user' as const, content: 'Hello' }];
      const options = {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000
      };

      const result = await secureAIRequest('openai', messages, options);
      
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('[OPENAI DEMO MODE]');
    });

    it('should handle invalid service gracefully', async () => {
      const { secureAIRequest } = await import('../secure-ai-proxy');
      
      const messages = [{ role: 'user' as const, content: 'Hello' }];
      
      // Invalid service should default to openai
      const result = await secureAIRequest('invalid-service' as any, messages);
      
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('[OPENAI DEMO MODE]');
    });

    it('should handle multiple messages', async () => {
      const { secureAIRequest } = await import('../secure-ai-proxy');
      
      const messages = [
        { role: 'system' as const, content: 'You are a helpful assistant' },
        { role: 'user' as const, content: 'Hello' },
        { role: 'assistant' as const, content: 'Hi there!' },
        { role: 'user' as const, content: 'How are you?' }
      ];
      
      const result = await secureAIRequest('openai', messages);
      
      expect(result).toHaveProperty('content');
      // Should use the last user message
      expect(result.content).toContain('How are you?');
    });
  });

  describe('service wrappers in demo mode', () => {
    it('should handle secureOpenAIService', async () => {
      const { secureOpenAIService } = await import('../secure-ai-proxy');
      
      const messages = [{ role: 'user' as const, content: 'Test' }];
      const result = await secureOpenAIService.getTextResponse(messages);
      
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('[OPENAI DEMO MODE]');
    });

    it('should handle secureOpenAIService chat', async () => {
      const { secureOpenAIService } = await import('../secure-ai-proxy');
      
      const result = await secureOpenAIService.getChatResponse('Test prompt');
      
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('[OPENAI DEMO MODE]');
      expect(result.content).toContain('Test prompt');
    });

    it('should handle secureAnthropicService', async () => {
      const { secureAnthropicService } = await import('../secure-ai-proxy');
      
      const messages = [{ role: 'user' as const, content: 'Test' }];
      const result = await secureAnthropicService.getTextResponse(messages);
      
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('[ANTHROPIC DEMO MODE]');
    });

    it('should handle secureGrokService', async () => {
      const { secureGrokService } = await import('../secure-ai-proxy');
      
      const messages = [{ role: 'user' as const, content: 'Test' }];
      const result = await secureGrokService.getTextResponse(messages);
      
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('[GROK DEMO MODE]');
    });
  });

  describe('unified service', () => {
    it('should handle getResponse for all services', async () => {
      const { secureAIService } = await import('../secure-ai-proxy');
      
      const services = ['openai', 'anthropic', 'grok'] as const;
      const messages = [{ role: 'user' as const, content: 'Test' }];
      
      for (const service of services) {
        const result = await secureAIService.getResponse(service, messages);
        
        expect(result).toHaveProperty('content');
        expect(result.content).toContain(`[${service.toUpperCase()} DEMO MODE]`);
      }
    });

    it('should check backend availability', async () => {
      const { secureAIService } = await import('../secure-ai-proxy');
      
      // In test environment without API URL, should return false
      expect(secureAIService.isSecureBackendAvailable()).toBe(false);
    });

    it('should get backend info', async () => {
      const { secureAIService } = await import('../secure-ai-proxy');
      
      const info = secureAIService.getBackendInfo();
      
      expect(info).toHaveProperty('baseURL');
      expect(info).toHaveProperty('isRealAPIEnabled');
      expect(info.isRealAPIEnabled).toBe(false);
      expect(info.availableServices).toEqual(['openai', 'anthropic', 'grok']);
    });
  });

  describe('migration helpers', () => {
    it('should detect insecure API usage', async () => {
      const { migrationHelpers } = await import('../secure-ai-proxy');
      
      // In test environment, should not detect insecure keys
      expect(migrationHelpers.detectInsecureAPIUsage()).toBe(false);
    });

    it('should validate secure setup', async () => {
      const { migrationHelpers } = await import('../secure-ai-proxy');
      
      const result = migrationHelpers.validateSecureSetup();
      
      expect(result).toHaveProperty('isSecure');
      expect(result).toHaveProperty('warnings');
      expect(result.isSecure).toBe(false); // No backend configured in test
      expect(result.warnings).toContain('Backend API URL not configured');
    });
  });
});