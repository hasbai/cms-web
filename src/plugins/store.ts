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
      if (!r.ok) throw new Error(await r.text())
      this.contents = await r.json()
    },
    async deleteContent(id: number) {
      const r = await fetch(`/api/content?id=eq.${id}`, {
        method: 'DELETE',
      })
      if (!r.ok) throw new Error(await r.text())
      this.contents = this.contents.filter((c) => c.id !== id)
    },
    async archiveContent(id: number) {
      console.log('archiving', id)
      // const r = await fetch(`/api/content?id=eq.${id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ archived: true }),
      // })
      // if (!r.ok) throw new Error(await r.text())
    },
  },
})
