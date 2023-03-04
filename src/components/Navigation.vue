<template>
  <n-menu id="menu" :class="store.showMenu ? 'navi-show' : 'navi-hide'" :options="menuOptions"/>
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
</script>

<style>
#menu {
  flex-shrink: 0;
  transition: width 0.8s;
}

#menu + * {
  transition: opacity 0.8s;
}

@media (min-width: 600px) {
  .navi-show {
    width: 300px;
  }
}

@media (max-width: 600px) {
  .navi-show {
    width: 50%;
  }
}


.navi-show + * {
  opacity: 0.3
}

.navi-hide {
  width: 0;
}

</style>