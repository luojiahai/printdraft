<template>
  <div class="cover-letter" :style="cssVars">
    <!-- Sender -->
    <div class="sender">
      <div class="sender-name">{{ data.sender.name }}</div>
      <div class="sender-detail">{{ data.sender.address }}</div>
      <div class="sender-detail">{{ data.sender.email }}</div>
    </div>

    <!-- Date -->
    <div class="date">{{ data.sender.date }}</div>

    <!-- Recipient -->
    <div class="recipient">
      <div class="recipient-name">{{ data.recipient.name }}</div>
      <div>{{ data.recipient.company }}</div>
      <div>{{ data.recipient.address }}</div>
    </div>

    <!-- Subject -->
    <div class="subject">Re: {{ data.subject }}</div>

    <!-- Body -->
    <div v-for="(para, i) in data.body" :key="i" class="body-paragraph">
      {{ para }}
    </div>

    <!-- Closing -->
    <div class="closing-block">
      <div class="closing-text">{{ data.closing }},</div>
      <div class="signature">{{ data.sender.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CoverLetterData } from '../schemas.js'
import './style.css'

const props = defineProps<{ data: CoverLetterData }>()

const cssVars = computed(() => ({
  '--printdraft-fontFamily': props.data.style?.fontFamily
    ? `'${props.data.style.fontFamily}', Georgia, serif`
    : undefined,
  '--printdraft-fontSize': props.data.style?.fontSize,
  '--printdraft-primaryColor': props.data.style?.primaryColor,
}))
</script>
