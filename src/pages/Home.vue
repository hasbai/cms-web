<template>
  <div class="container flex flex-column flex-1">
    <Bar></Bar>
    <main>
      <Diary></Diary>
    </main>
  </div>
</template>

<script lang="ts" setup>
import Bar from "@/pages/home/Bar.vue";
import Diary from "@/pages/home/Diary.vue";</script>

<style scoped>
.container {
  background: #f3f3f3;
}
</style>
