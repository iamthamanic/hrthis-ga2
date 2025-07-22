/*
IMPORTANT NOTICE: DO NOT REMOVE
./src/api/chat-service.ts
If the user wants to use AI to generate text, answer questions, or analyze images you can use the functions defined in this file to communicate with the OpenAI, Anthropic, and Grok APIs.
*/

// Re-export all services from individual modules
export {
  getAnthropicTextResponse,
  getAnthropicChatResponse,
} from "./anthropic-service";

export {
  getOpenAITextResponse, 
  getOpenAIChatResponse,
} from "./openai-service";

export {
  getGrokTextResponse,
  getGrokChatResponse,
} from "./grok-service";