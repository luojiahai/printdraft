<template>
  <div class="pd-sender">
    <div class="pd-sender-name">{{ name }}</div>
    <div v-if="address" class="pd-sender-detail">{{ address }}</div>
    <div v-if="email" class="pd-sender-detail">{{ email }}</div>
    <div v-if="date" class="pd-date">{{ date }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  address?: string
  email?: string
  date?: string
}>()
</script>
