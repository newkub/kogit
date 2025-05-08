import { defineConfig } from './src/types/defineConfig'

export default defineConfig({
	models: {
		// Default model configurations
		openai: {
			apiKey: process.env.OPENAI_API_KEY || '',
			model: 'gpt-4-turbo',
			maxRetries: 3
		},
		anthropic: {
			apiKey: process.env.ANTHROPIC_API_KEY || '',
			model: 'claude-3-opus-20240229',
			maxRetries: 3
		},
		openrouter: {
			apiKey: process.env.OPENROUTER_API_KEY || '',
			model: 'openai/gpt-4-turbo'
		},
		gemini: {
			apiKey: process.env.GEMINI_API_KEY || '',
			model: 'gemini-pro'
		}
	},
	commit: {
		// Commit configuration
		template: '{{type}}: {{subject}}\n\n{{body}}'
	},
	branch: {
		// Branch naming configuration
		template: '{{type}}/{{description}}'
	},
	history: {
		// History display configuration
		maxEntries: 10,
		format: 'compact'
	}
})
