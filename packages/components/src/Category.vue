<template>
  <div class="pd-skills-row">
    <span class="pd-skills-category">{{ name }}:</span>
    <span><slot /></span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>
