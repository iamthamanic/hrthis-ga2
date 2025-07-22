import { AIMessage, AIRequestOptions, AIResponse } from "../types/ai";

import { getOpenAIClient } from "./openai";

interface OpenAIResponse {
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

const processOpenAIResponse = (response: OpenAIResponse): AIResponse => ({
  content: response.choices?.[0]?.message?.content ?? "",
  usage: {
    promptTokens: response.usage?.prompt_tokens ?? 0,
    completionTokens: response.usage?.completion_tokens ?? 0,
    totalTokens: response.usage?.total_tokens ?? 0,
  },
});

export const getOpenAITextResponse = async (
  messages: AIMessage[], 
  options?: AIRequestOptions
): Promise<AIResponse> => {
  try {
    const client = getOpenAIClient();
    const defaultModel = "gpt-4o";

    const response = await client.chat.completions.create({
      model: options?.model ?? defaultModel,
      messages: messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    });

    return processOpenAIResponse(response);
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getOpenAIChatResponse = async (prompt: string): Promise<AIResponse> => {
  return await getOpenAITextResponse([{ role: "user", content: prompt }]);
};