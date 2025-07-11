<script lang="ts" setup>
import { ref, Ref, watch, computed, PropType, ComputedRef } from "vue";
import { ITEMS_PER_PAGE } from "../../../../common/constants";
import { TablePagination } from "../../types/table.types";
import { TypeDropdownItem } from "../../types/dropdown.types";

const props = defineProps({
  noOfResults: {
    type: Number as PropType<number | null>,
    default: 0,
  },
  modelValue: {
    type: Object as PropType<TablePagination>,
    default: () => ({ limit: ITEMS_PER_PAGE[0], offset: "0" }),
  },
  isResetPage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const limit: Ref<number> = ref(Number(props.modelValue.limit));
const offset: Ref<number> = ref(Number(props.modelValue.offset));

watch([limit, offset], () => {
  const calculatedOffset =
    limit.value >= Number(props.noOfResults) ? 0 : offset;
  emit("update:modelValue", { limit: limit.value, offset: calculatedOffset });
});

watch(
  () => props.isResetPage,
  (isResetPage) => {
    if (isResetPage) {
      offset.value = 0;
      emit("update:modelValue", { limit: limit.value, offset: 0 });
    }
  },
);

const prevDisabled = computed(() => offset.value === 0);
const nextDisabled = computed(
  () => offset.value + limit.value >= (props.noOfResults || 0),
);

const itemsPerPageForDropdown: ComputedRef<TypeDropdownItem[]> = computed(
  () => {
    const resultsPerPage =
      Math.ceil(Number(props.noOfResults) / limit.value) * limit.value;

    const dropdownItems: TypeDropdownItem[] = [];
    for (const item of ITEMS_PER_PAGE) {
      const itemValue = Number(item);
      if (itemValue <= resultsPerPage) {
        dropdownItems.push({
          label: item,
          type: "button",
          onClick: () => (limit.value = itemValue),
        });
      }
    }

    return dropdownItems;
  },
);

const previousPage = () => {
  if (offset.value >= limit.value) {
    offset.value -= limit.value;
  }
};

const nextPage = () => {
  if (offset.value + limit.value < (props.noOfResults || 0)) {
    offset.value += limit.value;
  }
};
</script>

<template>
  <div
    class="mm-table-pagination mm-flex mm-flex-justify-between mm-flex-align-center mm-px-12 mm-py-8"
    data-cy="pagination"
  >
    <div class="mm-flex mm-flex-align-center mm-flex-gap-4">
      Showing
      <m-m-dropdown
        :items="itemsPerPageForDropdown"
        cy="dropdown-table-pagination"
      >
        <template #activator>
          <div class="mm-table-pagination-select-limit">
            {{ limit }}
            <m-m-icon icon="chevron-down-primary" width="20px" height="20px" />
          </div>
        </template>
      </m-m-dropdown>
      out of {{ noOfResults }} results
    </div>
    <div class="mm-flex mm-flex-gap-6">
      <m-m-button
        class="previous-button"
        :is-disabled="prevDisabled"
        variant="outlined-light"
        data-cy="previous-page"
        @click="previousPage"
        >Previous</m-m-button
      >
      <m-m-button
        class="next-button"
        :is-disabled="nextDisabled"
        variant="outlined-light"
        data-cy="next-page"
        @click="nextPage"
        >Next</m-m-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.previous-button {
  width: 87px;
  height: 36px;
}
.next-button {
  width: 61px;
  height: 36px;
}
.mm-table-pagination {
  position: sticky;
  left: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #384250;

  &-select-limit {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #072e51;
    padding: 2px 4px;
    border: 1px solid #d3d7dc;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 #1018280d;
    cursor: pointer;
  }
}
</style>
