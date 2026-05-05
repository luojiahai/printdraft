<template>
  <div class="preview-outer">
    <div class="preview-scroll">
      <div v-if="error" class="preview-error">
        <pre>{{ error }}</pre>
      </div>
      <div v-else-if="parsedDoc" class="preview-paper">
        <component :is="themeComponent" :data="parsedDoc.data" />
      </div>
      <div v-else class="preview-empty">No document loaded.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import type { Component } from 'vue'
import type { ParsedDocument } from '@printdraft/parser'
import ResumeClassic from '@printdraft/themes/resume-classic/Template.vue'
import ResumeModern from '@printdraft/themes/resume-modern/Template.vue'
import ResumeCompact from '@printdraft/themes/resume-compact/Template.vue'
import CoverLetter from '@printdraft/themes/cover-letter/Template.vue'

const props = defineProps<{
  parsedDoc: ParsedDocument | null
  error: string | null
}>()

const themeComponent = shallowRef<Component | null>(null)

const themeMap: Record<string, Component> = {
  'resume-classic': ResumeClassic,
  'resume-modern': ResumeModern,
  'resume-compact': ResumeCompact,
  'cover-letter': CoverLetter,
}

watch(
  () => props.parsedDoc?.theme.key,
  (key) => {
    themeComponent.value = (key && themeMap[key]) ? themeMap[key] : null
  },
  { immediate: true }
)
</script>

<style scoped>
.preview-outer {
  height: 100%;
  background: #2a2a2a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-scroll {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
}

.preview-paper {
  background: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  width: 8.5in;
  flex-shrink: 0;
}

.preview-error {
  background: #2d1a1a;
  border: 1px solid #c0392b;
  color: #e74c3c;
  padding: 16px;
  border-radius: 4px;
  width: 100%;
  max-width: 8.5in;
}

.preview-error pre {
  white-space: pre-wrap;
  font-size: 13px;
  font-family: 'Fira Code', monospace;
}

.preview-empty {
  color: #666;
  font-size: 14px;
  padding-top: 40px;
}
</style>
