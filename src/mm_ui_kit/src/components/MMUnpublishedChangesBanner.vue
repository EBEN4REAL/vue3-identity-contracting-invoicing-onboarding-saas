<script setup lang="ts">
import { defineProps, computed, ComputedRef } from "vue";

const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
  backgroundColor: {
    type: String,
    default: "rgb(234, 241, 244)",
  },
  borderColor: {
    type: String,
    default: "#1c7695",
  },
  isActionButtonVisible: {
    type: Boolean,
    default: false,
  },
  isShowCount: {
    type: Boolean,
    default: false,
  },
});

const dynamicStyles: ComputedRef<Record<string, string>> = computed(() => ({
  backgroundColor: props.backgroundColor,
  borderLeft: `4px solid ${props.borderColor}`,
}));
</script>

<template>
  <div
    class="mm-flex mm-flex-justify-between mm-flex-align-center mm-config-pubish-banner"
    :style="dynamicStyles"
  >
    <span class="mm-flex mm-flex-gap-2 mm-flex-align-center">
      <slot name="icon">
        <m-m-icon
          icon="info-solid"
          height="20"
          width="20"
          class="mm-mr-2 config-info-icon"
        />
      </slot>
      <slot name="content">
        You have unpublished
        <span v-if="isShowCount">
          {{ count }}
        </span>
        changes. Review and publish to make configuration available to your
        users.
      </slot>
    </span>
    <slot name="action">
      <m-m-button
        v-if="isActionButtonVisible"
        variant="elevated"
        size="medium"
        class="button-publish-changes"
      >
        Review & Publish
      </m-m-button>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.mm-config-pubish-banner {
  background-color: rgb(234, 241, 244);
  border-left: 4px solid #1c7695;
  padding: 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: auto;
  margin: 0 auto;
  width: 100%;
  margin-bottom: 20px;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    strong {
      white-space: nowrap;
    }
  }

  .button-publish-changes {
    border-radius: 8px;
    flex-shrink: 0;
  }
}

@media (max-width: $breakpoint-sm) {
  .mm-config-pubish-banner {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    padding: 0.75rem;

    .button-publish-changes {
      width: 100%;
      margin-top: 0.5rem;
    }

    .config-info-icon {
      width: 36px;
    }
  }
}

@media (max-width: $breakpoint-xs) {
  .mm-config-pubish-banner {
    padding: 0.5rem;
    font-size: 0.9rem;
    margin-top: 87px;
    margin-left: 12px;

    .button-publish-changes {
      font-size: 0.9rem;
      padding: 0.5rem;
    }

    .config-info-icon {
      width: 40px !important;
    }
  }
}
</style>
