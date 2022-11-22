<script setup lang="ts">
import type { EditorView } from '@codemirror/view'
import { useCodeMirror } from '../../composables/codemirror'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])
const codemirror = ref()
const input = useVModel(props, 'modelValue', emit)
let cm: EditorView

onMounted(async () => {
  cm = useCodeMirror(codemirror, input)
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

