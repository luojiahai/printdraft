<template>
  <div class="pd-entry">
    <div class="pd-heading2-row">
      <span>{{ name }}</span>
      <span>{{ date }}</span>
    </div>
    <ul v-if="description" class="pd-bullets">
      <li>{{ description }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  date: string
  description?: string
}>()
</script>
