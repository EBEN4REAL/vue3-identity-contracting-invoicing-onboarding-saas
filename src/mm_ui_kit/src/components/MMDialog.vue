<script setup lang="ts">
import { computed, useSlots, PropType, ComputedRef } from "vue";
import { DialogStatusTypes } from "~/mm_ui_kit/src/types/dialog.types";

const slots = useSlots();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  iconColor: {
    type: String,
    default: "gray",
  },
  iconSize: {
    type: String,
    default: "20",
  },
  cy: {
    type: String,
    default: "dialog",
  },
  hasDivider: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<"small" | "medium" | "large" | "extra-large">,
    default: "small",
  },
  status: {
    type: String as PropType<DialogStatusTypes>,
    default: DialogStatusTypes.Default,
  },
  showPoweredBy: {
    type: Boolean,
    default: false,
  },
  isLargeModal: {
    type: Boolean,
    default: false,
  },
  scrollable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const mmIconClassList = computed(() => [
  "mm-dialog-icon",
  "mm-flex-shrink-0",
  `mm-dialog-icon--${props.iconColor}`,
]);

const mmDialogContentClassList = computed(() => [
  "mm-dialog-content",
  `mm-dialog-content-${props.size}`,
]);

const mmDialogHeaderClassList = computed(() => [
  "mm-dialog-body-header-content",
  {
    "mm-dialog-body-header-content-large": props.isLargeModal,
  },
]);

const dialogBodyClasses = computed(() => [
  "mm-dialog-body-container",
  { "has-divider": props.hasDivider },
  { "mm-dialog-scrollable": props.scrollable },
]);

const onClose = () => {
  emit("close");
};
// check if slot named subtitle exists or prop subtitle is passed
const hasSubtitle: ComputedRef<boolean> = computed(
  () => !!slots.subtitle || !!props.subtitle,
);

const hasSlotFooter: ComputedRef<boolean> = computed(() => !!slots.footer);

const isDefaultIcon: ComputedRef<boolean> = computed(() =>
  Boolean(props.status === DialogStatusTypes.Default && props.icon),
);

const isStatusLoading: ComputedRef<boolean> = computed(
  () => props.status === DialogStatusTypes.Loading,
);

const isStatusSuccess: ComputedRef<boolean> = computed(
  () => props.status === DialogStatusTypes.Success,
);
</script>

<template>
  <div v-if="isOpen" class="mm-dialog">
    <div class="mm-dialog-overlay" :data-cy="cy">
      <div :class="mmDialogContentClassList">
        <div class="mm-dialog-body">
          <div class="mm-dialog-body-header">
            <m-m-icon
              icon="close"
              class="mm-dialog-close-button"
              width="24px"
              height="24px"
              data-cy="dialog-close-button"
              @click="onClose"
            />
            <div :class="mmDialogHeaderClassList">
              <div
                v-if="isDefaultIcon && !isLargeModal"
                :class="mmIconClassList"
              >
                <m-m-icon :icon="icon" :width="iconSize" :height="iconSize" />
              </div>
              <div
                v-else-if="isStatusLoading"
                class="mm-dialog-icon--loading"
              />
              <div
                v-else-if="isLargeModal"
                class="mm-dialog-icon mm-dialog-icon--large"
              >
                <slot name="icon"></slot>
              </div>
              <m-m-icon
                v-else-if="isStatusSuccess"
                icon="check-green"
                width="40px"
                height="40px"
                class="mm-flex-shrink-0"
              />
              <div class="mm-dialog-body-header-title-subtitle">
                <div
                  v-if="title"
                  class="mm-dialog-title"
                  data-cy="dialog-title"
                >
                  {{ title }}
                </div>

                <div
                  v-if="hasSubtitle"
                  class="mm-dialog-subtitle"
                  data-cy="dialog-subtitle"
                >
                  <slot name="subtitle">{{ subtitle }}</slot>
                </div>
              </div>
            </div>
          </div>
          <div v-mm-focus-first :class="dialogBodyClasses">
            <slot />
          </div>
        </div>
        <div v-if="hasSlotFooter" class="mm-dialog-footer">
          <slot name="footer" />
        </div>
        <div v-if="$slots['powered-by']">
          <slot name="powered-by" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-dialog {
  &-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-content {
    position: relative;
    border-radius: 12px;
    background: #ffffff;
    box-shadow:
      0 8px 8px -4px rgba(16, 24, 40, 0.03),
      0 20px 24px -4px rgba(16, 24, 40, 0.08);
    text-align: left;

    &-small {
      width: 544px;
    }
    &-medium {
      width: 688px;
    }
    &-large {
      width: 823px;
    }
    &-extra-large {
      width: 950px;
    }
  }

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-bottom: 16px;

    &--gray {
      background-color: #f3f4f6;
    }

    &--warning {
      background-color: #fef0c7;
    }

    &--error {
      background-color: #fee4e2;
    }

    &--loading {
      width: 40px;
      height: 40px;
      background-image: url("../assets/images/loader.svg");
      background-size: 30px 30px;
      background-position: center center;
      flex-shrink: 0;
      animation: rotate linear 1s infinite;

      @keyframes rotate {
        100% {
          transform: rotate(360deg);
        }
      }
    }

    &--large {
      width: fit-content;
      height: fit-content;
      margin-bottom: 15px;
    }
  }

  &-close-button {
    position: absolute;
    top: 24px;
    right: 24px;
    background: none;
    border: none;
    cursor: pointer;
  }

  &-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    text-align: left;
    color: #384250;
  }

  &-subtitle {
    color: #475467;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  &-body {
    padding: 24px 0px 40px;

    &-header {
      padding: 0 24px;

      &-content {
        display: flex;
        flex-direction: row;
        gap: 16px;

        &-large {
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
      }
      &-title-subtitle {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }
  }

  &-body-container {
    margin-top: 24px;
    padding: 0 24px;

    &.has-divider {
      border-top: 1px solid #eaecf0;
    }
  }

  &-footer {
    padding: 16px;
    border-top: 1px solid #eaecf0;
    background-color: #fdfdfe;
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
}
</style>
