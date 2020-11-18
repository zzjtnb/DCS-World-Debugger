<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import type { EditorView } from '@codemirror/view'
import { lua } from '@codemirror/legacy-modes/mode/lua'
import { StreamLanguage, bracketMatching, codeFolding, foldGutter, syntaxHighlighting } from '@codemirror/language'
import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark'

const menuStore = useMenuStore()
const luaStore = useLuaStore()

function handleReady({ view }: { view: EditorView }) {
  if (view.contentDOM.style) {
    view.contentDOM.style.fontFamily = 'font-mono'
    view.contentDOM.style.fontSize = '16px'
    view.contentDOM.style.lineHeight = '1.6'
  }

  luaStore.view = view
}
const extensions = computed(() => {
  const result = [
    codeFolding(),
    foldGutter(),
    bracketMatching(),
    StreamLanguage.define(lua),
  ]

  if (menuStore.theme === 'dark') {
    result.push(oneDark, syntaxHighlighting(oneDarkHighlightStyle))
  }
  return result
})
</script>

<template>
  <Codemirror
    v-model="luaStore.code"
    :style="{ fontSize: '16px', fontFamily: 'font-mono' }"
    placeholder="Code goes here..."
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
  />
</template>
