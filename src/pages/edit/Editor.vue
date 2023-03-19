<template>
  <div>
    <Milkdown class="mb-2"
              @focusin="onFocus" @focusout="onFocus"/>
    <v-btn :loading="loading" class="fixed-btn" icon variant="text" size="large" @click="onClick">
      <mdi-plus v-if="focused"/>
      <mdi-check v-else/>
    </v-btn>
    <n-modal v-model:show="showModal" :auto-focus="false" :closable="false"
             class="modal" preset="card"
             @after-leave="onClose">
      <div class="flex justify-between">
        <input ref="input" accept="image/*" style="display:none" type="file" @change="onUpload">
        <div v-for="item in insertItems" :key="item" class="mx-2 my-2">
          <n-button style="width: 5rem; height: 5rem" @click="onUploadClick(item)">
            <template #icon>
              <n-icon size="4rem">
                <mdi-image v-if="item === 'image'"/>
                <mdi-video v-else-if="item === 'video'"/>
                <mdi-music v-else-if="item === 'audio'"/>
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {Content} from "@/models";
// milkdown
import {Editor, EditorStatus, editorViewOptionsCtx, rootCtx} from "@milkdown/core";
import {insert, replaceAll} from "@milkdown/utils";
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
import {slashFactory} from '@milkdown/plugin-slash';
import Slash from "@/pages/edit/editor/Slash.vue";
import {math} from '@milkdown/plugin-math';
import 'katex/dist/katex.min.css';
import {prism, prismConfig} from '@milkdown/plugin-prism';
import 'prism-themes/themes/prism-nord.css'
import markdown from 'refractor/lang/markdown'
import css from 'refractor/lang/css'
import javascript from 'refractor/lang/javascript'
import typescript from 'refractor/lang/typescript'
import {usePluginViewFactory} from '@prosemirror-adapter/vue';
import {Milkdown, useEditor} from "@milkdown/vue";
import video from "@/pages/edit/editor/video";

const props = defineProps<{ modelValue: Content, loading: boolean }>()
const emit = defineEmits(['update:modelValue', 'send'])

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
  if (text === undefined) return
  if (!isReady) return
  await isReady
  editor.action(replaceAll(text))
  focus()
}

let editor: Editor;
let isReady: Promise<void>;
const editable = () => true;
const pluginViewFactory = usePluginViewFactory();
const slash = slashFactory('my-slash');
useEditor((root) => {
  editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        // ctx.set(defaultValueCtx, '# Hello milkdown');
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
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: Slash
          })
        })
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
      .use(slash)
      .use(video)
  isReady = new Promise((resolve) => {
    editor.onStatusChange((status: EditorStatus) => {
      if (status === EditorStatus.Created) {
        resolve()
      }
    });
  })
  return editor
})

let timer = 0
const onChange = (ctx: Ctx, markdown: string, prevMarkdown: string | null) => {
  if (markdown === prevMarkdown) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    content.value.text = markdown
  }, 500)
}

const uploadFile = async (file: File) => {
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
        const src = await uploadFile(image);
        const alt = image.name;
        return schema.nodes.image.createAndFill({
          src,
          alt,
        })!
      }),
  );
};

const focused = ref(false)
const onFocus = (e: FocusEvent) => {
  setTimeout(() => {
    switch (e.type) {
      case 'focusin':
        focused.value = true
        break
      case 'focusout':
        focused.value = false
        break
    }
  }, 100)
}
const focus = () => {
  const el = document.querySelector('.milkdown .editor')
  if (el instanceof HTMLElement) {
    el.focus()
  }
}

const insertItems = ['image', 'video', 'audio',]
const showModal = ref(false)
const onClick = () => {
  if (!focused.value) {
    emit('send')
    return
  }
  showModal.value = true
}

const input = ref<HTMLInputElement>()
const onUploadClick = (item: string) => {
  input.value!.setAttribute('accept', `${item}/*`)
  input.value!.click()
}
const onUpload = async () => {
  const files = input.value!.files
  if (!files || !files.length) return
  const type = input.value!.accept.split('/')[0].trim()
  if (!files[0].type.includes(type)) return
  const url = await uploadFile(files[0])
  console.log(url)
  switch (type) {
    case 'image':
      editor.action(insert(`![${files[0].name}](${url})`))
      break
    case 'video':
      break
    case 'audio':
      break
  }
  showModal.value = false
}

const onClose = () => {
  setTimeout(() => {
    focus()
  }, 100)
}
</script>

<style>
.milkdown p {
  margin: 1rem 0;
}

.milkdown img {
  max-height: 50vh;
  max-width: 80vw;
  display: block;
  margin: 0 auto;
}

.milkdown video {
  margin: 1rem auto;
  display: block;
  max-width: 100%;
}

.milkdown *:focus-visible {
  outline: none;
}

.modal {
  width: 50%;
  min-width: 350px;
}
</style>