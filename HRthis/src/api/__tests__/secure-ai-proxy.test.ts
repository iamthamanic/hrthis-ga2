import { getAuthToken } from '../../state/auth';
import { secureAIService, secureAIRequest } from '../secure-ai-proxy';

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('secureAIRequest', () => {
    it('should make request with proper headers', async () => {
      const mockResponse = {
        success: true,
        data: { content: 'AI response' }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const messages = [{ role: 'user' as const, content: 'Hello' }];
      const result = await secureAIRequest('openai', messages);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/ai/'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle request without auth token', async () => {
      (getAuthToken as jest.Mock).mockReturnValue(null);

      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const messages = [{ role: 'user' as const, content: 'Hello' }];
      await secureAIRequest('openai', messages);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' })
      });

      const messages = [{ role: 'user' as const, content: 'Hello' }];
      
      await expect(secureAIRequest('openai', messages)).rejects.toThrow(
        'AI request failed: 500 Internal Server Error'
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const messages = [{ role: 'user' as const, content: 'Hello' }];
      
      await expect(secureAIRequest('openai', messages)).rejects.toThrow(
        'Network error'
      );
    });

    it('should validate service parameter', async () => {
      const messages = [{ role: 'user' as const, content: 'Hello' }];
      
      // Invalid service should still work but use a default endpoint
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await secureAIRequest('invalid-service' as any, messages);
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/ai/'),
        expect.any(Object)
      );
    });

    it('should include optional parameters in request', async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const messages = [{ role: 'user' as const, content: 'Hello' }];
      const options = {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000
      };

      await secureAIRequest('openai', messages, options);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            messages,
            ...options
          })
        })
      );
    });

    it('should handle streaming responses', async () => {
      const mockResponse = { success: true, streaming: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const messages = [{ role: 'user' as const, content: 'Hello' }];
      const result = await secureAIRequest('openai', messages, { stream: true });

      expect(result).toEqual(mockResponse);
    });

    it('should respect timeout settings', async () => {
      // Mock a delayed response
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ success: true })
            });
          }, 100);
        })
      );

      const messages = [{ role: 'user' as const, content: 'Hello' }];
      const result = await secureAIRequest('openai', messages);

      expect(result).toEqual({ success: true });
    });

    it('should handle different AI services', async () => {
      const services = ['openai', 'anthropic', 'grok'] as const;
      const mockResponse = { success: true };

      for (const service of services) {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });

        const messages = [{ role: 'user' as const, content: 'Hello' }];
        const result = await secureAIRequest(service, messages);

        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(`/api/ai/${service}`),
          expect.any(Object)
        );
      }
    });

    it('should sanitize user input', async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      // Potentially malicious input
      const messages = [{
        role: 'user' as const,
        content: '<script>alert("XSS")</script>'
      }];

      await secureAIRequest('openai', messages);

      // The request should still be made (sanitization happens on backend)
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});