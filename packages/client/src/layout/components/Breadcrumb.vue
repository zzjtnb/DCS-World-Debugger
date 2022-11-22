<script lang="ts" setup>
import type { Component } from '@vue/runtime-core'
import { RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderLable(path: string, label: string) {
  return () => h(
    RouterLink,
    {
      to: {
        path,
      },
    },
    { default: () => label },
  )
}
const generator: any = (routerMap: any[]) => {
  return routerMap.map((item) => {
    const currentMenu = {
      ...item,
      label: item.meta.title,
      key: item.name,
      disabled: item.path === '/',
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentMenu.children = generator(item.children, currentMenu)
    }
    return currentMenu
  })
}
const breadcrumbList = computed(() => {
  return generator(route.matched)
})
const dropdownSelect = (key) => {
  router.push({ name: key })
}
</script>

<template>
  <!-- 面包屑 -->
  <n-breadcrumb>
    <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
      <n-breadcrumb-item v-if="routeItem.meta.title">
        <n-dropdown
          v-if="routeItem.children.length"
          :options="routeItem.children"
          @select="dropdownSelect"
        >
          <span class="link-text">
            <Component
              :is="routeItem.meta.icon"
              v-if="routeItem.meta.icon"
            />
            {{ routeItem.meta.title }}
          </span>
        </n-dropdown>
        <span v-else class="link-text">
          <Component
            :is="routeItem.meta.icon"
            v-if="routeItem.meta.icon"
          />
          {{ routeItem.meta.title }}
        </span>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<style lang="scss" scoped>

</style>
