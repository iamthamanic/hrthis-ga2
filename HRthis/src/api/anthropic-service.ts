import { AIMessage, AIRequestOptions, AIResponse } from "../types/ai";

import { getAnthropicClient } from "./anthropic";

const createAnthropicMessages = (messages: AIMessage[]): Array<{ role: "user" | "assistant"; content: string }> =>
  messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" as const : "user" as const,
    content: msg.content,
  }));

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
}

const processAnthropicResponse = (response: AnthropicResponse): AIResponse => {
  // Handle Anthropic API response structure
  const content = response.content
    ?.filter((block: AnthropicContentBlock) => block.type === 'text')
    ?.map((block: AnthropicContentBlock) => block.text)
    ?.join('') || '';

  return {
    content,
    usage: {
      promptTokens: response.usage?.input_tokens ?? 0,
      completionTokens: response.usage?.output_tokens ?? 0,
      totalTokens: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
    },
  };
};

export const getAnthropicTextResponse = async (
  messages: AIMessage[],
  options?: AIRequestOptions,
): Promise<AIResponse> => {
  try {
    const client = getAnthropicClient();
    const defaultModel = "claude-3-5-sonnet-20240620";

    const response = await client.messages.create({
      model: options?.model ?? defaultModel,
      messages: createAnthropicMessages(messages),
      max_tokens: options?.maxTokens ?? 2048,
      temperature: options?.temperature ?? 0.7,
    });

    return processAnthropicResponse(response);
  } catch (error) {
    throw new Error(`Anthropic API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getAnthropicChatResponse = async (prompt: string): Promise<AIResponse> => {
  return await getAnthropicTextResponse([{ role: "user", content: prompt }]);
};