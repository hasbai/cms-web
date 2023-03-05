<template>
  <main>
    <Diary/>
    <router-link to="/edit">
      <v-btn id="editor-btn" :color="config.color" icon size="large">
        <mdi-pencil-outline/>
      </v-btn>
    </router-link>
  </main>
</template>

<script lang="ts" setup>
import {configStore} from "@/plugins/store";
import Diary from "@/pages/home/Diary.vue";

const config = configStore()

</script>

<style scoped>
.container {
  background: #f3f3f3;
}

#editor-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
}

#editor-btn svg {
  width: 1.75rem;
  height: 1.75rem;
}
</style>
