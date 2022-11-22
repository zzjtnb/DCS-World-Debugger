<script lang="ts" setup>
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: 'icon',
  },
})
const iconName = computed(() => {
  // 支持name传入icon-xxx或者xxx
  return props.name.includes(`${props.prefix}-`)
    ? props.name
    : `${props.prefix}-${props.name}`
})
</script>

<template>
  <n-icon>
    <svg aria-hidden="true">
      <use :xlink:href="`#${iconName}`" />
    </svg>
  </n-icon>
  {{ iconName }}
</template>
