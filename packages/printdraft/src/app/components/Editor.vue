<template>
  <div ref="editorEl" class="editor-wrap" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { yaml } from '@codemirror/lang-yaml'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const editorEl = ref<HTMLElement>()
let view: EditorView | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let ignoreNext = false

onMounted(() => {
  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      history(),
      lineNumbers(),
      yaml(),
      oneDark,
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return
        if (ignoreNext) { ignoreNext = false; return }
        const value = update.state.doc.toString()
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => emit('update:modelValue', value), 300)
      }),
      EditorView.theme({
        '&': { height: '100%', fontSize: '13px' },
        '.cm-scroller': { overflow: 'auto', fontFamily: "'Fira Code', 'Consolas', monospace" },
      }),
    ],
  })

  view = new EditorView({ state, parent: editorEl.value! })
})

watch(() => props.modelValue, (newVal) => {
  if (!view) return
  const current = view.state.doc.toString()
  if (current === newVal) return
  ignoreNext = true
  view.dispatch({
    changes: { from: 0, to: current.length, insert: newVal },
  })
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  view?.destroy()
})
</script>

<style scoped>
.editor-wrap {
  height: 100%;
  overflow: hidden;
}
</style>
