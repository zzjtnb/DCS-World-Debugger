// https://discuss.codemirror.net/c/v6/7
// https://codesandbox.io/search?query=codemirro6&page=1&configure%5BhitsPerPage%5D=12

import type { Ref, WritableComputedRef } from 'vue'
import type { ViewUpdate } from '@codemirror/view'

import { Compartment, EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'

import { json, jsonParseLinter } from '@codemirror/lang-json'
import { lua } from '@codemirror/legacy-modes/mode/lua'
import { StreamLanguage, bracketMatching, codeFolding, foldGutter, syntaxHighlighting } from '@codemirror/language'
import { EditorView, keymap } from '@codemirror/view'

import { linter } from '@codemirror/lint'

import {
  defaultKeymap,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import { oneDark, oneDarkHighlightStyle } from './theme'

const tabSize = new Compartment()
const linterExtension = linter(jsonParseLinter())
function getExtensions(type) {
  let res: any = []
  switch (type) {
    case 'lua':
      // 这里只使用 lua 解析器
      res = [StreamLanguage.define(lua)]
      break
    case 'json':
      res = [json(), linterExtension]
      break
  }
  return res
}

export function useCodeMirror(el: Ref<HTMLElement>, input: Ref<string> | WritableComputedRef<string>, type: string) {
  const data = getExtensions(type)
  const state = EditorState.create({
  // doc为编辑器内容
    doc: input.value,
    extensions: [
      // basicSetup 是一套插件集合，包含了很多常用插件
      basicSetup,
      oneDark,
      syntaxHighlighting(oneDarkHighlightStyle),
      codeFolding(),
      foldGutter({
        markerDOM: (isOpen) => {
          const div = document.createElement('div')
          isOpen
            ? (div.className = 'cm-foldgutter-open')
            : (div.className = 'cm-foldgutter-closed')
          return div
        },
      }),
      bracketMatching(),
      tabSize.of(EditorState.tabSize.of(2)),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      ...data,
      // 新版本一切皆插件，所以实时侦听数据变化也要通过写插件实现
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          // Document changed
          input.value = v.state.doc.toString()
        }
      }),
      EditorView.domEventHandlers({
        scroll(event, view) {
          // console.log(event, view)
        },
      }),
    ],
  })
  const view = new EditorView({
    parent: el.value,
    state,
  })
  return view
}
