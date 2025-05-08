import { defineConfig } from './src/types/defineConfig'

export default defineConfig({
	models: {
		defaultModel: 'openai-gpt-4o',
		openai: {
			title: 'openai-gpt-4o',
			apiKey: process.env.OPENAI_API_KEY || '',
			model: 'gpt-4o'
		},
		anthropic: {
			title: 'anthropic-claude-3.7-sonnet',
			apiKey: process.env.ANTHROPIC_API_KEY || '',
			model: 'claude-3.7-sonnet'
		},
		openrouter: {
			title: 'openrouter-openai-gpt-4o',
			apiKey: process.env.OPENROUTER_API_KEY || '',
			model: 'openai/gpt-4o'
		},
		gemini: {
			title: 'gemini-2.0-flash-exp',
			apiKey: process.env.GEMINI_API_KEY || '',
			model: 'gemini-2.0-flash-exp'
		}
	},
	branch: {
		template: '{{type}}/{{issue}}-{{description}}'
	},
	commit: {
		template: '{{type}}: {{subject}}\n\n{{body}}',
		types: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
		scopes: ['ui', 'api', 'core', 'auth', 'database'],
		requireBody: false,
		aiSuggestions: true
	},
	merge: {
		template: 'Merge {{source}} into {{target}}',
		strategies: ['fast-forward', 'recursive', 'ours', 'theirs'],
		defaultStrategy: 'recursive',
		requireDescription: true,
		aiConflictResolution: true,
		reviewBeforeMerge: true
	},
	history: {
		maxEntries: 10,
		format: 'compact'
	}
})
