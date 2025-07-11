<script setup lang="ts">
import { debounce } from "lodash";
import { PropType, Ref, computed, ref, watch, onMounted } from "vue";
import { LocationQueryRaw, useRoute } from "vue-router";
import { ITEMS_PER_PAGE } from "../../../common/constants";
import { AutocompletePagination } from "../types/types";

const props = defineProps({
  modelValue: {
    type: [String, Array] as PropType<string | string[] | null>,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  iconPrepended: {
    type: String,
    default: "",
  },
  errors: {
    type: Array as PropType<Array<{ $validator: string; $message: string }>>,
    default: () => [],
  },
  hideAsterisk: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "input",
  },
  clearButton: {
    type: String,
    default: "",
  },
  items: {
    type: Array as PropType<object[] | number[] | string[]>,
    default: () => [],
  },
  totalItems: {
    type: Number as PropType<number | null>,
    default: 0,
  },
  loadOffset: {
    type: Number,
    default: 10,
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
  multiple: {
    type: Boolean,
    default: false,
  },
  clientSideFilter: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: Number,
    default: null,
  },
});
const route = useRoute();

const emit = defineEmits([
  "click:append",
  "blur",
  "updateParams",
  "update:modelValue",
  "update:searchQuery",
]);

const displayItems: Ref<object[] | number[] | string[]> = ref([]);

const searchQuery: Ref<string> = ref("");
const focusedOption: Ref<object | null> = ref(null);

const pagination: Ref<AutocompletePagination> = ref({
  limit: (route.query?.limit ?? ITEMS_PER_PAGE[0]) as string,
  offset: (route.query?.offset ?? "0") as string,
});

const isOptionsVisible: Ref<boolean> = ref(false);
const isOptionClicked: Ref<boolean> = ref(false);

const inputValueForMultiple: Ref<object[]> = ref([]);

const filteredItems = computed(() => {
  if (!props.clientSideFilter) return displayItems.value;

  const searchLower = searchQuery.value.toLowerCase();

  return props.items.filter((item) =>
    item[props.itemTitle].toLowerCase().includes(searchLower),
  );
});

const classList = computed(() => [
  "mm-autocomplete",
  {
    "mm-autocomplete-error": props.errors.length,
  },
]);

const onInput = (event: Event) => {
  if (!(props.multiple && Array.isArray(props.modelValue))) {
    searchQuery.value = (event.target as HTMLInputElement).value;
  }
  emit("update:searchQuery", searchQuery.value);
};

const onBlur = () => {
  emit("blur");
};

const onClickOutside = () => {
  isOptionsVisible.value = false;
};

const onFocus = () => {
  isOptionClicked.value = false;
  if (displayItems.value.length === 0) getParams();
  showOptions();
};

const isOptionFocused = (option) => {
  focusedOption.value = option;
};

const handleKeydown = (event, item) => {
  const focusedOptionIndex = props.items.findIndex(
    (element) => element[props.itemTitle] === item[props.itemTitle],
  );

  if (focusedOptionIndex === -1) return;
  switch (event.key) {
    case "Enter":
      onOptionClick(props.items[focusedOptionIndex]);
      showOptions();
      return;

    case "Escape":
      isOptionsVisible.value = false;
      focusedOption.value = null;
  }
};

const onClearInput = () => {
  searchQuery.value = "";
  inputValueForMultiple.value = [];

  if (props.multiple && Array.isArray(props.modelValue)) {
    emit("update:modelValue", []);
  } else {
    emit("update:modelValue", "");
  }
  pagination.value.offset = "0";
};

const showClearButton = () => {
  if (!props.clearButton) {
    return false;
  }

  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0;
  } else {
    return searchQuery.value !== "";
  }
};

const isOptionSelected = (option) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(option[props.itemValue]);
  } else {
    return props.modelValue === option[props.itemValue];
  }
};

const onOptionClick = (option) => {
  if (!option || option.disabled) {
    return;
  }

  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.includes(option[props.itemValue])) {
      const index = props.modelValue.indexOf(option[props.itemValue]);
      const newValue = Array.isArray(props.modelValue)
        ? [...props.modelValue]
        : [];
      const newTempModelValue = [...inputValueForMultiple.value];

      newValue.splice(index, 1);
      newTempModelValue.splice(index, 1);

      inputValueForMultiple.value = newTempModelValue;
      emit("update:modelValue", newValue);
      emit("updateParams");
    } else {
      inputValueForMultiple.value = [...inputValueForMultiple.value, option];
      emit("update:modelValue", [...props.modelValue, option[props.itemValue]]);
    }
    searchQuery.value = "";
  } else {
    emit("update:modelValue", option[props.itemValue]);
    searchQuery.value = option[props.itemTitle];
  }
  isOptionsVisible.value = false;
  isOptionClicked.value = true;
};

const showOptions = () => {
  isOptionsVisible.value = true;
};

const errorsFormatted = computed(() =>
  props.errors.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
);

