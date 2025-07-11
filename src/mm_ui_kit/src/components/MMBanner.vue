<script setup lang="ts">
defineProps({
  content: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div v-if="content || $slots.default" class="m-m-banner">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="content" v-html="content"></div>
    <slot v-else></slot>
  </div>
</template>
<style lang="scss">
.m-m-banner {
  width: 100%;
}
</style>
