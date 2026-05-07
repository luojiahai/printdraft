<template>
  <div class="preview-outer">
    <div class="preview-paper">
      <DocComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocComponent from 'virtual:user-document'
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; }

.preview-outer {
  min-height: 100%;
  background: #2a2a2a;
  display: flex;
  justify-content: center;
  padding: 24px;
}

.preview-paper {
  flex-shrink: 0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  align-self: flex-start;
}

@media print {
  .preview-outer {
    background: white;
    padding: 0;
    min-height: auto;
  }
  .preview-paper {
    box-shadow: none;
  }
}
</style>
