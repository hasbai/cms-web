import { createPinia, defineStore } from 'pinia'
import { Content, newContent } from '@/models'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { App } from 'vue'
import { client } from '@/plugins/client'

export const configStore = defineStore('config', {
  state: () => {
    return {
      color: '#00796B',
    }
  },
  actions: {},
  persist: true,
})

export const mainStore = defineStore('main', {
  state: () => {
    return {
      showMenu: false,
      draft: newContent(),
      contents: new Array<Content>(),
    }
  },
  actions: {
    async getContent(id: number) {
      const r = await client.get(`/content?id=eq.${id}`)
      const data = (await r.json()) as Content[]
      if (data.length === 0) return null
      return data[0]
    },
    async loadContents() {
      const r = await client.get('/content?order=id.desc')
      if (!r.ok) throw new Error(await r.text())
      this.contents = await r.json()
    },
    async addContent(content: Content) {
      const fromDraft = !content.id
      const r = await client.post('/content', content)
      const data = await r.json()
      content = data[0] as Content
      if (fromDraft) {
        this.contents.unshift(content)
        this.draft = {} as Content
      } else {
        const i = this.contents.findIndex((c) => c.id === content.id)
        this.contents[i] = content
      }
    },
    async deleteContent(id: number) {
      const r = await client.del(`/content?id=eq.${id}`)
      if (!r.ok) throw new Error(await r.text())
      this.contents = this.contents.filter((c) => c.id !== id)
    },
    async archiveContent(id: number) {
      console.log('archiving', id)
      // const r = await fetch(`/content?id=eq.${id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ archived: true }),
      // })
      // if (!r.ok) throw new Error(await r.text())
    },
  },
  persist: {
    paths: ['draft'],
  },
})

export const registerPinia = (app: App) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
