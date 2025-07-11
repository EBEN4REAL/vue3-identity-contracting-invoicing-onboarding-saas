<script setup lang="ts">
import { computed } from "vue";
import { TypeButtonVariant } from "~/mm_ui_kit/src/types/button.types";

const variants = computed(() => [
  "elevated",
  "outlined",
  "outlined-light",
  "text",
  "text-danger",
  "tertiary",
  "danger",
]);

const sizes = computed(() => ["small", "medium"]);

const getIcon = (variant: TypeButtonVariant) => {
  if (variant === "elevated") return "plus-white";
  if (variant === "danger" || variant === "text-danger") return "trash";
  return "plus";
};
</script>

<template>
  <div>
    <div v-for="variant in variants" :key="variant" class="mm-mb-16">
      <h3 class="title">{{ variant }}</h3>
      <div v-for="size in sizes" :key="size" class="mm-mb-8">
        <h4 class="title">{{ size }}</h4>
        <div class="mm-flex mm-flex-gap-8">
          <m-m-button :variant="variant" :size="size">Default</m-m-button>
          <m-m-button :variant="variant" :size="size" is-disabled>
            Disabled
          </m-m-button>
          <m-m-button
            :variant="variant"
            :size="size"
            :prepend-icon="getIcon(variant)"
          >
            Prepend Icon
          </m-m-button>
          <m-m-button
            :variant="variant"
            :size="size"
            :append-icon="getIcon(variant)"
          >
            Append Icon
          </m-m-button>
          <m-m-button
            :variant="variant"
            :size="size"
            :prepend-icon="getIcon(variant)"
            is-disabled
          >
            Disabled Icon
          </m-m-button>
          <m-m-button :variant="variant" :size="size" loading>
            Loading
          </m-m-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-bottom: 8px;
  text-transform: capitalize;
}
</style>
