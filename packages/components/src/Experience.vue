<template>
  <div class="pd-entry">
    <div class="pd-heading1-row">
      <span>{{ org }}</span>
      <span>{{ location }}</span>
    </div>
    <div class="pd-subheading1-row">
      <span>{{ title }}</span>
      <span>{{ date }}</span>
    </div>
    <ul v-if="$slots.default" class="pd-bullets">
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  org: string
  title?: string
  date: string
  location?: string
}>()
</script>
