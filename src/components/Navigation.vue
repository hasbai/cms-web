<template>
  <n-menu id="menu" :class="store.showMenu ? 'navi-show' : 'navi-hide'"
          :options="menuOptions"
          class=""
          @click="onClick"
  />
</template>

<script lang="ts" setup>
import type {MenuOption} from 'naive-ui'
import {NIcon, NThing} from 'naive-ui'
import {Component, h} from 'vue'

// noinspection TypeScriptCheckImport
import IconHome from '~icons/mdi/home'

import {mainStore} from '@/plugins/store'

const store = mainStore()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

const menuOptions: MenuOption[] = [
  {
    label: () => h(NThing, null, {default: () => 'CMS'}),
    key: '-1',
  },
  {
    type: 'divider',
    key: '0',
    props: {
      style: {
        marginLeft: '1rem'
      }
    }
  },
  {
    label: '回家',
    key: '1',
    icon: renderIcon(IconHome)
  },
  {
    label: '回家',
    key: '2',
    icon: renderIcon(IconHome)
  },
]

function onClick() {
  store.showMenu = false
}
</script>

<style>
#menu {
  flex-shrink: 0;
  transition: width 0.8s;
  --navi-width: 0;
}

@media (min-width: 600px) {
  #menu {
    --navi-width: 300px;
  }
}

@media (max-width: 600px) {
  #menu {
    --navi-width: 50%;
  }
}

.navi-hide {
  width: 0;
}

.navi-show {
  width: var(--navi-width);
}

.navi-show + * {
  opacity: 0.3;
}

#menu + * {
  transition: opacity 0.8s;
}

#menu {
  pointer-events: none;
}

.navi-show::after {
  content: '';
  position: absolute;
  display: block;
  top: 0;
  left: var(--navi-width);
  width: calc(100vw - var(--navi-width));
  height: 100%;
  z-index: 100;
  pointer-events: auto;
}
</style>