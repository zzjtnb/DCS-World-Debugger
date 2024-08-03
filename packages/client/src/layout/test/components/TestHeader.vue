<script lang="ts" setup>
import { RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeKey = ref<string | null>(route.path)

// 扁平化路由数据，移除根路径的 children 并将其提升到同一级
function flattenRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []
  routes.forEach((route) => {
    if (route.children) {
      result.push(...route.children)
    }
  })
  return result
}

function renderIcon(icon: Component) {
  if (!icon)
    return () => ''
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderLabel(label: unknown, path: string) {
  if (!label)
    return () => ''
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
// 将路由转换为菜单项
function generateMenuData(routes: RouteRecordRaw[], parentPath = ''): MenuOption[] {
  return routes.map((route) => {
    const fullPath = parentPath + (route.path.startsWith(parentPath) ? route.path : `/${route.path}`)
    const menuOption: MenuOption = {
      key: fullPath,
      label: renderLabel(route.meta?.title, route.children ? '' : fullPath),
      icon: renderIcon(route.meta?.icon as Component),
      children: route.children ? generateMenuData(route.children, fullPath) : undefined,
    }
    return menuOption
  })
}

// 从 Vue Router 实例中获取路由并生成菜单数据
const originalRoutes = router.options.routes

const showRoutes = originalRoutes.filter(route => route.path === '/test')
const flatRoutes = flattenRoutes(showRoutes)
const menuOptions = generateMenuData(flatRoutes, '/test')
console.log(menuOptions)
menuOptions.push({
  key: '/color',
  label: renderLabel('中国传统色', '/color'),
})
</script>

<template>
  <header grid="~ cols-3" px-80 py-4>
    <n-menu v-model:value="activeKey" accordion mode="horizontal" :options="menuOptions" />
  </header>
</template>

<style>
.v-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: 1em;
}

.v-icon > svg {
  width: 100%;
  height: 100%;
}
</style>
