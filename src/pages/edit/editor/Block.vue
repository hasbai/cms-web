<template>
  <div ref="divRef" class="w-6 bg-slate-200 rounded hover:bg-slate-300 cursor-grab">
    sad
  </div>
</template>

<script lang="ts" setup>
import {BlockProvider} from "@milkdown/plugin-block";
import {useInstance} from '@milkdown/vue';
import {usePluginViewContext} from '@prosemirror-adapter/vue';
import {onUnmounted, ref, VNodeRef, watch} from 'vue';

const {view} = usePluginViewContext()
const [loading, get] = useInstance()

const divRef = ref<VNodeRef>();

let tooltipProvider: BlockProvider | undefined;

watch([loading], () => {
  const editor = get();
  if (loading.value || !editor || tooltipProvider) return;

  editor.action(ctx => {
    tooltipProvider = new BlockProvider({
      ctx,
      content: divRef.value as any,
    })

    tooltipProvider.update(view.value)
  })
})

watch(
    [view],
    () => {
      tooltipProvider?.update(view.value)
    }
)

onUnmounted(() => {
  tooltipProvider?.destroy()
  tooltipProvider = undefined
})

</script>


