<script setup>
import Header from '@/Header.vue'
</script>

<template>
  <n-message-provider>
    <Header></Header>
    <router-view></router-view>
    <footer></footer>
  </n-message-provider>
</template>

<style></style>
