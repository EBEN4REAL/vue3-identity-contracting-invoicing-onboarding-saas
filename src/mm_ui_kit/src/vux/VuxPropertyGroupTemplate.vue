<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, Ref, ref } from "vue";
import { useVux } from "./composables/useVux";
import {
  VuxExposedMethods,
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "./types/vuxTemplateComponent";
import { Vux } from "./types/vuxTemplateComponentLogic";
import { VuxModel } from "./types/useVuxModelType";
import { VuxAction } from "./types/useVuxActionType";

const props = withDefaults(defineProps<VuxTemplateComponentProps>(), {
  treatArrayAsComponentList: false,
  dataFieldName: "",
});
const emit = defineEmits<VuxTemplateComponentEmits>();
const model = defineModel<VuxModel>();

const vux = ref<Vux>(useVux(props, emit, model));

let resizeObserver: ResizeObserver | null = null;
const componentGroup = ref<HTMLDivElement | null>(null);
const orientation: Ref<"vertical" | "horizontal"> = ref(
  vux.value.groupMetadata.layout?.orientation || "vertical",
);

const updateOrientation = () => {
  if (componentGroup.value) {
    const elements = document.querySelectorAll(
      ".vux-component-group.vux-component-group--component",
    );
    if (!elements.length) return;
    const componentGroupWithChildren = Array.from(elements).filter(
      (el) => !el.querySelector(".vux-component-group"),
    );

    let currentOrientation = Array.from(componentGroupWithChildren).find(
      (item) => item.classList.contains("vux-component-group--horizontal"),
    )
      ? "horizontal"
      : "vertical";

    componentGroupWithChildren.forEach((componentGroupWithChildrenItem) => {
      const containerWidth = componentGroupWithChildrenItem.offsetWidth;

      const totalGapsWidthIfHorizontal =
        Number(
          getComputedStyle(componentGroupWithChildrenItem)[
            "column-gap"
          ].replace("px", ""),
        ) *
        (componentGroupWithChildrenItem.children.length - 1);

      const totalItemsWidth = Array.from(
        componentGroupWithChildrenItem.children,
      ).reduce((total, item) => {
        const itemWidth =
          Number(getComputedStyle(item)["min-width"].replace("px", "")) ||
          item.offsetWidth;
        return total + itemWidth + totalGapsWidthIfHorizontal;
      }, 0);

      currentOrientation =
        totalItemsWidth > containerWidth ? "vertical" : "horizontal";

      componentGroupWithChildren.forEach((componentGroupWithChildrenItem) => {
        if (currentOrientation === "horizontal") {
          componentGroupWithChildrenItem.classList.add(
            "vux-component-group--horizontal",
          );
          componentGroupWithChildrenItem.classList.remove(
            "vux-component-group--vertical",
          );
        } else {
          componentGroupWithChildrenItem.classList.remove(
            "vux-component-group--horizontal",
          );
          componentGroupWithChildrenItem.classList.add(
            "vux-component-group--vertical",
          );
        }
      });
    });
  }
};

const componentGroupClassList = computed(() => [
  "vux-component-group",
  `vux-component-group--${orientation.value}`,
  Boolean(vux.value.groupMetadata.layout?.visualSeparation) &&
    "vux-component-group--visually-separated",
]);

onMounted(() => {
  resizeObserver = new ResizeObserver(updateOrientation);
  if (componentGroup.value) {
    resizeObserver.observe(componentGroup.value);
  }
  window.addEventListener("resize", updateOrientation);
  updateOrientation();
});

onBeforeUnmount(() => {
  if (resizeObserver && componentGroup.value) {
    resizeObserver.unobserve(componentGroup.value);
  }
  window.removeEventListener("resize", updateOrientation);
});

// Public methods
defineExpose({
  get isValid() {
    return vux.value?.isValid;
  },
  validate: vux.value.validate,
  save: vux.value.save,
  edit: vux.value.edit,
});
</script>

<template>
  <div v-if="vux.isReady" ref="componentGroup" :class="componentGroupClassList">
    <template
      v-for="(propertyMetadata, propertyName) in vux.groupProperties"
      :key="propertyName"
    >
      <component
        :is="vux.resolveComponent(propertyMetadata.type)"
        :ref="
          (el: VuxExposedMethods) =>
            vux.registerPropertyComponent(el, propertyName)
        "
        v-model="vux.groupModel"
        :mode="mode"
        :resource-key="`${propertyMetadata.resourceKey}`"
        :meta-data="vux.groupMetadata"
        :data-field-name="propertyName"
        class="vux-component-group--component"
        @validation-changed="
          (propIsValid: boolean) =>
            vux.handlePropertyValidationChange(propertyName, propIsValid)
        "
        @vux-action="
          (name: string, action: VuxAction, actionModel: VuxModel) =>
            vux.handleVuxAction(name, action, actionModel)
        "
      />
    </template>
    <vux-actions-list
      v-model="vux.groupModel"
      :mode="mode"
      :meta-data="vux.groupMetadata"
      :resource-key="props.resourceKey"
      @vux-action="
        (name: string, action: VuxAction, actionModel: VuxModel) =>
          vux.handleVuxAction(name, action, actionModel)
      "
    />
  </div>
</template>

<style scoped lang="scss">
$source-types: text, textarea, url, datetime, date, time;
$target-types: checkbox, radio, select, toggle;
$extra-targets: ".vux-actions-list"; // full class selectors

.vux-component-group {
  display: flex;
  column-gap: 12px;
  row-gap: 24px;

  &--vertical {
    flex-direction: column;
  }

  &--horizontal {
    flex-direction: row;

    &.vux-component-group {
      // Loop through input property types (text, textarea)
      @each $source in $source-types {
        // Target other vux-input-property types
        @each $target in $target-types {
          .vux-input-property--#{$source}:has(.mm-field-label)
            ~ .vux-input-property--#{$target} {
            margin-top: 26px;
          }
        }

        // Target non-input components (e.g., vux-actions-list)
        @each $extra in $extra-targets {
          .vux-input-property--#{$source}:has(.mm-field-label) ~ #{$extra} {
            margin-top: 26px;
          }
        }
      }
    }

    // Make all first-level children grow to fill the space
    & > * {
      &.vux-input-property {
        &--date,
        &--time,
        &--datetime,
        &--text,
        &--textarea {
          flex-grow: 1;
        }

        .vux-actions-list {
          margin-top: 26px;
        }
      }
    }

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
    }
  }

  &--visually-separated {
    background-color: #f4f5f7;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
  }
}
</style>
