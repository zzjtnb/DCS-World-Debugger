<script lang="ts" setup>
import type { TreeOption } from 'naive-ui'
import { _G } from '@/utils/model'

const luaStore = useLuaStore()
luaStore.codemirror.code = _G
luaStore.codemirror.style.height = '200px'

function createData() {
  return [
    {
      label: '_G',
      key: 1,
      isLeaf: false,
    },
  ]
}

const data = ref(createData())

function handleLoad(node: TreeOption) {
  return new Promise<void>((resolve) => {
    if (!node.label)
      return
    console.log(node)
    // luaStore.code = _G(node.label)
    luaStore.codemirror.code += `
  local res = deepdump(${node.label}, 1)
  return net.lua2json(res)
  `
  })
}
</script>

<template>
  <n-tree
    show-line
    block-line
    expand-on-click
    :data="data"
    :on-load="handleLoad"
  />
</template>

<style scoped lang="scss">
// TODO
</style>
