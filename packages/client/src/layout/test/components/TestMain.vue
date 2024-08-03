<script lang="ts" setup>
// 需要缓存的路由组件
const keepAliveComponents = computed(() => '')
</script>

<template>
  <RouterView>
    <template #default="{ Component, route }">
      <keep-alive v-if="keepAliveComponents" :include="keepAliveComponents">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
      <component :is="Component" v-else :key="route.fullPath" />
    </template>
  </RouterView>
</template>
