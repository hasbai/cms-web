<template>
  <div class="flex flex-row">
    <div class="date">
      <div class="day">
        {{ cratedAt.substring(8, 10) }}
      </div>
      <div class="small">
        {{ cratedAt.substring(5, 7) }}/{{ cratedAt.substring(2, 4) }}
      </div>
    </div>

    <div v-ripple class="content flex align-center flex-1 ml-4">
      <!--      <div class="text-end small">-->
      <!--        {{ cratedAt.substring(11, 16) }}-->
      <!--      </div>-->
      <n-ellipsis :line-clamp="5" :tooltip="false">
        {{ content.text }}
      </n-ellipsis>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {content} = defineProps<{ content: Content }>()
const cratedAt = new Date(content.created_at).toISOString()
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
</style>