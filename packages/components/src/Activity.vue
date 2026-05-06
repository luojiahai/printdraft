<template>
  <div class="pd-entry">
    <div class="pd-heading1-row">
      <span>{{ org }}</span>
      <span>{{ location }}</span>
    </div>
    <div class="pd-subheading2-row">
      <span>{{ role }}</span>
      <span>{{ date }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  org: string
  role?: string
  date: string
  location?: string
}>()
</script>
