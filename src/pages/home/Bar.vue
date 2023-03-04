<template>
  <header class="bar">
    <v-btn icon variant="text" @click="store.showMenu = !store.showMenu">
      <transition mode="out-in" name="rotate">
        <mdi-menu v-if="!store.showMenu"/>
        <mdi-menu-close v-else/>
      </transition>
    </v-btn>
  </header>
</template>

<script lang="ts" setup>
import {configStore, mainStore} from "@/plugins/store";

const store = mainStore()

const config = configStore()
const root = document.querySelector(":root") as HTMLElement
root.style.setProperty('--color', config.color)
watch(() => config.color, (color) => {
  root.style.setProperty('--color', color)
})
</script>
<style>

.bar {
  background-color: var(--color);
}
</style>