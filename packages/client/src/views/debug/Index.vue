<script lang="ts" setup>
const luaStore = useLuaStore()
luaStore.resetReceived()

const route = useRoute()
if (['loadstring', 'dostring_in'].includes(route.name as string)) {
  luaStore.show.received = true
  luaStore.show.codemirror = true
  luaStore.codemirror.disabled = false
}
else {
  luaStore.show.received = false
  luaStore.show.codemirror = false
}

const message = useMessage()
const { copy, isSupported } = useClipboard()

function handleCopy() {
  if (!isSupported)
    return message.error('您的浏览器不支持Clipboard API')
  if (!luaStore.getReceived)
    return message.error('没有可以复制的内容')
  copy(luaStore.getReceived)
  message.success('复制成功')
}

const runType = computed<lua.runType>(() => {
  let type: lua.runType = 'loadstring'
  if (['loadstring', 'dostring_in'].includes(route.name as lua.runType)) {
    type = route.name as lua.runType
  }
  return type
})
</script>

<template>
  <div class="debug">
    <RouterView />
    <template v-if="luaStore.show.codemirror">
      <n-spin :show="luaStore.loading">
        <div class="code" my-4>
          <CodeMirror />
        </div>
      </n-spin>
      <n-space v-show="luaStore.show.codemirror" justify="center" container mx-auto my-4>
        <n-button type="error" text-4 fw-900 :disabled="luaStore.loading" @click="luaStore.resetCode()">
          {{ $t('debug.clear') }}
        </n-button>
        <n-button type="primary" text-4 fw-900 :disabled="luaStore.loading" @click="sendMessage(runType)">
          {{ $t('debug.send') }}
        </n-button>
      </n-space>
    </template>

    <n-alert :title="$t('debug.status')" :type="luaStore.alertType" :bordered="false" my-4>
      <span v-if="luaStore.received.type === 'message'">{{ luaStore.received.data }}</span>
    </n-alert>

    <template v-if="luaStore.show.received">
      <n-space mx-auto my-4>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button icon-placement="right" type="error" quaternary @click="luaStore.resetReceived">
              <template #icon>
                <fa6-solid-broom />
              </template>
            </n-button>
          </template>
          {{ $t('debug.clear') }}
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button icon-placement="right" type="success" quaternary @click="handleCopy()">
              <template #icon>
                <fa6-solidcopy />
              </template>
            </n-button>
          </template>
          {{ $t('debug.copy') }}
        </n-tooltip>
      </n-space>
      <n-card mb-36>
        <n-code :code="luaStore.getReceived" language="json" word-wrap show-line-numbers />
      </n-card>
    </template>
  </div>
</template>
