<template>
  <n-timeline>
    <transition-group name="list">
      <n-timeline-item v-for="content in store.contents" :key="content.id">
        <Content :content="content"/>
      </n-timeline-item>
    </transition-group>
  </n-timeline>
</template>

<script lang="ts" setup>
import Content from "./diary/Content.vue";
import {mainStore} from "@/plugins/store";

const store = mainStore()

store.loadContents()

</script>

<style scoped>

</style>