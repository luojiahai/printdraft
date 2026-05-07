<template>
  <div
    :class="['pd-document', theme ?? 'resume-classic']"
    :style="{
      '--pd-fontFamily': fontFamily,
      '--pd-fontSize': fontSize,
      '--pd-primaryColor': primaryColor,
      '--pd-accentColor': accentColor,
      '--pd-lineHeight': lineHeight,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import './themes/resume-classic.css'
import './themes/resume-modern.css'
import './themes/resume-compact.css'

defineProps<{
  theme?: string
  fontFamily?: string
  fontSize?: string
  primaryColor?: string
  accentColor?: string
  lineHeight?: string
}>()
</script>
