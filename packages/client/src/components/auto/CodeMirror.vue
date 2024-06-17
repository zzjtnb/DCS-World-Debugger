<script setup lang="ts">
import { basicSetup } from 'codemirror'
import { Codemirror } from 'vue-codemirror'
import type { EditorView } from '@codemirror/view'
import { StreamLanguage, bracketMatching, codeFolding, foldGutter, syntaxHighlighting } from '@codemirror/language'
import { linter } from '@codemirror/lint'

import { lua } from '@codemirror/legacy-modes/mode/lua'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark'

const luaStore = useLuaStore()

function handleReady({ view }: { view: EditorView }) {
  if (view.contentDOM.style) {
    view.contentDOM.style.fontFamily = 'font-mono'
    view.contentDOM.style.fontSize = '16px'
    view.contentDOM.style.lineHeight = '1.6'
  }
  luaStore.codemirror.view = view
}
const extensions = computed(() => {
  const result = [
    basicSetup,
    codeFolding(),
    foldGutter(),
    bracketMatching(),
    StreamLanguage.define(lua),
  ]
  if (luaStore.codemirror.language === 'json') {
    result.push(json(), linter(jsonParseLinter()))
  }
  if (luaStore.codemirror.theme === 'oneDark') {
    result.push(oneDark, syntaxHighlighting(oneDarkHighlightStyle))
  }

  return result
})
const languages = ref([{ label: 'lua', value: 'lua' }, { label: 'json', value: 'json' }])
const themes = ref([{ label: 'default', value: 'default' }, { label: 'oneDark', value: 'oneDark' }])
const tabSize = ref([{ label: '2', value: 2 }, { label: '4', value: 4 }, { label: '8', value: 8 }, { label: '16', value: 16 }])
const height = ([{ label: 'auto', value: 'auto' }, { label: '200px', value: '200px' }, { label: '40em', value: '40em' }, { label: '60vh', value: '60vh' }])
</script>

<template>
  <div class="codemirror">
    <ul class="toolbar">
      <li>
        <p class="title">
          {{ $t('toolbar.language') }}
        </p>
        <n-select v-model:value="luaStore.codemirror.language" :options="languages" size="small" />
      </li>
      <li>
        <p class="title">
          {{ $t('toolbar.theme') }}
        </p>
        <n-select v-model:value="luaStore.codemirror.theme" :options="themes" size="small" />
      </li>
      <li>
        <p class="title">
          {{ $t('toolbar.disabled') }}
        </p>
        <n-switch v-model:value="luaStore.codemirror.disabled" />
      </li>
      <li>
        <p class="title">
          {{ $t('toolbar.autofocus') }}
        </p>
        <n-switch v-model:value="luaStore.codemirror.autofocus" />
      </li>
      <li>
        <p class="title">
          {{ $t('toolbar.indentWithTab') }}
        </p>
        <n-switch v-model:value="luaStore.codemirror.indentWithTab" />
      </li>
      <li class="tab-size">
        <p class="title">
          {{ $t('toolbar.tabSize') }}
        </p>
        <n-select v-model:value="luaStore.codemirror.tabSize" :options="tabSize" size="small" />
      </li>
      <li class="height">
        <p class="title">
          {{ $t('toolbar.height') }}
        </p>
        <n-select v-model:value="luaStore.codemirror.style.height" :options="height" size="small" />
      </li>
    </ul>
    <n-scrollbar :style="luaStore.codemirror.style">
      <Codemirror
        v-model="luaStore.codemirror.code"
        :placeholder="$t('placeholder.code')"
        :disabled="luaStore.codemirror.disabled"
        :autofocus="luaStore.codemirror.autofocus"
        :indent-with-tab="luaStore.codemirror.indentWithTab"
        :tab-size="luaStore.codemirror.tabSize"
        :extensions="extensions"
        @ready="handleReady"
      />
    </n-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
  list-style: none;

  li {
    display: flex;
    min-width: 160px;
    align-items: center;
    margin: 0 8px;

    .title {
      min-width: fit-content;
      font-size: 16px;

      &::after {
        width: 4px;
        content: ':';
      }
    }
  }
}
</style>