function getParams() {
  const params: LocationQueryRaw = {
    ...pagination.value,
  };

  if (searchQuery.value && !props.clientSideFilter) {
    params.query = searchQuery.value;
  }
  emit("updateParams", params);
}

watch(
  searchQuery,
  debounce(() => {
    if (!searchQuery.value) {
      displayItems.value = [];
    }
    pagination.value.query = searchQuery.value;
    pagination.value.offset = "0";
  }, 400),
);

watch(
  pagination.value,
  () => {
    if (!props.clientSideFilter) {
      const params: LocationQueryRaw = {
        ...pagination.value,
      };

      if (searchQuery.value) {
        params.query = searchQuery.value;
      } else {
        params.query = "";
      }
      emit("updateParams", params);
    }
  },
  { deep: true },
);

// watch for props.items changes
watch(
  () => props.items,
  (newItems) => {
    if (!Array.isArray(newItems)) {
      newItems = [];
    }

    if (pagination.value.offset === "0") {
      displayItems.value = newItems;
    } else {
      displayItems.value = [...displayItems.value, ...newItems];
    }
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (!props.multiple) {
      const displayValue = displayItems.value.find(
        (item) => item[props.itemValue] === newValue,
      );
      searchQuery.value = displayValue ? displayValue[props.itemTitle] : "";
    }
  },
  { immediate: true },
);

const optionsList: Ref<HTMLDivElement | null> = ref(null);

const onScrollEnd = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, clientHeight, scrollHeight } = target;

  const isEndOfListReached = props.totalItems === displayItems.value.length;
  if (scrollTop + clientHeight >= scrollHeight - 25 && !isEndOfListReached) {
    pagination.value.offset = `${Number(pagination.value.offset) + props.loadOffset}`;
  }
};

const removeTag = (index: number) => {
  const newValue = [...(props.modelValue as string[])];
  const newTempModelValue = [...inputValueForMultiple.value];
  newValue.splice(index, 1);
  newTempModelValue.splice(index, 1);
  inputValueForMultiple.value = newTempModelValue;
  emit("update:modelValue", newValue);
};

// mounted
onMounted(() => {
  emit("updateParams");
});
</script>

<template>
  <div v-mm-click-outside="onClickOutside" :class="classList" :data-cy="cy">
    <div
      :class="[
        'mm-autocomplete-label',
        { 'mm-autocomplete-label--required': required && !hideAsterisk },
      ]"
    >
      {{ label }}
    </div>
    <div
      class="mm-autocomplete-wrapper"
      :class="{
        'mm-autocomplete-wrapper--required': required && !props.modelValue,
      }"
    >
      <m-m-icon
        v-if="iconPrepended"
        :icon="iconPrepended"
        width="20px"
        height="20px"
        data-cy="prepended-icon"
        class="mm-autocomplete-icon-prepended"
        :class="{ 'mm-autocomplete-icon-prepended-disabled': disabled }"
      />
      <div
        v-if="multiple"
        class="mm-autocomplete-control mm-autocomplete-tags"
        @focus="showOptions"
        @input="onInput"
      >
        <template v-if="modelValue?.length">
          <div
            v-for="(tag, index) in inputValueForMultiple"
            :key="index"
            class="mm-autocomplete-tag"
          >
            {{ tag[itemTitle] }}

            <m-m-icon
              icon="x-close"
              width="12px"
              height="12px"
              @click.stop="removeTag(index)"
            />
          </div>
        </template>
        <input
          :id="id"
          v-model="searchQuery"
          :type="type"
          :name="name"
          inputmode="search"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :maxlength="maxlength"
          data-cy="autocomplete"
          autocomplete="off"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
        />
      </div>
      <input
        v-else
        :id="id"
        v-model="searchQuery"
        :type="type"
        :name="name"
        inputmode="search"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :maxlength="maxlength"
        data-cy="autocomplete"
        class="mm-autocomplete-control"
        autocomplete="off"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      />
      <div v-if="isOptionsVisible" class="mm-autocomplete-options">
        <div
          ref="optionsList"
          class="mm-autocomplete-options-list"
          @scrollend="onScrollEnd"
        >
          <template v-if="filteredItems.length">
            <div
              v-for="item of filteredItems"
              :key="item[itemValue]"
              :class="[
                'mm-autocomplete-option',
                { 'mm-autocomplete-option--selected': isOptionSelected(item) },
                { 'mm-autocomplete-option--disabled': item.disabled },
              ]"
              :data-cy="`mm-autocomplete-option-${item[itemValue]}`"
              tabindex="0"
              @click="onOptionClick(item)"
              @focus="isOptionFocused(item)"
              @keydown="(event) => handleKeydown(event, item)"
            >
              <slot name="option" :item="item" />
              <template v-if="!$slots['option']">
                {{ item[itemTitle] }}
              </template>
            </div>
          </template>

          <div
            v-else-if="searchQuery"
            class="mm-pa-8 mm-flex mm-flex-align-center mm-flex-column"
            data-cy="autocomplete-empty-state"
          >
            <div class="mm-page-title--h4 mm-fw-600">
              <slot name="empty-state-title">No Results Found</slot>
            </div>
            <div class="mm-page-subtitle mm-page-subtitle--h2">
              <slot name="empty-state-subtitle"
                >Your search did not match any results.</slot
              >
            </div>
          </div>

          <div
            v-else-if="!items.length && !loading"
            class="mm-autocomplete-no-options mm-mt-3"
            data-cy="autocomplete-no-options"
          >
            No options available
          </div>

          <div v-if="loading" class="spinner-holder">
            <m-m-spinner></m-m-spinner>
          </div>

          <div
            v-if="$slots['options-hint']"
            class="mm-autocomplete-options-hint mm-mt-3"
            data-cy="autocomplete-options-hint"
          >
            <slot name="options-hint" />
          </div>
        </div>
      </div>
      <m-m-icon
        v-if="showClearButton()"
        :icon="clearButton"
        width="16px"
        height="16px"
        fill="#9da4ae"
        class="mm-autocomplete-button-clear"
        data-cy="clear-button"
        @click="onClearInput"
      />
      <div class="mm-autocomplete-button-clear">
        <slot name="append"></slot>
      </div>
    </div>
    <div
      v-if="required && $slots['options-required'] && !props.modelValue"
      class="mm-autocomplete-required"
      data-cy="autocomplete-options-required"
    >
      <slot name="options-required" />
    </div>
    <div
      v-if="$slots['options-helper']"
      class="mm-autocomplete-helper"
      data-cy="autocomplete-options-helper"
    >
      <slot name="options-helper" />
    </div>
    <ul class="mm-autocomplete-errors">
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-autocomplete-errors-item"
        :data-cy="`mm-autocomplete-error-${error.validator}-text`"
      >
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
$mm-autocomplete-options-max-height: 200px;

