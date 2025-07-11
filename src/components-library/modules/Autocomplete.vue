<script setup lang="ts">
import { ref } from "vue";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { TableRequestParams } from "~/mm_ui_kit/src/types/table.types";

const items = ref([{}]);
const itemKey = ref("");
const autocompleteMultipleValue = ref([]);

const isInputDisabled = ref(true);

const expandedOptionsData = [
  { key: "Option 1", value: "Option 1" },
  { key: "Option 2", value: "Option 2" },
  { key: "Option 3", value: "Option 3" },
  { key: "Option 4", value: "Option 4" },
  { key: "Option 5", value: "Option 5" },
  { key: "Option 6", value: "Option 6" },
  { key: "Option 7", value: "Option 7" },
  { key: "Option 8", value: "Option 8" },
  { key: "Option 9", value: "Option 9" },
  { key: "Option 10", value: "Option 10" },
  { key: "Option 11", value: "Option 11" },
  { key: "Option 12", value: "Option 12" },
  { key: "Option 13", value: "Option 13" },
];

const handleUpdateParams = (
  params: TableRequestParams = { limit: ITEMS_PER_PAGE[4], offset: "0" },
) => {
  //BE CALL WITH VALUE
  itemKey.value = params.query ?? "";
  if (params.query === "1") {
    items.value = [
      { key: "Option 1", value: "Option 1" },
      { key: "Option 10", value: "Option 10" },
      { key: "Option 11", value: "Option 11" },
    ];
  } else if (params.offset === "0") {
    items.value = [
      { key: "Option 1", value: "Option 1" },
      { key: "Option 2", value: "Option 2" },
      { key: "Option 3", value: "Option 3" },
      { key: "Option 4", value: "Option 4" },
      { key: "Option 5", value: "Option 5" },
      { key: "Option 6", value: "Option 6" },
      { key: "Option 7", value: "Option 7" },
      { key: "Option 8", value: "Option 8" },
      { key: "Option 9", value: "Option 9" },
      { key: "Option 10", value: "Option 10" },
    ];
  } else {
    items.value = expandedOptionsData;
  }
};
</script>

<template>
  <form v-mm-focus-first class="mm-mb-12">
    <m-m-autocomplete
      id="autocomplete"
      v-model="itemKey"
      placeholder="Search"
      label="Input Label"
      cy="input"
      icon-prepended="search-lg"
      clear-button="x-circle"
      :items="items"
      :total-items="expandedOptionsData.length"
      item-title="key"
      item-value="value"
      @update-params="handleUpdateParams"
    />

    <m-m-autocomplete
      id="autocomplete-disabled"
      class="mm-mt-12"
      placeholder="Search"
      label="Input Label disabled"
      cy="input-disabled"
      icon-prepended="search-lg"
      clear-button="x-circle"
      :items="[]"
      item-title="key"
      item-value="value"
      :disabled="isInputDisabled"
      @update-params="handleUpdateParams"
    />

    <m-m-autocomplete
      id="autocomplete-required"
      v-model="itemKey"
      class="mm-mt-12"
      placeholder="Search"
      label="Input Label"
      cy="input-required"
      icon-prepended="search-lg"
      clear-button="x-circle"
      required
      :items="items"
      item-title="key"
      item-value="value"
      @update-params="handleUpdateParams"
    >
      <template #options-required>
        <m-m-icon icon="warning" width="16px" height="16px" />
        <div>Please select a option</div>
      </template>
    </m-m-autocomplete>

    <m-m-autocomplete
      id="autocomplete-helper"
      v-model="itemKey"
      class="mm-mt-12"
      placeholder="Search"
      label="Input Label"
      cy="input-helper"
      icon-prepended="search-lg"
      clear-button="x-circle"
      :items="items"
      item-title="key"
      item-value="value"
      @update-params="handleUpdateParams"
    >
      <template #options-helper>
        <m-m-icon icon="info" width="16px" height="16px" />
        <div>Helper text</div>
      </template>
    </m-m-autocomplete>

    <m-m-autocomplete
      id="autocomplete-multiple"
      v-model="autocompleteMultipleValue"
      class="mm-mt-12"
      placeholder="Search"
      label="Multiple"
      icon-prepended="search-lg"
      clear-button="x-circle"
      :items="expandedOptionsData"
      item-title="key"
      item-value="value"
      multiple
      @update-params="handleUpdateParams"
    />
  </form>
</template>

<style scoped lang="scss"></style>
