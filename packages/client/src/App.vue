<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import lua from 'highlight.js/lib/languages/lua'
import json from 'highlight.js/lib/languages/json'
hljs.registerLanguage('lua', lua)
hljs.registerLanguage('json', json)
</script>

<template>
  <n-config-provider :theme="darkTheme" :hljs="hljs" size="large">
    <n-theme-editor>
      <RouterView />
    </n-theme-editor>
  </n-config-provider>
</template>

<style scoped lang="scss">

</style>
