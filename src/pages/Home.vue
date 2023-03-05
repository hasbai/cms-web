<template>
  <main>
    <Diary/>
    <router-link to="/edit">
      <v-btn class="fixed-btn" icon size="large">
        <mdi-pencil-outline/>
      </v-btn>
    </router-link>
  </main>
</template>

<script lang="ts" setup>
import Diary from "@/pages/home/Diary.vue";</script>

<style scoped>

</style>
