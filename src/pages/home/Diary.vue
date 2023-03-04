<template>
  <n-timeline>
    <n-timeline-item v-for="(content, i) in store.contents" :key="i">
      <Content :content="content"/>
    </n-timeline-item>
  </n-timeline>
</template>

<script lang="ts" setup>
import Content from "./diary/Content.vue";
import {mainStore} from "@/plugins/store";

const store = mainStore()

onBeforeMount(async () => {
  const r = await fetch('/api/content?order=id.desc')
  store.contents = await r.json()
})

</script>

<style scoped>

</style>