<template>
  <div id="editor" ref="editorEl"></div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import EditorJS, {API} from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import MathTex from "editorjs-math";
import {parseEditorJsToMarkdown, parseMarkdownToEditorJs} from "@/utils/editor";
import {Content} from "@/models";

const props = defineProps<{ modelValue: Content }>()
const emit = defineEmits(['update:modelValue'])

const content = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

watch(content, (value) => {
  loadEditor(value.text)
})

const editorEl = ref<HTMLElement>()
let editor: EditorJS
let editorReady: Promise<void>

onMounted(() => {
  editorReady = initEditor()
})

async function initEditor() {
  editor = new EditorJS({
    readOnly: false,
    holder: editorEl.value,
    minHeight: 48,
    placeholder: '说些什么...',
    logLevel: 'ERROR' as any,
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
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile,
            uploadByUrl,
          }
        }
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
    onChange: onChange,
  })
  await editor.isReady
}

async function loadEditor(text: string | undefined) {
  if (text === undefined) return
  await editorReady
  if (text === '') {
    // editor.render() throws 'holder is undefined' when content is empty
    await editor.clear()
  } else {
    await editor.render({
      blocks: parseMarkdownToEditorJs(text)
    })
  }
}

async function onChange(api: API, event: any) {
  const data = await api.saver.save()
  content.value.text = parseEditorJsToMarkdown(data.blocks)
}

async function uploadByFile(file: File) {
  const r = await fetch('/api/rpc/upload', {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Type': file.type
    }
  })
  const data = await r.json()
  return {
    success: 1,
    file: {
      url: '/api/rpc/file?id=' + data.id,
    }
  }
}

async function uploadByUrl(url: string) {
  return {
    success: 1,
    file: {
      url: url,
    }
  }
}
</script>

<style scoped>

</style>