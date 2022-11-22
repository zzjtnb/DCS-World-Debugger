<script lang="ts" setup>
import type { Component } from '@vue/runtime-core'
import type { MenuOption } from 'naive-ui/es/menu'
import { RouterLink } from 'vue-router'

const activeKey = ref<string | null>(null)
const router = useRouter()

// const list = router.getRoutes()
const list = router.options.routes

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
const menuOptions: MenuOption[] = []
list.forEach((item) => {
  if (item.path === '/') {
    if (item?.children) {
      item.children.forEach((ch_item) => {
        if (ch_item.meta?.title && ch_item.meta?.icon) {
          const data: { [key: string]: any } = {
            key: ch_item.path,
            icon: renderIcon(ch_item.meta.icon),
            label: renderLable(ch_item.path, ch_item.meta.title as string || ''),
          }
          if (ch_item.children) {
            ch_item.children.forEach((cc_item) => {
              data.children = []
              data.children.push({
                key: cc_item.path,
                icon: renderIcon(cc_item.meta?.icon || ''),
                label: renderLable(cc_item.path, cc_item.meta?.title as string || ''),
              })
            })
          }
          menuOptions.push(data)
        }
      })
    }
  }
})
</script>

<template>
  <n-menu mode="horizontal" :options="menuOptions" />
</template>

<style lang="scss" scoped>

</style>
