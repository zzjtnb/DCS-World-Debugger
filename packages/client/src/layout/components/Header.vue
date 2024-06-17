<script lang="ts" setup>
import type { Component } from 'vue'
import type { MenuOption } from 'naive-ui/es/menu'
import { type RouteRecordRaw, RouterLink } from 'vue-router'
import { setI18nLanguage } from '@/plugins/i18n'

const { t, te } = useI18n()
const menuStore = useMenuStore()

function handleLocaleUpdate() {
  if (menuStore.locale === 'zh-CN') {
    menuStore.locale = 'en-US'
  }
  else {
    menuStore.locale = 'zh-CN'
  }
  setI18nLanguage(menuStore.locale)
}
const luaStore = useLuaStore()
function handleThemeUpdate() {
  menuStore.theme === 'dark' ? menuStore.theme = 'light' : menuStore.theme = 'dark'
  menuStore.theme === 'dark' ? luaStore.codemirror.theme = 'oneDark' : luaStore.codemirror.theme = 'default'
}

const route = useRoute()
const activeKey = ref<string | null>(route.path)
const router = useRouter()

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
    { default: () => te(`menu.${label}`) ? t(`menu.${label}`) : label },
  )
}
// 将路由转换为菜单项
function generateMenuData(routes: RouteRecordRaw[], parentPath = ''): MenuOption[] {
  return routes.map((route) => {
    const fullPath = parentPath + (route.path.startsWith('/') ? route.path : `/${route.path}`)
    const menuOption: MenuOption = {
      key: route.path,
      label: renderLabel(route.meta?.title, route.children ? '' : fullPath),
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
      <n-button quaternary type="info" @click="handleLocaleUpdate">
        <template #icon>
          <div class="i-fa6-solid:globe " />
        </template>
        {{ $t(`menu.${menuStore.locale}`) }}
      </n-button>
      <n-button mx-4 quaternary type="primary" @click="handleThemeUpdate">
        <template #icon>
          <div v-if="menuStore.theme === 'light'" class="i-fa6-solid:sun " />
          <div v-else class="i-fa6-solid:moon " />
        </template>
        {{ $t(`menu.${menuStore.theme}`) }}
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
