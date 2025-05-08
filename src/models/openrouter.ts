interface OpenRouterConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export const createOpenRouterClient = (config: OpenRouterConfig) => {
  return {
    async chatCompletion(request: OpenRouterRequest) {
      const response = await fetch(
        config.baseURL || 'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenRouter error: ${response.statusText}`);
      }

      return response.json();
    },
  };
};