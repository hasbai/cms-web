<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <Navigation/>
      <div class="container flex flex-column flex-1">
        <AppBar/>
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="fade">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import {GlobalThemeOverrides, NConfigProvider} from 'naive-ui'
import Navigation from "@/components/Navigation.vue";
import AppBar from "@/components/Bar.vue";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontSize: "1rem"
  },
}
</script>

<style>
.container {
  background: #f3f3f3;
}
</style>
