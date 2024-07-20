<script lang="ts" setup>
import { NButton, NCode, type TreeOption } from 'naive-ui'
import { deepdump, net, value2json } from '@/utils/model'

const states = ['lua', ...Object.keys(net)]
const luaStore = useLuaStore()
luaStore.state = 'lua'

function renderLabel({ option }: { option: TreeOption }) {
  if (option.type === 'json') {
    return h(NCode, { code: option.label, language: 'json' })
  }
  return `${option.label}`
}

function renderSwitcherIcon({ expanded }: { expanded: boolean }) {
  return h('i', { class: expanded ? 'i-fa6-solid-square-minus' : 'i-fa6-solid-square-plus' })
}

function getParentNode(node: TreeOption, data: TreeOption[]): TreeOption | null {
  for (const item of data) {
    if (item.children && item.children.includes(node)) {
      return item
    }
    else if (item.children) {
      const parent = getParentNode(node, item.children)
      if (parent)
        return parent
    }
  }
  return null
}

function getPathToRoot(node: TreeOption, data: TreeOption[]): string[] {
  const path: string[] = []
  let currentNode: TreeOption | null = node

  while (currentNode) {
    const parentNode = getParentNode(currentNode, data)
    if (parentNode) {
      path.unshift(parentNode.label as string)
      currentNode = parentNode
    }
    else {
      currentNode = null
    }
  }
  return path
}
function createData(): TreeOption[] {
  const option: TreeOption = {
    label: '_G',
    key: '_G',
    isLeaf: false,
    suffix: () =>
      h(
        NButton,
        { text: true, type: 'primary' },
        { default: () => 'table' },
      ),
  }
  return [
    option,
  ]
}
const pattern = ref('')
const treeData = ref<TreeOption[]>(createData())

function handleUpdateValue(value: string) {
  luaStore.resetReceived()
  pattern.value = ''
  treeData.value = createData()
}

function handleLoad(node: TreeOption) {
  return new Promise((resolve) => {
    if (!node || !node.label) {
      resolve(false)
      return
    }
    const type = luaStore.state === 'lua' ? 'loadstring' : 'dostring_in'
    const expandedKeys = getPathToRoot(node, treeData.value)

    // 根据 node.label 是否为数字或数字字符串调整 Lua 表达式
    const isNumeric = !Number.isNaN(Number(node.label))
    const tbl = expandedKeys.length
      ? isNumeric
        ? `${expandedKeys.join('.')}[${Number(node.label) + 1}]`
        : `${expandedKeys.join('.')}.${node.label}`
      : node.label

    if (isNumeric) {
      luaStore.codemirror.code = `return net.lua2json(${tbl})`
    }
    else {
      let endCode = ''
      switch (luaStore.state) {
        case 'lua':
        case 'gui':
          endCode = 'return net.lua2json(res)'
          break
        case 'server':
        case 'config':
          endCode = 'local JSON = require(\'JSON\')\nreturn JSON:encode(res)'
          break
        case 'export':
          endCode = 'local JSON = loadfile(\'Scripts/JSON.lua\')()\nreturn JSON:encode(res)'
          break
        case 'mission':
          endCode = `${value2json}\nreturn value2json(res)`
          break
      }

      luaStore.codemirror.code = `${deepdump}\nlocal res = deepdump(${tbl}, 1)\n${endCode}`
    }

    sendMessage(type).then((res) => {
      if (!res.data)
        return resolve(false)
      try {
        if (!isNumeric) {
          try {
            const json = JSON.parse(res.data)
            node.children = Object.keys(json).map(key => ({
              label: key,
              key: `${tbl}.${key}`,
              isLeaf: json[key] !== 'table',
              suffix: () =>
                h(
                  NButton,
                  { text: true, type: 'primary' },
                  { default: () => json[key] },
                ),
            }))
          }
          catch (error) {
            resolve(false)
          }
        }
        else {
          node.children = [{
            label: res.data,
            key: `${tbl}`,
            type: 'json',
            isLeaf: true,
          }]
        }
        resolve(true)
      }
      catch (error) {
        console.error(error)
        resolve(false)
      }
    }).catch(() => {
      resolve(false)
    })
  })
}
</script>

<template>
  <div mx-auto my-16 text-center container>
    <p mb-8 mt-8 text-32 fw-900>
      <n-gradient-text type="info">
        {{ $t('debug.state') }}:
      </n-gradient-text>
      <n-gradient-text type="warning">
        {{ luaStore.state }}
      </n-gradient-text>
    </p>

    <n-radio-group v-model:value="luaStore.state" size="large" @update:value="handleUpdateValue">
      <n-radio-button v-for="(item, key) in states" :key="key" :value="item">
        {{ item }}
      </n-radio-button>
    </n-radio-group>
  </div>
  <n-space vertical :size="12">
    <n-input v-model:value="pattern" :placeholder="$t('placeholder.search')" />
    <n-tree
      style="max-height: 600px"

      expand-on-click virtual-scroll block-line
      :show-irrelevant-nodes="false"
      :pattern="pattern"
      :data="treeData"
      :on-load="handleLoad"
      :render-label="renderLabel"
      :render-switcher-icon="renderSwitcherIcon"
    />
  </n-space>
</template>

<style scoped lang="scss">
// TODO
</style>
