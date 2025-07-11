<script setup lang="ts">
import { useTranslation } from "i18next-vue";
import { PropType, ComputedRef, computed } from "vue";
import { TranslatedValuesType } from "../types/types";
const props = defineProps({
  //common
  id: {
    type: String,
    default: `input-${crypto.randomUUID()}`,
  },
  translationKey: { type: String, required: true },
  type: {
    type: String as PropType<"input" | "toggle-button" | "radio-group">,
    default: "input",
  },
  modelValue: { type: String, default: "" },
  toggleModelValue: { type: Boolean, default: false },
  errors: { type: Array, default: () => [] },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  //input
  inputMode: { type: String, default: "text" },
  //radio-group
  radioGroupValues: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => [],
  },
});
const emit = defineEmits([
  "blur",
  "update:modelValue",
  "input",
  "focus",
  "click",
]);
const { t } = useTranslation();

const translatedValues: ComputedRef<TranslatedValuesType> = computed(() => ({
  placeholder: t(`${props.translationKey}.${props.id}.placeholder`) || "",
  label: t(`${props.translationKey}.${props.id}.label`) || "",
  learnMoreUrl: t(`${props.translationKey}.${props.id}.learn_more_url`) || "",
  infoText: t(`${props.translationKey}.${props.id}.info_text`) || "",
  labelTooltip: t(`${props.translationKey}.${props.id}.label_tooltip`) || "",
}));
</script>

<template>
  <div v-if="type === 'input'">
    <m-m-input
      :model-value="modelValue"
      :label="translatedValues.label"
      :label-tool-tip-text="translatedValues.labelTooltip"
      :required="required"
      :disabled="disabled"
      :placeholder="translatedValues.placeholder"
      data-cy="input-application-name"
      :errors="errors"
      :inputmode="inputMode"
      @blur="emit('blur')"
      @update:model-value="emit('update:modelValue', $event)"
      @input="emit('input', $event)"
      @focus="emit('focus')"
      @click="emit('click')"
    />
    <div v-if="$slots['helper-link']">
      <slot name="helper-link" />
    </div>
    <div
      v-if="translationKey && translatedValues.infoText"
      class="mm-flex mm-flex-align-center mm-flex-gap-2 mm-mt-2"
    >
      <div class="mm-page-options-hint">
        <span
          v-sanitize-html="t(`${translationKey}.${id}.info_text`)"
          class="mm-mr-2"
        />
        <m-m-link
          v-if="translatedValues.learnMoreUrl"
          :href="translatedValues.learnMoreUrl"
          >Learn more</m-m-link
        >
      </div>
    </div>
  </div>
  <div v-if="type === 'radio-group'">
    <div class="mm-flex mm-flex-column mm-flex-gap-6 mm-mt-3">
      <div>
        <m-m-field-label
          :label="translatedValues.label"
          :tooltip-text="translatedValues.labelTooltip"
          required
        />
        <div class="mm-flex mm-flex-row mm-flex-column-gap-16 mm-flex-wrap">
          <m-m-radiobutton
            v-for="(radio, index) in radioGroupValues"
            :key="index"
            :model-value="modelValue"
            variant="outlined"
            :value="radio.value"
            :show-error-message="index == radioGroupValues.length - 1"
            :errors="errors"
            @update:model-value="emit('update:modelValue', radio.value)"
          >
            <span
              v-sanitize-html="$t(`${translationKey}.${id}.${radio.name}`)"
              class="label"
            ></span>
          </m-m-radiobutton>
        </div>
        <div
          v-if="translatedValues.infoText"
          class="mm-flex mm-flex-align-center mm-flex-gap-2 mm-mt-2"
        >
          <div class="mm-page-options-hint">
            <span v-sanitize-html="translatedValues.infoText" class="mm-mr-2" />
            <m-m-link
              v-if="translatedValues.learnMoreUrl"
              :href="translatedValues.learnMoreUrl"
              >Learn more</m-m-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="type === 'toggle-button'">
    <m-m-field-label
      :label="translatedValues.label"
      :tooltip-text="translatedValues.labelTooltip"
    />
    <m-m-toggle-button
      :model-value="toggleModelValue"
      @update:model-value="(val: boolean) => emit('update:modelValue', val)"
    />
    <div
      v-if="translatedValues.infoText"
      class="mm-flex mm-flex-align-center mm-flex-gap-2 mm-mt-2"
    >
      <div class="mm-page-options-hint">
        <span v-sanitize-html="translatedValues.infoText" class="mm-mr-2" />
        <m-m-link
          v-if="translatedValues.learnMoreUrl"
          :href="translatedValues.learnMoreUrl"
          >Learn more</m-m-link
        >
      </div>
    </div>
  </div>
</template>
