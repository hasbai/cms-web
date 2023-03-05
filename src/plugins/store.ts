import { defineStore } from 'pinia'
import { Content } from '@/models'

export const configStore = defineStore('config', {
  state: () => {
    return {
      color: '#00796B',
      draft: {} as Content,
    }
  },
  actions: {},
  persist: true,
})

export const mainStore = defineStore('main', {
  state: () => {
    return {
      showMenu: false,
      contents: new Array<Content>(),
    }
  },
  actions: {
    async loadContents() {
      const r = await fetch('/api/content?order=id.desc')
      this.contents = await r.json()
    },
  },
})
