import { AIMessage, AIRequestOptions, AIResponse } from "../types/ai";

import { getGrokClient } from "./grok";

interface GrokResponse {
  choices: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

const processGrokResponse = (response: GrokResponse): AIResponse => ({
  content: response.choices[0]?.message?.content ?? "",
  usage: {
    promptTokens: response.usage?.prompt_tokens ?? 0,
    completionTokens: response.usage?.completion_tokens ?? 0,
    totalTokens: response.usage?.total_tokens ?? 0,
  },
});

export const getGrokTextResponse = async (
  messages: AIMessage[], 
  options?: AIRequestOptions
): Promise<AIResponse> => {
  try {
    const client = getGrokClient();
    const defaultModel = "grok-3-beta";

    const response = await client.chat.completions.create({
      model: options?.model ?? defaultModel,
      messages: messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    });

    return processGrokResponse(response);
  } catch (error) {
    throw new Error(`Grok API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getGrokChatResponse = async (prompt: string): Promise<AIResponse> => {
  return await getGrokTextResponse([{ role: "user", content: prompt }]);
};