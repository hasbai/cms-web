import { defineStore } from 'pinia'

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
      contents: [],
    }
  },
  actions: {},
})
