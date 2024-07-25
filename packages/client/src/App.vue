<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import lua from 'highlight.js/lib/languages/lua'
import json from 'highlight.js/lib/languages/json'
import themeOverrides from '@/theme/global'

hljs.registerLanguage('lua', lua)
hljs.registerLanguage('json', json)
const appStore = useAppStore()
const env = useEnv()
console.log('🚀 ~ env:', env)
</script>

<template>
  <n-config-provider
    :hljs="hljs"
    :theme="appStore.getTheme" :locale="appStore.getLocale" :date-locale="appStore.getDateLocale"
    abstract
    inline-theme-disabled
    :theme-overrides="themeOverrides"
  >
    <n-notification-provider :max="appStore.provider.notification.max">
      <n-message-provider>
        <n-theme-editor>
          <RouterView />
        </n-theme-editor>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>
