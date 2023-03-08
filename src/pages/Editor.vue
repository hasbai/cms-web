<template>
  <main>
    <div ref="editorEl"></div>
    <v-btn :loading="loading" class="fixed-btn" icon size="large" @click="send">
      <mdi-check/>
    </v-btn>
  </main>
</template>

<script lang="ts" setup>
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import SimpleImage from '@editorjs/simple-image'
import List from '@editorjs/list'
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote'
import Code from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import MathTex from 'editorjs-math'

import {parseEditorJsToMarkdown, parseMarkdownToEditorJs} from '@/utils/editor'
import {configStore, mainStore} from "@/plugins/store";
import {useRoute, useRouter} from "vue-router";
import {Content} from "@/models";

const router = useRouter()
const loading = ref(false)
const send = async () => {
  loading.value = true
  const data = await editor.save()
  content.text = parseEditorJsToMarkdown(data.blocks)
  const r = await fetch('/api/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation,resolution=merge-duplicates',
    },
    body: JSON.stringify(content)
  })
  loading.value = false
  if (r.status === 201) {
    const data = await r.json()
    const content = data[0] as Content
    if (fromDraft) {
      store.contents.push(content)
      config.draft = {} as Content
    } else {
      const i = store.contents.findIndex(c => c.id === content.id)
      store.contents[i] = content
    }
    await router.push('/')
  } else {
    console.error(await r.text())
  }
}

const store = mainStore()
const config = configStore()
const route = useRoute()

let content: Content
let fromDraft = false

const editorEl = ref<HTMLInputElement>()
let editor: EditorJS

onActivated(async () => {
  content = store.contents.find(c => c.id === parseInt(route.params.id as string))!
  if (!content) {
    content = config.draft
    fromDraft = true
  }
  content.text = content.text || ''

  if (!editor) {
    editor = new EditorJS({
      readOnly: false,
      holder: editorEl.value,
      minHeight: 300,
      placeholder: '说些什么...',
      logLevel: 'WARN' as any,
      tools: {
        header: {
          class: Header,
          inlineToolbar: ['link'],
          config: {
            placeholder: 'Header'
          },
          shortcut: 'CMD+SHIFT+H'
        },
        image: {
          class: SimpleImage,
          inlineToolbar: true
        },
        list: {
          class: List,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+L'
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author"
          },
          shortcut: 'CMD+SHIFT+O'
        },
        code: {
          class: Code,
          shortcut: 'CMD+SHIFT+C'
        },
        delimiter: Delimiter,
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+C'
        },
        linkTool: LinkTool,
        embed: Embed,
        table: {
          class: Table,
          inlineToolbar: true,
          shortcut: 'CMD+ALT+T'
        },
        math: {
          class: MathTex
        }
      },
      data: {
        blocks: parseMarkdownToEditorJs(content.text)
      },
      onChange: async (api, event) => {
        const data = await api.saver.save()
        content.text = parseEditorJsToMarkdown(data.blocks)
      },
    })
    await editor.isReady
  } else {
    if (content.text === '') {
      // editor.render() throws 'holder is undefined' when content is empty
      await editor.clear()
    } else {
      await editor.render({
        blocks: parseMarkdownToEditorJs(content.text)
      })
    }
  }
})
</script>
