<script lang="ts" setup>
import type { Component } from 'vue'
import type { MenuOption } from 'naive-ui/es/menu'
import { type RouteMeta, type RouteRecordRaw, RouterLink } from 'vue-router'

// locale

const menuStore = useMenuStore()

const localeLabelMap: Record<LocaleType, string> = {
  'zh-CN': 'English',
  'en-US': '中文',
}
function handleLocaleUpdate() {
  if (menuStore.locale === 'zh-CN') {
    menuStore.locale = 'en-US'
  }
  else {
    menuStore.locale = 'zh-CN'
  }
}
const locales: Record<LocaleType, { dark: string, light: string }> = {
  'zh-CN': {
    dark: '深色',
    light: '浅色',
  },
  'en-US': {
    dark: 'Dark',
    light: 'Light',
  },
}
// theme
const themeLabelMap = computed(() => ({
  dark: locales[menuStore.locale].dark,
  light: locales[menuStore.locale].light,
}))
function handleThemeUpdate() {
  menuStore.theme === 'dark' ? menuStore.theme = 'light' : menuStore.theme = 'dark'
}

const route = useRoute()
const activeKey = ref<string | null>(route.path)
const router = useRouter()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderLabel(path: string, meta: RouteMeta | undefined) {
  if (!meta)
    return () => ''
  return () => h(
    RouterLink,
    {
      to: {
        path,
      },
    },
    { default: () => meta.title },
  )
}
// 扁平化路由数据，移除根路径的 children 并将其提升到同一级
function flattenRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []
  routes.forEach((route) => {
    if (route.path === '/') {
      if (route.children) {
        result.push(...route.children)
      }
    }
    else {
      result.push(route)
    }
  })

  return result
}

// 将路由转换为菜单项
function generateMenuData(routes: RouteRecordRaw[], parentPath = ''): MenuOption[] {
  return routes.map((route) => {
    const fullPath = parentPath + (route.path.startsWith('/') ? route.path : `/${route.path}`)
    const menuOption: MenuOption = {
      key: route.path,
      label: route.children ? route.meta?.title as string : renderLabel(fullPath, route.meta),
      // label: route.meta?.title as string,
      icon: renderIcon(route.meta?.icon as Component),
      children: route.children ? generateMenuData(route.children, fullPath) : undefined,
    }

    return menuOption
  })
}

// 从 Vue Router 实例中获取路由并生成菜单数据
const originalRoutes = router.options.routes
const flatRoutes = flattenRoutes([...originalRoutes])
const menuOptions = generateMenuData(flatRoutes)
</script>

<template>
  <header grid="~ cols-3" px-20 mb-2>
    <n-menu v-model:value="activeKey" accordion mode="horizontal" :options="menuOptions" />
    <div flex items-center hidden />
    <nav flex items-center justify-end>
      <n-button size="small" quaternary class="nav-picker" @click="handleLocaleUpdate">
        <div class="i-fa6-solid:language w-32px h-32px" />
        {{ localeLabelMap[menuStore.locale] }}
      </n-button>
      <n-button size="small" quaternary class="nav-picker" @click="handleThemeUpdate">
        {{ themeLabelMap[menuStore.theme] }}
      </n-button>
      <!-- <p>
        <span>Icon</span>
        <Fa6SolidDesktop class="v-icon" />
      </p>
      <p>
        <span>icon-</span>
        <fa6-solid:desktop class="v-icon" />
      </p> -->
    </nav>
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
