<template>
  <div class="flex flex-row">
    <div class="date mr-4">
      <div class="day">
        {{ cratedAt.substring(8, 10) }}
      </div>
      <div class="small">
        {{ cratedAt.substring(5, 7) }}/{{ cratedAt.substring(2, 4) }}
      </div>
    </div>
    <div class="relative flex flex-1">
      <div v-ripple
           :style="{transform: `translateX(${translateX}px)`}"
           class="content relative z-10 flex align-center flex-1"
           @click="router.push(`/edit/${content.id}`)"
           @touchend="onMove" @touchmove="onMove" @touchstart="onMove"
      >
        <n-ellipsis :line-clamp="5" :tooltip="false">
          {{ content.text }}
        </n-ellipsis>
      </div>
      <div :class="{'delete': isDelete, 'archive': isArchive}"
           class="icons flex justify-between align-center">
        <mdi-delete-outline v-if="isDelete"/>
        <div v-else></div>
        <mdi-archive-arrow-down-outline v-if="isArchive"/>
        <div v-else></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Content} from '@/models'
import {useRouter} from 'vue-router'
import {computed} from "vue";
import {mainStore} from "@/plugins/store";

const {content} = defineProps<{ content: Content }>()
const cratedAt = new Date(content.created_at).toISOString()

const router = useRouter()

const translateX = ref(0)
let startX = 0
let width = ref(0)
const isDelete = computed(() => translateX.value > 0)
const isArchive = computed(() => translateX.value < 0)

function onMove(e: TouchEvent) {
  switch (e.type) {
    case 'touchstart':
      startX = e.touches[0].clientX
      width.value = document.querySelector('.content')!.clientWidth
      break
    case 'touchmove':
      translateX.value = e.touches[0].clientX - startX
      break
    case 'touchend':
      if (translateX.value > width.value / 2) {
        deleteContent()
      } else if (translateX.value < -width.value / 2) {
        archiveContent()
      } else {
        translateX.value = 0
      }
      break
  }
}

const store = mainStore()

async function deleteContent() {
  const timer = setInterval(() => {
    translateX.value += 1
  }, 10)
  await fetch(`/api/content?id=eq.${content.id}`, {
    method: 'DELETE',
  })
  clearInterval(timer)
  store.contents = store.contents.filter(c => c.id !== content.id)
}

async function archiveContent() {
  console.log('archive')
  translateX.value = 0
}


</script>

<style scoped>
.day {
  font-size: 1.25em;
  font-weight: bold;
}

.small {
  font-size: 0.9em;
  color: rgb(128, 128, 128);
}

.content {
  background: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.delete {
  background: rgb(255, 0, 0, 0.2);
}

.archive {
  background: rgb(0, 255, 0, 0.2);
}

.icons {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  border-radius: 0.5rem;
}

.icons svg {
  font-size: 1.2rem;
}
</style>