<script setup lang="ts">
import type { EditorView } from '@codemirror/view'
import { useCodeMirror } from '../../composables/codemirror'

// const props = defineProps<{
//   modelValue: string
//   type: string
// }>()
// https://cn.vuejs.org/api/sfc-script-setup.html#typescript-only-features
const props = withDefaults(defineProps<{
  modelValue: string
  type?: string
}>(), {
  modelValue: '',
  type: 'lua',
})
const emit = defineEmits(['update:modelValue'])
const input = useVModel(props, 'modelValue', emit)

let cm: EditorView
const codemirror = ref()
onMounted(async () => {
  cm = useCodeMirror(codemirror, input, props.type)
})
function upState(value) {
  cm.dispatch({
    changes: { from: 0, to: cm.state.doc.length, insert: value },
  })
}
// watch(() => [props.modelValue], (value) => {
//   cm.dispatch({
//     changes: { from: 0, to: cm.state.doc.length, insert: props.modelValue },
//   })
// })
defineExpose({
  upState,
})
</script>

<template>
  <div ref="codemirror" />
</template>

