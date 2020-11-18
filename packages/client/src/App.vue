<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import lua from 'highlight.js/lib/languages/lua'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('lua', lua)
hljs.registerLanguage('json', json)

const menuStore = useMenuStore()
const current = computed(() => {
  return {
    locale: menuStore.locale === 'zh-CN' ? zhCN : enUS,
    dateLocale: menuStore.locale === 'zh-CN' ? dateZhCN : dateEnUS,
    theme: menuStore.theme === 'dark' ? darkTheme : lightTheme,
  }
})
hljs.registerLanguage('lua', lua)
hljs.registerLanguage('json', json)
</script>

<template>
  <n-config-provider
    :hljs="hljs"
    :theme="current.theme" :locale="current.locale" :date-locale="current.dateLocale"
    abstract
    inline-theme-disabled
  >
    <n-message-provider>
      <n-theme-editor>
        <RouterView />
      </n-theme-editor>
    </n-message-provider>
  </n-config-provider>
</template>
