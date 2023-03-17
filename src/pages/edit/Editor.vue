<template>
  <div ref="editorRef" autofocus class="mb-2"/>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {Content} from "@/models";

// milkdown
import {defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx} from "@milkdown/core";
import {blockquoteKeymap, commonmark} from "@milkdown/preset-commonmark";
import {Ctx} from "@milkdown/ctx";
import {listener, listenerCtx} from "@milkdown/plugin-listener";
import {nord} from "@milkdown/theme-nord";
// plugins
import {emoji} from "@milkdown/plugin-emoji";
import {history} from "@milkdown/plugin-history";
import {indent} from "@milkdown/plugin-indent";
import {trailing} from "@milkdown/plugin-trailing";
import {cursor} from "@milkdown/plugin-cursor";
import {clipboard} from "@milkdown/plugin-clipboard";
import {upload, uploadConfig, Uploader} from '@milkdown/plugin-upload';
import {math} from '@milkdown/plugin-math';
import 'katex/dist/katex.min.css';
import {prism, prismConfig} from '@milkdown/plugin-prism';
import 'prism-themes/themes/prism-nord.css'
import markdown from 'refractor/lang/markdown'
import css from 'refractor/lang/css'
import javascript from 'refractor/lang/javascript'
import typescript from 'refractor/lang/typescript'

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
  setText(value.text)
})

async function setText(text: string | undefined) {
  await editor
  if (text === undefined) return
}

let editor: Promise<Editor>
const editorRef = ref<HTMLElement>()
onMounted(() => {
  const editable = () => true;
  editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, editorRef.value);
        ctx.set(defaultValueCtx, '# Hello milkdown');
        ctx.get(listenerCtx).markdownUpdated(onChange);
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          editable,
        }))
        ctx.set(blockquoteKeymap.key, {
          WrapInBlockquote: ['Mod-Shift-b', 'Mod-b'],
        })
        // ctx.set(block.key, {
        //   view:  (view) => {
        //     const content = document.createElement('div');
        //     content.innerText = ''
        //
        //     const provider = new BlockProvider({
        //       ctx,
        //       content: content,
        //     });
        //
        //     return {
        //       update: (updatedView: EditorView, prevState: any) => {
        //         console.log('update', updatedView)
        //         provider.update(updatedView);
        //       },
        //       destroy: () => {
        //         provider.destroy();
        //         content.remove();
        //       },
        //       drop: () => {
        //         console.log('drop')
        //       },
        //     }
        //   }
        // })
        // ctx.set(indentConfig, {
        //   type: 'tab',
        //   size: 2,
        // })
        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(markdown)
            refractor.register(css)
            refractor.register(javascript)
            refractor.register(typescript)
          },
        })
        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader,
        }));
      })
      .config(nord)
      .use(listener)
      .use(emoji)
      .use(commonmark)
      .use(history)
      .use(prism)
      .use(indent)
      .use(trailing)
      .use(upload)
      .use(cursor)
      .use(clipboard)
      .use(math)
      .create()
})

let timer = 0
const onChange = (ctx: Ctx, markdown: string, prevMarkdown: string | null) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    console.log(markdown)
  }, 500)
}

const uploadByFile = async (file: File) => {
  const r = await fetch('/api/rpc/upload', {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Type': file.type
    }
  })
  const data = await r.json()
  return '/api/rpc/file?id=' + data.id
}
const uploader: Uploader = async (files, schema) => {
  const allowedTypes = ['image'];
  const images: File[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (!file) {
      continue;
    }
    for (const type of allowedTypes) {
      if (file.type.includes(type)) {
        images.push(file);
        break;
      }
    }
  }
  return await Promise.all(
      images.map(async (image) => {
        const src = await uploadByFile(image);
        const alt = image.name;
        return schema.nodes.image.createAndFill({
          src,
          alt,
        })!
      }),
  );
};

</script>

<style>
.milkdown {
//min-height: 10rem;
}

.milkdown *:focus-visible {
  outline: none;
}
</style>