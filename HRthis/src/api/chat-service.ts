/*
IMPORTANT NOTICE: DO NOT REMOVE
./src/api/chat-service.ts
If the user wants to use AI to generate text, answer questions, or analyze images you can use the functions defined in this file to communicate with the OpenAI, Anthropic, and Grok APIs.

🔒 SECURITY UPDATE: This now uses secure backend proxy services instead of direct client-side API calls.
All API keys are now handled securely on the backend with proper authentication.
*/

// 🔒 SECURE SERVICES - Re-export all services from secure modules
// 🔒 SECURITY VALIDATION
import { migrationHelpers } from "./secure-ai-proxy";

export {
  getAnthropicTextResponse,
  getAnthropicChatResponse,
} from "./secure-anthropic-service";

export {
  getOpenAITextResponse, 
  getOpenAIChatResponse,
} from "./secure-openai-service";

export {
  getGrokTextResponse,
  getGrokChatResponse,
} from "./secure-grok-service";

// 🚀 UNIFIED SECURE API - New simplified interface
export { 
  secureAIService,
  secureOpenAIService,
  secureAnthropicService,
  secureGrokService,
  migrationHelpers,
} from "./secure-ai-proxy";

// Validate secure setup on module load
const securityCheck = migrationHelpers.validateSecureSetup();
if (!securityCheck.isSecure && process.env.NODE_ENV === 'production') {
  console.error('🚨 CRITICAL SECURITY WARNINGS:', securityCheck.warnings);
}