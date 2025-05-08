interface ModelConfig {
  /** Title for display */
  title: string
  /** API key for the model */
  apiKey: string
  /** Model name or identifier */
  model: string
  /** Other optional configuration */
  [key: string]: unknown
}

type CommitConfig = {
  /** Template for commit message */
  template: string
  /** Allowed commit types */
  types: string[]
  /** Allowed commit scopes */
  scopes: string[]
  /** Whether commit body is required */
  requireBody: boolean
  /** Enable AI suggestions for commit messages */
  aiSuggestions: boolean
}

type MergeConfig = {
  /** Template for merge message */
  template: string
  /** Allowed merge strategies */
  strategies: string[]
  /** Default merge strategy */
  defaultStrategy: string
  /** Whether merge description is required */
  requireDescription: boolean
  /** Enable AI for conflict resolution */
  aiConflictResolution: boolean
  /** Require review before merge */
  reviewBeforeMerge: boolean
}

type BranchConfig = {
  /** Template for branch name */
  template: string
}

type HistoryConfig = {
  /** Maximum number of history entries to show */
  maxEntries: number
  /** Display format (compact | detailed) */
  format: 'compact' | 'detailed'
}

export interface KogitConfig {
  /** Default model name to use */
  defaultModel?: string
  models: {
    openai: ModelConfig | string
    anthropic: ModelConfig | string
    openrouter: ModelConfig | string
    gemini: ModelConfig | string
    [key: string]: ModelConfig | string
  }
  commit: CommitConfig
  merge: MergeConfig
  branch: BranchConfig
  history: HistoryConfig
}

export function defineConfig<T extends KogitConfig>(config: T): T {
  return config
}