.mm-autocomplete {
  &-control {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 9px 14px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    color: #101828;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
    &:focus {
      outline: none;
      border-color: #384250;
      box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
    }
    input {
      flex: 1 1;

      &::placeholder {
        color: #667085;
      }

      &:focus {
        outline: none;
      }
    }

    &:has(input:focus) {
      border-color: #384250;
      box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
      outline: none;
    }
  }

  &-required {
    color: #d92d20;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    gap: 5px;
    margin-top: 5px;
    align-items: center;
  }

  &-helper {
    color: #6c737f;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    gap: 5px;
    margin-top: 5px;
    align-items: center;
  }

  &-wrapper {
    position: relative;

    input:disabled {
      background: #f9fafb;
      box-shadow: 0px 1px 2px 0px #1018280d;

      &::placeholder {
        color: #d2d6db;
      }
    }
  }

  &-label {
    text-align: left;
    color: #344054;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 6px;

    &--required {
      &::after {
        content: "*";
        color: #f04438;
      }
    }
  }

  &-icon-prepended {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 14px;
    margin: auto;
    cursor: pointer;

    & + .mm-autocomplete-control {
      padding-left: 40px;
    }

    &-disabled {
      opacity: 0.3;
    }
  }

  &-error {
    .mm-autocomplete-control,
    .mm-autocomplete-control:focus {
      box-shadow: none;
      border-color: #d92d20;
    }
  }

  &-errors {
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

  &-button-clear {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 14px;
    margin: auto;
    cursor: pointer;
  }

  &-options {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 100%;
    max-width: 100%;
    z-index: 100;
    background: #fff;
    border: 1px solid #eaecf0;
    border-radius: 8px;
    box-shadow:
      0 4px 6px -2px rgba(16, 24, 40, 0.03),
      0px 12px 16px -4px rgba(16, 24, 40, 0.08);
    max-height: $mm-autocomplete-options-max-height;
  }

  &-options-list {
    max-height: $mm-autocomplete-options-max-height;
    min-height: 36px;
    overflow-y: auto;
    padding: 6px;
  }

  &-option {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 8px;
    padding: 10px;
    color: #344054;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    border-radius: 6px;
    max-height: $mm-autocomplete-options-max-height;

    &:hover {
      background: #f5f7fa;
    }

    &--selected {
      background: #f9fafb;
    }

    &--disabled {
      cursor: not-allowed;
    }
    &:focus {
      background: #f5f7fa;
      outline: none;
    }
  }

  &-options-list {
    max-height: $mm-autocomplete-options-max-height;
    overflow-y: auto;
    padding: 6px;
  }

  &-options-hint {
    padding: 16px;
    border-top: 1px solid #e6e8ec;
  }

  &-no-options {
    font-style: italic;
    padding: 16px;
    color: #6c737f;
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &-tag {
    display: flex;
    align-items: center;
    color: #344054;
    border-radius: 6px;
    border: 1px solid #d0d5dd;
    padding: 0 4px 0 5px;
    justify-content: center;
    gap: 3px;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
  }

  &-tag-close {
    cursor: pointer;
    width: 12px;
    height: 12px;
  }

  .spinner-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
