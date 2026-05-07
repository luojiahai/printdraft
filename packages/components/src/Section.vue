<template>
  <div class="pd-section">
    <div class="pd-section-title">{{ title }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
