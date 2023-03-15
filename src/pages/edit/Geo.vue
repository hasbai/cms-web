<template>
  <div class="geo flex">
    <div v-if="weather" class="flex align-center" @click="input('weather')">
      <mdi-white-balance-sunny v-if="weather.startsWith('晴')"/>
      <mdi-weather-partly-cloudy v-else-if="weather.startsWith('多云')"/>
      <mdi-weather-cloudy v-else-if="weather.startsWith('阴')"/>
      <mdi-snowflake v-else-if="weather.includes('雪')"/>
      <mdi-weather-rainy v-else-if="weather.includes('雨')"/>
      <span v-else>
        {{ weather }}
      </span>
      <span class="ml-1">{{ content.weather.split(' ')[1] }}</span>
    </div>
    <div class="flex align-center ml-4" @click="input('location')">
      <mdi-map-marker class="mr-1"/>
      <span class="location">
      {{ content.address }}
      </span>
    </div>
    <n-modal
        v-model:show="showModal"
        :closable="false"
        negative-text="取消"
        positive-text="确认"
        preset="dialog"
        title="修改"
        @positive-click="submitCallback"
        @negative-click="cancelCallback"
    >
      <n-input v-model:value="inputValue.value" class="mt-2" placeholder="输入"/>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {Amap} from "@/plugins/amap";
import {Content} from "@/models";

const props = defineProps<{ modelValue: Content }>()
const emit = defineEmits(['update:modelValue'])

const content = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

watch(content, (value) => {
  if (!value.id || !value.coordinate || !value.address || !value.weather) {
    loadGeo()
  }
})

async function loadGeo() {
  await Amap.isReady
  const location = await Amap.getLocation()
  content.value.coordinate = `${location.coords.longitude},${location.coords.latitude}`
  content.value.address = location.formattedAddress
      .replace(location.addressComponent.province, '')
      .replace(location.addressComponent.city, '')
      .replace(location.addressComponent.district, '')
      .replace(location.addressComponent.township, '')
  const weather = await Amap.getWeather(location.addressComponent.adcode)
  content.value.weather = `${weather.weather} ${weather.temperature}°C ${weather.windDirection}风${weather.windPower.substring(1, 2)}级`
}

const weather = computed(() => {
  return (content.value.weather || '').split(' ')[0]
})

const showModal = ref(false)
const inputValue = reactive({
  value: '',
  type: ''
})

function input(type: string) {
  showModal.value = true
  switch (type) {
    case 'weather':
      inputValue.value = content.value.weather
      inputValue.type = type
      break
    case 'location':
      inputValue.value = content.value.address
      inputValue.type = type
      break
  }
}

function cancelCallback() {
  setTimeout(() => {
    inputValue.value = ''
    inputValue.type = ''
  }, 100)
}

function submitCallback() {
  switch (inputValue.type) {
    case 'weather':
      content.value.weather = inputValue.value
      break
    case 'location':
      content.value.address = inputValue.value
      break
  }
  cancelCallback()
}

</script>

<style scoped>
.location {
  font-size: 0.8em;
  color: #666;
}
</style>