<script setup lang="ts">
import { computed, ComputedRef } from "vue";

const props = defineProps({
  cy: {
    type: String,
    default: "pricing-card",
  },
  buttonText: {
    type: String,
    default: "",
  },
  buttonColor: {
    type: Object,
    default: () => ({}),
  },
  productName: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    default: "0",
  },
  pricingType: {
    type: String,
    default: "",
  },
  billingPeriod: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["buttonClick"]);
const backgroundColor: ComputedRef<string> = computed(
  () => `#${props.buttonColor?.backgroundColor}`,
);
const color: ComputedRef<string> = computed(() => props.buttonColor?.textColor);

const buttonStyles: ComputedRef<Record<string, string>> = computed(() => ({
  backgroundColor: `#${props.buttonColor.backgroundColor}`,
  border: `#${props.buttonColor.backgroundColor}`,
  color: props.buttonColor.textColor,
}));
const isFreeBillingType: ComputedRef<boolean> = computed(
  () => !props.pricingType || props.pricingType === "FREE",
);
</script>

<template>
  <div class="mm-pricing-card" :cy="cy">
    <h2
      data-cy="product-name"
      class="mm-pricing-card-title mm-page-title--h3 font-weight-700 mm-mb-4"
    >
      {{ productName }}
    </h2>
    <p v-if="isFreeBillingType">
      <span class="mm-pricing-card-price font-weight-500">Free</span>
    </p>
    <p v-else>
      <span class="mm-pricing-card-price font-weight-500">{{ price }}</span>
      <span data-cy="pricing-type" class="mm-page-item-value">
        /{{ pricingType }}{{ billingPeriod }}
      </span>
    </p>
    <div class="mm-pricing-card-message mm-mt-6" data-cy="pricing-card-message">
      <slot name="princing-card-message" />
    </div>
    <m-m-button
      :is-disabled="disabled"
      :loading="loading"
      is-full-width
      class="mm-my-10 pricing-card-button"
      :style="buttonStyles"
      data-cy="pricing-card-button"
      @click="emit('buttonClick')"
    >
      {{ buttonText }}
    </m-m-button>
    <div
      v-if="$slots['included-products']"
      data-cy="pricing-card-included-products"
    >
      <slot name="included-products" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-pricing-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #f4f5f7;
  padding: 24px 16px;
  width: 260px;
  min-width: 260px;
  min-height: 390px;

  &-title {
    text-transform: capitalize;
  }

  &-price {
    font-size: 36px;
    line-height: 44px;
    color: #384250;
    margin-right: 5px;
  }

  &-message {
    font-size: 14px;
    line-height: 20px;
    color: #6d7480;
    max-height: 120px;
    min-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  &-button {
    background-color: v-bind(backgroundColor);
    border: v-bind(backgroundColor);
    color: v-bind(color);
  }
}
/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-pricing-card {
    width: calc(100vw - 64px);
  }
}
</style>
