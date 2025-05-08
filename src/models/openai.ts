import { OpenAI } from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  organization?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface ChatCompletionParams {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export const createOpenAIClient = (config: OpenAIConfig) => {
  return new OpenAI({
    apiKey: config.apiKey,
    organization: config.organization,
    timeout: config.timeout,
    maxRetries: config.maxRetries,
  });
};

export const createChatCompletion = async (
  client: OpenAI,
  params: ChatCompletionParams
) => {
  return client.chat.completions.create(params);
};