import Anthropic from '@anthropic-ai/sdk';

export interface AnthropicConfig {
  apiKey: string;
  timeout?: number;
  maxRetries?: number;
}

export interface MessageParams {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  max_tokens: number;
  temperature?: number;
  system?: string;
}

export const createAnthropicClient = (config: AnthropicConfig) => {
  return new Anthropic({
    apiKey: config.apiKey,
    timeout: config.timeout,
    maxRetries: config.maxRetries,
  });
};

export const createMessage = async (
  client: Anthropic,
  params: MessageParams
) => {
  return client.messages.create({
    ...params,
    max_tokens: params.max_tokens,
  });
};