<template>
  <div class="app-layout">
    <!-- Left: Editor -->
    <div class="pane pane-editor">
      <Editor v-model="docContent" @update:modelValue="onEditorChange" />
    </div>

    <!-- Right: Preview -->
    <div class="pane pane-preview">
      <Preview :parsedDoc="parsedDoc" :error="parseError" />
    </div>

    <!-- Style Panel (drawer) -->
    <transition name="slide">
      <StylePanel
        v-if="showStylePanel"
        :activeThemeKey="activeThemeKey"
        :currentStyle="currentStyle"
        @close="showStylePanel = false"
        @themeChange="onThemeChange"
        @styleChange="onStyleChange"
      />
    </transition>

    <!-- FAB to open style panel -->
    <button class="style-fab" @click="showStylePanel = !showStylePanel" title="Style">
      ✦
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import StylePanel from './components/StylePanel.vue'
import { parseDocument } from '../renderer/parser.js'
import type { ParsedDocument } from '../renderer/parser.js'
import jsYaml from 'js-yaml'

const docContent = ref('')
const parseError = ref<string | null>(null)
const showStylePanel = ref(false)

const parsedDoc = computed<ParsedDocument | null>(() => {
  if (!docContent.value) return null
  try {
    parseError.value = null
    return parseDocument(docContent.value)
  } catch (err) {
    parseError.value = String(err)
    return null
  }
})

const activeThemeKey = computed(() => parsedDoc.value?.theme.key ?? 'resume-classic')
const currentStyle = computed<Record<string, string>>(
  () => (parsedDoc.value?.data as any)?.style ?? {}
)

// Fetch initial document
async function loadDocument() {
  try {
    const res = await fetch('/api/document')
    if (!res.ok) throw new Error('Failed to load document')
    const { content } = await res.json() as { content: string }
    docContent.value = content
  } catch (err) {
    parseError.value = String(err)
  }
}

// Save on editor change (already debounced in Editor.vue)
async function onEditorChange(value: string) {
  docContent.value = value
  try {
    await fetch('/api/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: value }),
    })
  } catch { /* ignore save errors silently */ }
}

// Switch theme: update theme key in YAML
function onThemeChange(newKey: string) {
  try {
    const match = docContent.value.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return
    const raw = jsYaml.load(match[1]) as Record<string, unknown>
    raw.theme = newKey
    const newYaml = '---\n' + jsYaml.dump(raw) + '---'
    onEditorChange(newYaml)
  } catch { /* ignore */ }
}

// Update a style variable in YAML
function onStyleChange(key: string, value: string) {
  try {
    const match = docContent.value.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return
    const raw = jsYaml.load(match[1]) as Record<string, unknown>
    raw.style = { ...(raw.style as object ?? {}), [key]: value }
    const newYaml = '---\n' + jsYaml.dump(raw) + '---'
    onEditorChange(newYaml)
  } catch { /* ignore */ }
}

// WebSocket for live reload when file changes externally
let ws: WebSocket | null = null
function connectWs() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
  ws = new WebSocket(`${proto}//${location.host}/ws`)
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data) as { type: string }
      if (msg.type === 'reload') loadDocument()
    } catch { /* ignore */ }
  }
  ws.onclose = () => setTimeout(connectWs, 2000)
}

onMounted(() => { loadDocument(); connectWs() })
onUnmounted(() => ws?.close())
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.pane {
  flex: 1;
  height: 100%;
  overflow: hidden;
  min-width: 0;
}

.pane-editor {
  border-right: 1px solid #3a3a3a;
}

.style-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #4a9eff;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  z-index: 100;
  transition: background 0.15s;
}
.style-fab:hover { background: #3a8eef; }

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
