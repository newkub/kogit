declare module 'node-fzf' {
  interface FzfResult<T = string> {
    selected?: {
      value: T
      index: number
    }
    query: string
  }

  interface FzfOptions<T = string> {
    list: T[]
    mode?: 'fuzzy' | 'normal'
    query?: string
    selectOne?: boolean
    height?: number
    prelinehook?: (index: number) => string
    postlinehook?: (index: number) => string
  }

  function fzf<T = string>(options: FzfOptions<T>): Promise<FzfResult<T>>
  function getInput(label: string): Promise<string>

  export = fzf
  export { getInput }
}
