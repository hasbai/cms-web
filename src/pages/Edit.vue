<template>
  <main>
    <Editor v-model="contentWrapper.content"/>
    <Geo v-model="contentWrapper.content"></Geo>
    <v-btn :loading="loading" class="fixed-btn" icon size="large" @click="send">
      <mdi-check/>
    </v-btn>
  </main>
</template>

<script lang="ts" setup>
import {mainStore} from "@/plugins/store";
import {useRoute, useRouter} from "vue-router";
import Geo from "@/pages/edit/Geo.vue";
import {Content} from "@/models";
import {onActivated, reactive, ref} from "vue";
import Editor from "@/pages/edit/Editor.vue";

const router = useRouter()
const loading = ref(false)
const send = async () => {
  loading.value = true

  await store.addContent(contentWrapper.content)

  loading.value = false
  await router.push('/')
}

const store = mainStore()
const route = useRoute()

onActivated(() => {
  loadContent()
})

const contentWrapper = reactive({
  content: {} as Content,
})

async function loadContent() {
  const id = parseInt(route.params.id as string)
  let draft = store.contents.find((c: Content) => c.id === id)!
  if (!draft) {
    if (id) {
      draft = (await store.getContent(id))!
    }
  }
  if (draft) {
    contentWrapper.content = draft
  } else {
    contentWrapper.content = store.draft
  }
}


</script>
