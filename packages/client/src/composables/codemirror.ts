// https://discuss.codemirror.net/c/v6/7
// https://codesandbox.io/search?query=codemirror%20vue&page=1&configure%5BhitsPerPage%5D=12

import type { Ref, WritableComputedRef } from 'vue'
import { StreamLanguage, syntaxHighlighting } from '@codemirror/language'
import { lua } from '@codemirror/legacy-modes/mode/lua'
import { EditorView, keymap } from '@codemirror/view'
import type { ViewUpdate } from '@codemirror/view'
import { Compartment, EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import {
  defaultKeymap,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import { oneDark, oneDarkHighlightStyle } from './theme'

const tabSize = new Compartment()

export function useCodeMirror(el: Ref<HTMLElement>, input: Ref<string> | WritableComputedRef<string>) {
  const state = EditorState.create({
  // doc为编辑器内容
    doc: input.value,
    extensions: [
      // basicSetup 是一套插件集合，包含了很多常用插件
      basicSetup,
      oneDark,
      syntaxHighlighting(oneDarkHighlightStyle),
      // 这里只使用 lua 解析器
      StreamLanguage.define(lua),
      tabSize.of(EditorState.tabSize.of(2)),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      // 新版本一切皆插件，所以实时侦听数据变化也要通过写插件实现
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          // Document changed
          input.value = v.state.doc.toString()
        }
      }),
    ],
  })
  const view = new EditorView({
    parent: el.value,
    state,
  })
  return view
}
