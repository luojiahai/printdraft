<template>
  <div class="pd-entry">
    <div class="pd-heading1-row">
      <span>{{ institution }}</span>
      <span>{{ location }}</span>
    </div>
    <div class="pd-subheading1-row">
      <span>{{ degree }}</span>
      <span>{{ date }}</span>
    </div>
    <ul v-if="$slots.default" class="pd-bullets">
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  institution: string
  degree?: string
  date: string
  location?: string
}>()
</script>
