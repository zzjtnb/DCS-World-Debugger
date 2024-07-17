<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import lua from 'highlight.js/lib/languages/lua'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('lua', lua)
hljs.registerLanguage('json', json)

const appStore = useAppStore()

hljs.registerLanguage('lua', lua)
hljs.registerLanguage('json', json)
</script>

<template>
  <n-config-provider
    :hljs="hljs"
    :theme="appStore.getTheme" :locale="appStore.getLocale" :date-locale="appStore.getDateLocale"
    abstract
    inline-theme-disabled
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
