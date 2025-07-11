<script setup lang="ts">
import { VuxTemplateComponentProps } from "~/mm_ui_kit/src/vux/types/vuxTemplateComponent";
import { VuxModel } from "~/mm_ui_kit/src/vux/types/useVuxModelType";
import { useTranslationResolver } from "~/mm_ui_kit/src/vux/composables/useVuxTranslationResolver";
import { computed, ComputedRef } from "vue";

const { resolveTranslation } = useTranslationResolver();

const props = defineProps<VuxTemplateComponentProps>();

const model = defineModel<VuxModel>();

const generateMissingKeyStyles = (key: string): string =>
  `<span class="vux-output-property--missing-key">{{${key}}}</span>`;

const resolveOutputProperty: ComputedRef<string> = computed(() =>
  resolveTranslation(`${props.resourceKey}.html_template`).replace(
    /{{\s*(.*?)\s*}}/g,
    (_, key) => {
      if (model.value) return model.value[key] || generateMissingKeyStyles(key);
      return generateMissingKeyStyles(key);
    },
  ),
);
</script>

<template>
  <div v-sanitize-html="resolveOutputProperty" class="vux-output-property" />
</template>

<style lang="scss" scoped>
:deep(.vux-output-property--missing-key) {
  color: #f00;
  font-weight: 600;
}
</style>
