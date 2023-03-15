export interface Content {
  id: number
  author: string
  title: string
  text: string
  created_at: string
  updated_at: string
  coordinate: string
  address: string
  weather: string
}

export function newContent() {
  return {
    author: '',
    title: '',
    text: '',
    address: '',
    weather: '',
  } as Content
}
