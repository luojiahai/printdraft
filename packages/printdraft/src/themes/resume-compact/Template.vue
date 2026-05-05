<template>
  <div :class="['resume-compact', { 'lang-cn': data.lang === 'cn' }]" :style="cssVars">
    <!-- Header -->
    <div class="header-name">{{ data.name }}</div>
    <div class="header-contact">
      <span v-if="data.contact.phone">{{ data.contact.phone }}</span>
      <span v-if="data.contact.phone && (data.contact.email || data.contact.linkedin)"> | </span>
      <span v-if="data.contact.email">{{ data.contact.email }}</span>
      <span v-if="data.contact.email && data.contact.linkedin"> | </span>
      <span v-if="data.contact.linkedin">linkedin.com/in/{{ data.contact.linkedin }}</span>
    </div>

    <!-- Sections -->
    <div v-for="section in data.sections" :key="section.title" class="section">
      <div class="section-title">{{ section.title }}</div>
      <div v-for="(entry, i) in section.entries" :key="i" class="entry">

        <template v-if="entry.type === 'heading1+subheading1'">
          <div class="heading1-row">
            <span>{{ entry.institution || entry.organization }}</span>
            <span>{{ entry.date }}</span>
          </div>
          <div class="subheading1-row">
            <span>{{ entry.degree || entry.title }}</span>
            <span>{{ entry.location }}</span>
          </div>
          <ul v-if="entry.bullets?.length" class="bullets">
            <li v-for="(b, j) in entry.bullets" :key="j">{{ b }}</li>
          </ul>
        </template>

        <template v-else-if="entry.type === 'heading1+subheading2'">
          <div class="heading1-row">
            <span>{{ entry.institution || entry.organization }}</span>
            <span>{{ entry.date }}</span>
          </div>
          <div class="subheading2-row">
            <span>{{ entry.role }}</span>
            <span>{{ entry.location }}</span>
          </div>
        </template>

        <template v-else-if="entry.type === 'heading2'">
          <div class="heading2-row">
            <span>{{ entry.award }}</span>
            <span>{{ entry.date }}</span>
          </div>
          <ul v-if="entry.description" class="bullets">
            <li>{{ entry.description }}</li>
          </ul>
        </template>

        <template v-else-if="entry.type === 'heading3'">
          <div class="heading3-row">
            <span>{{ entry.award }}</span>
            <span>{{ entry.date }}</span>
          </div>
        </template>

        <template v-else-if="entry.type === 'skills'">
          <div v-for="cat in entry.categories" :key="cat.name" class="heading4-row">
            <span class="heading4-category">{{ cat.name }}:</span>
            <span>{{ cat.content }}</span>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeData } from '../schemas.js'
import './style.css'

const props = defineProps<{ data: ResumeData }>()

const cssVars = computed(() => ({
  '--printdraft-fontFamily': props.data.style?.fontFamily,
  '--printdraft-fontSize': props.data.style?.fontSize,
  '--printdraft-lineHeight': props.data.style?.lineHeight,
}))
</script>
