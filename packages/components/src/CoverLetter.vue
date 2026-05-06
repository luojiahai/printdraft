<template>
  <div
    class="pd-document cover-letter"
    :style="{
      '--pd-fontFamily': fontFamily,
      '--pd-fontSize': fontSize,
      '--pd-primaryColor': primaryColor,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import './themes/cover-letter.css'

defineProps<{
  fontFamily?: string
  fontSize?: string
  primaryColor?: string
}>()
</script>
