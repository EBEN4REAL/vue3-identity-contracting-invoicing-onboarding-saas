<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: false,
    default: "",
  },
});
</script>

<template>
  <div class="mm-step-wrapper">
    <div class="mm-step-wrapper-title">
      {{ title }}
    </div>
    <slot name="subtitle" />
    <div class="mm-mt-5">
      <slot name="component" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mm-step-wrapper {
  border: 1px solid #e5e7eb;
  padding: 1rem;
  border-radius: 5px;
  position: relative;
  margin: 1rem 0;
  border-radius: 16px;

  &-title {
    position: absolute;
    top: -10px;
    left: 10px;
    background-color: white;
    padding: 0 5px;
    font-weight: bold;
    font-size: 1rem;
  }
}
</style>
