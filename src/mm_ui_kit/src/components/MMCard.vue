<script setup lang="ts">
import { useSlots, computed, PropType } from "vue";

const slots = useSlots();

const props = defineProps({
  headerVariant: {
    type: String as PropType<"header" | "header-lighter">,
    default: "header",
  },
  borderRadius: {
    type: String,
    default: "16px",
  },
});

const isSlotHeader = computed(() => !!slots.header);

const mmCardClass = computed(() => [`mm-card-${props.headerVariant}`]);
</script>

<template>
  <div class="mm-card">
    <div v-if="isSlotHeader" :class="mmCardClass">
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.mm-card {
  border-radius: 16px;
  border: 1px solid #d0d5dd;
  background: #fff;
  border-radius: v-bind(borderRadius);

  &-header {
    display: flex;
    padding: 16px;
    border-radius: 16px 16px 0 0;
    border-bottom: 1px solid #d0d5dd;
    background: #fcfcfd;
  }

  &-header-lighter {
    @extend .mm-card-header;
    border-bottom: 1px solid #e5e7eb;
    background: #fcfcfd;
  }
}
</style>
