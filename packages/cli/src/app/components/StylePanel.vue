<template>
  <div class="style-panel">
    <div class="panel-header">
      <span>Style</span>
      <button class="close-btn" @click="emit('close')">✕</button>
    </div>

    <div class="panel-body">
      <!-- Theme switcher -->
      <div class="section-label">Theme</div>

      <div class="theme-group-label">Resume</div>
      <div class="theme-list">
        <button
          v-for="theme in resumeThemes"
          :key="theme.key"
          class="theme-btn"
          :class="{ active: theme.key === activeThemeKey }"
          @click="emit('themeChange', theme.key)"
        >
          <span class="theme-name">{{ theme.displayName }}</span>
          <span class="theme-tag">Resume</span>
        </button>
      </div>

      <div class="theme-group-label">Cover Letter</div>
      <div class="theme-list">
        <button
          v-for="theme in coverLetterThemes"
          :key="theme.key"
          class="theme-btn"
          :class="{ active: theme.key === activeThemeKey }"
          @click="emit('themeChange', theme.key)"
        >
          <span class="theme-name">{{ theme.displayName }}</span>
          <span class="theme-tag cover">Cover Letter</span>
        </button>
      </div>

      <!-- Style variables for active theme -->
      <template v-if="activeTheme">
        <div class="section-label" style="margin-top: 20px">Style Variables</div>
        <div
          v-for="variable in activeTheme.styleVariables"
          :key="variable.key"
          class="var-row"
        >
          <label class="var-label">{{ variable.label }}</label>
          <input
            v-if="variable.type === 'color'"
            type="color"
            class="color-input"
            :value="currentStyle[variable.key] ?? variable.default"
            @input="onStyleChange(variable.key, ($event.target as HTMLInputElement).value)"
          />
          <select
            v-else
            class="select-input"
            :value="currentStyle[variable.key] ?? variable.default"
            @change="onStyleChange(variable.key, ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in variable.options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themes } from '@printdraft/themes'
import type { Theme } from '@printdraft/types'

const props = defineProps<{
  activeThemeKey: string
  currentStyle: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'themeChange', key: string): void
  (e: 'styleChange', key: string, value: string): void
}>()

const allThemes = computed(() => Object.values(themes))
const resumeThemes = computed(() => allThemes.value.filter((t) => t.documentType === 'resume'))
const coverLetterThemes = computed(() =>
  allThemes.value.filter((t) => t.documentType === 'cover-letter')
)
const activeTheme = computed(() => themes[props.activeThemeKey] ?? null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function onStyleChange(key: string, value: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('styleChange', key, value), 150)
}
</script>

<style scoped>
.style-panel {
  width: 280px;
  height: 100%;
  background: #252525;
  border-left: 1px solid #3a3a3a;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #3a3a3a;
  font-size: 13px;
  font-weight: 600;
  color: #ccc;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 3px;
}
.close-btn:hover { background: #3a3a3a; color: #ccc; }

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #888;
  margin-bottom: 8px;
}

.theme-group-label {
  font-size: 11px;
  color: #666;
  margin: 8px 0 4px;
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
}

.theme-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2e2e2e;
  border: 1px solid #3a3a3a;
  color: #bbb;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: background 0.1s;
}
.theme-btn:hover { background: #363636; }
.theme-btn.active { border-color: #4a9eff; color: #fff; background: #1a3a5c; }

.theme-name { font-weight: 500; }

.theme-tag {
  font-size: 10px;
  background: #444;
  color: #aaa;
  padding: 1px 5px;
  border-radius: 3px;
}
.theme-tag.cover { background: #3a3020; color: #c8a84b; }

.var-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.var-label {
  font-size: 12px;
  color: #bbb;
}

.color-input {
  width: 36px;
  height: 24px;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
  background: none;
}

.select-input {
  background: #2e2e2e;
  border: 1px solid #444;
  color: #ccc;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 3px;
  cursor: pointer;
  min-width: 100px;
}
</style>
