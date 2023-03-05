export interface Content {
  id: number
  author: string
  title: string
  text: string
  created_at: string
  updated_at: string
}

export function newDraft() {
  return {
    author: '',
    title: '',
    text: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
