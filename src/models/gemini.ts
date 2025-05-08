import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  timeout?: number;
}

export interface GenerateContentParams {
  model: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export const createGeminiClient = (config: GeminiConfig) => {
  return new GoogleGenerativeAI(config.apiKey);
};

export const generateContent = async (
  client: GoogleGenerativeAI,
  params: GenerateContentParams
) => {
  const model = client.getGenerativeModel({ 
    model: params.model,
    generationConfig: {
      temperature: params.temperature,
      maxOutputTokens: params.maxOutputTokens,
    },
  });

  const result = await model.generateContent(params.prompt);
  return result.response;
};