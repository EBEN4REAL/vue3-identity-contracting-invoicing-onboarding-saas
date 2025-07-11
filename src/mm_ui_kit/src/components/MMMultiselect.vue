<script setup lang="ts">
import Multiselect from "vue-multiselect";
import {
  computed,
  ComputedRef,
  PropType,
  ref,
  Ref,
  useAttrs,
  watch,
} from "vue";
import { LocationQueryRaw } from "vue-router";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { debounce } from "lodash";
import { TypeMultiselectOption } from "~/mm_ui_kit/src/types/multiselect.types";

const emit = defineEmits([
  "update:modelValue",
  "updateParams",
  "search-change",
]);

const $attrs = useAttrs();

const props = defineProps({
  modelValue: {
    type: [null, String, Array, Object],
    default: null,
  },
  label: {
    type: String,
    default: "",
    required: true,
  },
  labelToolTipText: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  itemTitle: {
    type: String,
    default: "title",
  },
  itemValue: {
    type: String,
    default: "value",
  },
  total: {
    type: Number,
    default: 0,
  },
  class: {
    type: String,
    default: "",
  },
  isMultiselectDisabled: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array as PropType<Array<{ $validator: string; $message: string }>>,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const localOptions: Ref<unknown[]> = ref([]);

const isOptionsOpen: Ref<boolean> = ref(false);
const multiselectRef: Ref<InstanceType<typeof Multiselect> | null> = ref(null);
const params: Ref<LocationQueryRaw> = ref({
  offset: "0",
  limit: ITEMS_PER_PAGE[0],
});
const searchValue: Ref<string> = ref("");

const chevronClassList: ComputedRef<Record<string, boolean>> = computed(() => ({
  chevron: true,
  "chevron-opened": isOptionsOpen.value,
}));

const getOptionClass = (option: {
  $isDisabled: boolean;
}): Record<string, boolean> => ({
  "mm-multiselect--disabled-option": option.$isDisabled,
});

const isChevronVisible: ComputedRef<boolean> = computed(
  () => !props.multiple && !props.loading,
);

const options: ComputedRef<TypeMultiselectOption[]> = computed(() => {
  const optionsAsArray = Array.isArray($attrs.options) ? $attrs.options : [];

  const isOptionsArrayOfStrings = optionsAsArray.every(
    (item) => typeof item === "string",
  );

  return isOptionsArrayOfStrings
    ? optionsAsArray.map((item) => ({ title: item, value: item }))
    : optionsAsArray;
});

const getDisabledText = (option: { disabledText?: string }): string =>
  option.disabledText || "Already added";

const updateValue = (value) => {
  emit("update:modelValue", value);
};

const onOpen = () => {
  isOptionsOpen.value = true;
  emit("updateParams", params.value);
  const listElement = multiselectRef.value?.$refs.list;
  if (listElement) {
    listElement.addEventListener("scroll", handleScroll);
  }
};

const onClose = () => {
  isOptionsOpen.value = false;
  const listElement = multiselectRef.value?.$refs.list;
  if (listElement) {
    listElement.removeEventListener("scroll", handleScroll);
  }
};

const handleScroll = () => {
  const listElement = multiselectRef.value?.$refs.list;
  if (listElement) {
    const isScrolledToBottom =
      listElement.scrollHeight - listElement.scrollTop ===
      listElement.clientHeight;

    // If there's more data to load
    if (isScrolledToBottom && props.total > localOptions.value.length) {
      params.value.offset = `${
        Number(params.value.offset) + Number(params.value.limit)
      }`;
    }
  }
};

const setSearchValue = (value: string) => {
  searchValue.value = value;
};

const mmMultiselectClassList: ComputedRef<
  (string | Record<string, boolean>)[]
> = computed(() => [
  "mm-multiselect",
  props.class,
  {
    ["mm-multiselect--error"]: !!props.errors?.length,
  },
]);

const closeMultiselect = () => {
  if (multiselectRef.value) {
    multiselectRef.value.deactivate();
  }
};

watch(
  () => searchValue.value,
  debounce(() => {
    params.value.query = searchValue.value;
    params.value.offset = "0";
    emit("search-change", searchValue.value);
  }, 400),
);

watch(
  () => params.value,
  () => {
    emit("updateParams", params.value);
  },
  {
    deep: true,
  },
);

watch(
  () => options.value,
  (newOptions) => {
    if (Number(params.value.offset) === 0) {
      localOptions.value = Array.isArray(newOptions) ? newOptions : [];
    } else {
      localOptions.value = [
        ...localOptions.value,
        ...(Array.isArray(newOptions) ? newOptions : []),
      ];
    }
  },
  { deep: true, immediate: true },
);

defineExpose({
  multiselectRef,
  closeMultiselect,
});
</script>

<template>
  <div :class="mmMultiselectClassList">
    <m-m-field-label
      v-if="label"
      :required="required"
      :label="label"
      :tooltip-text="labelToolTipText"
    />
    <m-m-icon
      v-if="icon"
      :icon="icon"
      width="20px"
      height="20px"
      class="mm-multiselect-icon"
    />
    <multiselect
      v-bind="$attrs"
      ref="multiselectRef"
      :label="itemTitle"
      :track-by="itemValue"
      :model-value="modelValue"
      :options="localOptions"
      :disabled="isMultiselectDisabled"
      :multiple="multiple"
      @open="onOpen"
      @close="onClose"
      @search-change="setSearchValue"
      @update:model-value="updateValue"
    >
      <template #option="{ option }">
        <div
          class="mm-flex mm-flex-justify-between w-100"
          :class="getOptionClass(option)"
        >
          <span>{{ option[itemTitle] }}</span>
          <template v-if="option.$isDisabled">
            <slot
              v-if="$slots['disabled-text']"
              name="disabled-text"
              :option="option"
            />
            <span v-else>{{ getDisabledText(option) }}</span>
          </template>
        </div>
      </template>
      <template v-for="slotName in Object.keys($slots)" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
      <template #caret>
        <m-m-spinner v-if="loading" class="mm-multiselect--spinner" />
        <div v-if="isChevronVisible" :class="chevronClassList" />
      </template>
      <template #noResult>
        <div
          class="mm-pa-8 mm-flex mm-flex-align-center mm-flex-column mm-w-10 mm-cursor-default"
          data-cy="empty-state"
        >
          <div class="mm-pa-6">
            <m-m-icon icon="magnify-outline" width="52" height="52" />
          </div>
          <div class="mm-page-title--h4 mm-fw-600">
            <slot name="empty-state-title">No Results Found</slot>
          </div>
          <div class="mm-page-subtitle mm-page-subtitle--h2">
            <slot name="empty-state-subtitle">
              Your search did not match any results.
            </slot>
          </div>
        </div>
      </template>
      <template #noOptions>
        <div
          class="mm-pa-8 mm-flex mm-flex-align-center mm-flex-column mm-w-10 mm-cursor-default"
          data-cy="empty-state"
        >
          <div class="mm-pa-6">
            <m-m-icon icon="magnify-outline" width="52" height="52" />
          </div>
          <div class="mm-page-title--h4 mm-fw-600">
            <slot name="empty-state-title">No Results Found</slot>
          </div>
          <div class="mm-page-subtitle mm-page-subtitle--h2">
            <slot name="empty-state-subtitle">
              Your search did not match any results.
            </slot>
          </div>
        </div>
      </template>
      <template v-if="$slots['afterListContent']" #afterList>
        <div class="mm-pa-8 after-list-content">
          <slot name="afterListContent" />
        </div>
      </template>
    </multiselect>
    <ul class="errors">
      <li
        v-for="error in errors"
        :key="`${error.$validator}-${error.$message}`"
        class="errors-item"
        :data-cy="`error-${error.$validator}-text`"
      >
        {{ error.$message }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.chevron {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  width: 12px;
  height: 8px;
  transform-origin: center;
  transition: transform 0.3s;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 8px;
    height: 2px;
    top: 3px;
    background-color: #0f172a;
    border-radius: 2px;
    transform-origin: center;
  }

  &:before {
    left: 0;
    transform: rotate(45deg);
  }

  &:after {
    left: 5px;
    transform: rotate(-45deg);
  }

  &-opened {
    transform: rotate(180deg);
  }
}

.mm-multiselect {
  position: relative;

  &--disabled-option {
    opacity: 0.5;
  }

  &--required {
    &::after {
      content: "*";
      color: #f04438;
    }
  }

  .mm-multiselect-icon {
    position: absolute;
    top: 36px;
    left: 14px;
    z-index: 1;

    & ~ .multiselect {
      :deep(.multiselect__tags) {
        padding-left: 40px;
      }
    }
  }

  &--error {
    :deep(.multiselect__tags) {
      box-shadow: none !important;
      border-color: #d92d20 !important;
    }
  }

  .errors {
    list-style: none;

    &-item {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 6px;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px; /* 150% */
      color: #d92d20;
    }
  }

  &--spinner {
    position: absolute;
    top: 12px;
    right: 12px;
  }
}

.multiselect {
  position: relative;

  :deep(.multiselect__spinner) {
    position: absolute;
    right: 14px;
    top: 12px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    border: 2px solid #072e51;
    border-bottom-color: transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  :deep(.multiselect__tags) {
    display: flex;
    align-items: center;
    min-height: 40px;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    padding: 6px 14px;
    line-height: 26px;
    cursor: pointer;
    column-gap: 8px;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    &:focus {
      background: #f5f7fa;
    }

    input {
      position: relative;
      display: inline-block;
      height: 26px;
      line-height: 20px;
      border: none;
      transition: border 0.1s ease;
      box-sizing: border-box;
      vertical-align: top;
      cursor: text;
      flex-grow: 1;
      min-width: 0;

      &:focus {
        outline: none;
      }
    }
  }

  &--disabled {
    :deep(.multiselect__tags) {
      cursor: not-allowed;
      background: #f9fafb;
      color: #6c737f;

      &::placeholder {
        color: #d2d6db;
      }
    }
  }

  &--above {
    :deep(.multiselect__content-wrapper) {
      bottom: 100%;
    }
  }

  &--active {
    :deep(.multiselect__input) {
      width: auto !important;
    }
  }

  :deep(.multiselect__placeholder) {
    color: #8e8e93;
  }

  :deep(.multiselect__content-wrapper) {
    z-index: 100;
    background: #fff;
    border: 1px solid #eaecf0;
    border-radius: 8px;
    box-shadow:
      0 4px 6px -2px rgba(16, 24, 40, 0.03),
      0 12px 16px -4px rgba(16, 24, 40, 0.08);
    overflow: auto;
    position: absolute;
    display: block;
    width: 100%;
    max-height: 240px;
    border-top: none;
    padding: 6px;
    -webkit-overflow-scrolling: touch;

    .multiselect__content {
      width: 100%;
      margin: 0 !important;
      padding: 0 !important;
    }

    .multiselect__option {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      color: #344054;
      font-size: 16px;
      line-height: 24px;
      cursor: pointer;
      border-radius: 6px;
      text-overflow: ellipsis;

      &--highlight {
        background: #f5f7fa;
      }
    }
  }

  :deep(.multiselect__option--selected),
  :deep(.multiselect__option--disabled) {
    &:after {
      display: flex;
      align-items: center;
      color: #344054;
      border-radius: 6px;
      border: 1px solid #d0d5dd;
      padding: 0 4px;
      justify-content: center;
      gap: 3px;
      font-size: 14px;
      line-height: 20px;
    }
  }

  :deep(.multiselect__option--selected:after) {
    content: attr(data-selected);
  }

  :deep(.multiselect__element:has(.multiselect__option--disabled)) {
    opacity: 0.5;
  }

  :deep(.multiselect__tags-wrap) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  :deep(.multiselect__tag) {
    display: flex;
    align-items: center;
    color: #344054;
    border-radius: 6px;
    border: 1px solid #d0d5dd;
    padding: 0 4px;
    justify-content: center;
    gap: 3px;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
  }

  :deep(.multiselect__tag-icon) {
    position: relative;
    width: 10px;
    height: 10px;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1.5px;
      background-color: #98a2b3;
      top: 50%;
      left: 0;
      transform-origin: center;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
}

.after-list-content {
  border-top: 1px solid #eaecf0;
}
</style>
