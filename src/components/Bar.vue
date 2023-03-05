<template>
  <header class="bar">
    <transition mode="out-in" name="fade">
      <v-btn v-if="isHome" icon variant="text"
             @click="store.showMenu = !store.showMenu">
        <transition mode="out-in" name="rotate">
          <mdi-menu v-if="!store.showMenu"/>
          <mdi-menu-close v-else/>
        </transition>
      </v-btn>
      <v-btn v-else icon variant="text"
             @click="router.back()">
        <mdi-arrow-left/>
      </v-btn>
    </transition>
  </header>
</template>

<script lang="ts" setup>
import {configStore, mainStore} from "@/plugins/store";
import {useRoute, useRouter} from "vue-router";

const store = mainStore()

const config = configStore()
const root = document.querySelector(":root") as HTMLElement
root.style.setProperty('--color', config.color)
watch(() => config.color, (color) => {
  root.style.setProperty('--color', color)
})

const route = useRoute()
const isHome = computed(() => route.name === 'Home')

const router = useRouter()
</script>

<style>
header {
  height: 3rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
}

.bar {
  background-color: var(--color);
}
</style>