<template>
  <main>
    <p v-if="isLoading">正在重定向...</p>
  </main>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {auth} from "@/plugins/client";

const isLoading = ref(true)
const router = useRouter()
const route = useRoute()

onBeforeMount(async () => {
  const token = await auth.getToken(route.query.code as string)
  localStorage.setItem('token', token)
  isLoading.value = false
  await router.push(route.query.redirect as string)
})

</script>

<style scoped>

</style>