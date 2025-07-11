<script setup lang="ts">
import { computed } from "vue";
import { ref, Ref, PropType } from "vue";
import { TableColumnFilter, TableRow } from "../../types/table.types";
import MMDropdown from "../../components/MMDropdown.vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  order: {
    type: String,
    default: "",
  },
  activeOrder: {
    type: Boolean,
    default: false,
  },
  filter: {
    type: Object as PropType<TableColumnFilter | null>,
    default: null,
  },
  sortIcon: {
    type: Boolean,
    default: false,
  },
  rowItems: {
    type: Array as PropType<TableRow[]>,
    default: () => [],
  },
});

const emit = defineEmits(["updateFilter", "updateSort"]);

const filterDropdown: Ref<InstanceType<typeof MMDropdown> | null> = ref(null);

const filterActive: Ref<boolean> = ref(false);

const selectedFilters: Ref<string[]> = ref([]);

const toggleFilterActive = () => {
  filterActive.value = !filterActive.value;
};

const formatedFilter = computed(() => {
  let filterObject: Record<string, string | string[]> = {};
  if (props.filter?.type === "date") {
    // Todo: implement date filter
  } else {
    filterObject = {
      [props.name]: selectedFilters.value,
    };
  }

  return filterObject;
});

const applyFilter = () => {
  emit("updateFilter", formatedFilter.value);

  filterDropdown.value?.togglePopup();
};

const clearFilter = () => {
  if (selectedFilters.value.length) {
    selectedFilters.value = [];
  }
  emit("updateFilter", formatedFilter.value);
  filterDropdown.value?.togglePopup();
};

const mmTableIconClass = computed(() => [
  "mm-table-header-cell--icon",
  { "mm-table-header-cell--icon-focused": props.order === "asc" },
  { "mm-table-header-cell--icon-disabled": !props.activeOrder },
]);

const handleButtonOrder = () => {
  emit("updateSort", props.name);
};
</script>

<template>
  <div class="mm-table-header-cell mm-flex mm-flex-align-center">
    <div v-if="sortIcon && props.rowItems.length > 0">
      <m-m-icon
        v-if="activeOrder"
        width="20px"
        height="20px"
        icon="arrow-small-down"
        :class="mmTableIconClass"
        :data-cy="`sort-icon-${name}`"
        @click="handleButtonOrder()"
      />
      <m-m-icon
        v-else
        width="20px"
        height="20px"
        icon="arrows-up-down"
        fill="#475467"
        :class="mmTableIconClass"
        :data-cy="`sort-icon-${name}`"
        @click="handleButtonOrder()"
      />
    </div>
    <template v-if="!filter">
      {{ label }}
    </template>
    <m-m-dropdown
      v-else
      ref="filterDropdown"
      display-position="toRight"
      max-width="213px"
      @show-dropdown="toggleFilterActive"
      @hide-dropdown="toggleFilterActive"
    >
      <template #activator>
        <div :class="['column-filter', { active: filterActive }]">
          <div>
            {{ label
            }}<span v-if="selectedFilters.length" class="column-filter-items"
              >({{ selectedFilters.length }})</span
            >
          </div>
          <m-m-icon
            icon="filter"
            width="20px"
            height="20px"
            stroke="#122d51"
            :fill="filterActive || selectedFilters.length ? '#122d51' : 'none'"
          />
        </div>
      </template>
      <template #list>
        <div class="mm-pa-8 mm-flex mm-flex-column mm-flex-gap-6">
          <m-m-checkbox
            v-for="option in filter.options"
            :key="option.value"
            v-model="selectedFilters"
            :value="option.value"
            :name="option.label"
            :data-cy="`checkbox-table-filter-${option.value}`"
            @click.stop
          >
            {{ option.label }}
          </m-m-checkbox>
        </div>
        <m-m-divider />
        <div
          class="mm-px-8 mm-py-4 mm-flex mm-flex-justify-between mm-flex-gap-8"
        >
          <m-m-button
            variant="elevated"
            size="small"
            cy="button-apply-filters"
            @click.stop="applyFilter"
            >Apply</m-m-button
          >
          <m-m-button variant="outlined" size="small" @click.stop="clearFilter"
            >Clear</m-m-button
          >
        </div>
      </template>
    </m-m-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.mm-table-header-cell {
  .column-filter {
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;

    &:hover,
    &.active {
      background: #f3f4f6;
    }

    &-items {
      font-variant-ligatures: none;
    }
  }

  &--icon {
    cursor: pointer;
    transition: transform 0.3s;
    &-disabled {
      opacity: 0.5;
      margin-right: 4px;
    }
  }

  &--icon-focused {
    cursor: pointer;
    transition: transform 0.3s;
    transform: rotate(180deg);
  }
}
</style>
