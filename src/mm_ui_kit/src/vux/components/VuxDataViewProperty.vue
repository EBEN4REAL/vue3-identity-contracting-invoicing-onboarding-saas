<script setup lang="ts">
import { useTranslationResolver } from "../composables/useVuxTranslationResolver";
import MMIcon from "../../components/MMIcon.vue";
import MMTooltip from "../../components/MMTooltip.vue";

defineProps({
  value: {
    type: Object,
    required: true,
  },
  resourceKey: {
    type: String,
    required: true,
  },
});

const { resolveTranslation: tr } = useTranslationResolver();
</script>

<template>
  <div class="mm-data-view-item">
    <div class="mm-data-view-item-label mm-flex mm-flex-align-center">
      <div v-sanitize-html="tr(`${resourceKey}.label`)"></div>
      <div v-if="tr(`${resourceKey}.label_tooltip`)">
        <m-m-icon
          icon="info"
          width="16px"
          height="16px"
          class="info-icon mm-ml-3"
        />
        <m-m-tooltip display-position="top">
          <div v-sanitize-html="tr(`${resourceKey}.label_tooltip`)" />
        </m-m-tooltip>
      </div>
    </div>
    <div class="mm-data-view-item-text">
      {{ value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-data-view {
  &-item {
    &-label {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0;
      color: #344054;
    }

    &-text {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0;
      color: #384250;

      &--empty {
        color: #9da4ae;
        font-weight: 400;
      }

      &--hidden {
        -webkit-text-security: disc;
        unicode-bidi: bidi-override;
        font-family: monospace;
      }
    }
  }
}
</style>
