<script lang="ts" setup>
import {
  PropType,
  ref,
  Ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  ComputedRef,
  useSlots,
} from "vue";
import { useRouter, useRoute, LocationQueryRaw } from "vue-router";
import { debounce } from "lodash";
import { ITEMS_PER_PAGE } from "../../../../common/constants";
import {
  TableHeader,
  TableRow,
  TableSort,
  TablePagination,
  EmptyStateType,
} from "../../types/table.types";
import { handleSortAscDescToggle } from "../../helpers/utils";
import draggable from "vuedraggable";

const props = defineProps({
  headers: {
    type: Array as PropType<TableHeader[]>,
    default: () => [],
  },
  rows: {
    type: Array as PropType<TableRow[]>,
    default: () => [],
  },
  totalRows: {
    type: Number as PropType<number | null>,
    default: 0,
  },
  cy: {
    type: String,
    default: "table",
  },
  emptyState: {
    type: [Object, String] as PropType<EmptyStateType | string>,
    default: () => ({}),
  },
  description: { type: String, default: "" },
  showSearch: { type: Boolean, default: false },
  isRouteUpdated: {
    type: Boolean,
    default: false,
  },
  hideEmptyStateSubtitle: {
    type: Boolean,
    default: false,
  },
  isInset: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: String,
    default: "",
  },
  isDraggable: {
    type: Boolean,
    default: false,
  },
});
// Endpoint params
const emit = defineEmits(["updateParams", "updatedItems"]);
const slots = useSlots();
const searchQuery: Ref<string> = ref("");
const debouncedSearchQuery: Ref<string> = ref("");
const isResetPage: Ref<boolean> = ref(false);
const router = useRouter();
const route = useRoute();
const headerItems = ref<TableHeader[]>([]);
const itemToSort = ref<string | null>(null);
const rowsItems = ref<TableRow[]>([]);
const emptyStateDefaults: ComputedRef<EmptyStateType> = computed(() => {
  const isSearchActive = debouncedSearchQuery.value.length > 0;

  return {
    icon: isSearchActive
      ? "magnify-big"
      : props.emptyState?.icon || "magnify-big",
    title: isSearchActive
      ? "No results found"
      : props.emptyState?.title || "No results found",
    description: !isSearchActive ? props.emptyState?.description : "",
    learnMoreHref: !isSearchActive ? props.emptyState?.learnMoreHref : "",
  };
});

const displayEmptyStateButton = computed(
  () => !!slots["empty-state-button"] && !debouncedSearchQuery.value.length,
);
const sortOptions = computed<TableSort[]>(() => {
  return headerItems.value
    .filter((header) => header.sortable)
    .map((header) => ({
      key: header.key,
      title: header.sortLabel || header.label,
      value: header.sortName
        ? header.sortName + (header.order ? `:${header.order}` : "")
        : header.key + (header.order ? `:${header.order}` : ""),
      sortValue: header.order,
    }));
});

const tableRowClassList = (row) => [{ "mm-opacity-40": Boolean(row?.hidden) }];

const showHeader: ComputedRef<boolean> = computed(
  () => props.showSearch || !!slots.action || props.description.length > 0,
);
const showSearchInput: ComputedRef<boolean> = computed(() => props.showSearch);
const sortOption: ComputedRef<string> = computed(() => {
  const toSort = sortOptions.value.find(
    (option) => option.key === itemToSort.value,
  )?.value;
  if (toSort) {
    return toSort;
  } else {
    return sortOptions.value.length ? sortOptions.value[0].value : "";
  }
});
const showSort: ComputedRef<boolean> = computed(
  () =>
    sortOptions.value.length > 0 &&
    props.rows.length > 0 &&
    headerItems.value.every((header) => header.sortIcon == undefined),
);

const headerWidthClass = (header: TableHeader) => {
  if (header.width) {
    const widthPercentage = parseInt(header.width.replace("%", ""));
    return `mm-table-header-cell-${widthPercentage}`;
  }
  return "";
};
const isSimpleEmptyState: ComputedRef<boolean> = computed(
  () => typeof props.emptyState === "string",
);
const emptyStateClass: ComputedRef<string> = computed(() =>
  isSimpleEmptyState.value
    ? "simple-mm-table-empty-state"
    : "mm-table-empty-state",
);
const tableHeaderFlexDirection: ComputedRef<string> = computed(() =>
  (props.showSearch || showSort.value) && props.description.length > 0
    ? "column"
    : "row",
);

const pagination: Ref<TablePagination> = ref({
  limit: (route.query?.limit ?? ITEMS_PER_PAGE[0]) as string,
  offset: (route.query?.offset ?? "0") as string,
});

const paginationVisible = computed(() => {
  return props.totalRows && props.totalRows > Number(ITEMS_PER_PAGE[0]);
});

const filterBy: Ref<Record<string, string[]>> = ref({});

const handleUpdateFilter = (filter: Record<string, string[]>) => {
  filterBy.value = { ...filterBy.value, ...filter };
};

const handleUpdateSort = (name: string) => {
  headerItems.value = headerItems.value.map((item) => {
    if (item.sortable && name === item.key) {
      item.order = handleSortAscDescToggle(item.order);
    }
    return item;
  });
  itemToSort.value = name;
};

// Update endpoint params on search, sort, pagination or filters change
watch(
  () => props.headers,
  () => {
    headerItems.value = props.headers;
    itemToSort.value = headerItems.value
      .filter((item) => item.defaultSortItem)
      .map((item) => item.key)[0];
  },
  { immediate: true },
);

watch(
  () => props.rows && props.rows.length,
  () => {
    rowsItems.value = props.rows;
  },
  { immediate: true },
);

watch(
  [searchQuery, sortOption, pagination, filterBy],
  debounce((newValues, oldValues) => {
    const [newSearchQuery, newSortOption, newPagination, newFilterBy] =
      newValues;
    const [oldSearchQuery] = oldValues;

    // format endpoint filter params if array
    const filterParams: Record<string, string | string[]> = {};
    debouncedSearchQuery.value = newSearchQuery;

    for (const key in newFilterBy) {
      filterParams[key] = newFilterBy[key];
    }

    const params: LocationQueryRaw = {
      ...newPagination,
      ...filterParams,
    };

    if (newSearchQuery) params.query = newSearchQuery;
    if (newSortOption) params.sort = newSortOption;

    isResetPage.value = newSearchQuery !== oldSearchQuery;
    if (isResetPage.value) {
      params.offset = 0;
    }

    if (props.isRouteUpdated) {
      router.push({ query: params });
    }

    emit("updateParams", params);
  }, 400),
);

// Sticky actions on table scroll
const tableBody: Ref<HTMLDivElement | null> = ref(null);

const hasHorizontalScroll: Ref<boolean> = ref(false);

const checkForScrollbar = () => {
  if (tableBody.value) {
    hasHorizontalScroll.value =
      tableBody.value.scrollWidth > tableBody.value.clientWidth;
  }
};

const isEmpty: ComputedRef<boolean> = computed(
  () => !props.rows?.length && props.totalRows !== null && !props.isLoading,
);

const displayTableRows: ComputedRef<boolean> = computed(
  () => props.rows?.length > 0,
);

const tableContentClassList: ComputedRef<(string | Record<string, boolean>)[]> =
  computed(() => [
    "mm-table-content",
    {
      "has-scroll":
        Boolean(hasHorizontalScroll.value) && rowsItems.value.length > 0,
      inset: Boolean(props.isInset),
      "mm-table-content-empty": isEmpty.value,
    },
  ]);

const updateItems = () => {
  emit("updatedItems", rowsItems.value);
};

const activeSort = (header: { key: string | null }) =>
  Boolean(
    itemToSort.value === header.key ||
      (itemToSort.value === undefined &&
        sortOptions.value.length &&
        sortOptions.value[0].key === header.key),
  );

onMounted(() => {
  // Check for scrollbar initially
  checkForScrollbar();

  // Check for scrollbar whenever the window is resized
  window.addEventListener("resize", checkForScrollbar);

  // format endpoint filter params if array
  const filterParams: Record<string, string | string[]> = {};

  for (const key in filterBy.value) {
    filterParams[key] = filterBy.value[key];
  }
  const params: LocationQueryRaw = {
    ...pagination.value,
    ...filterParams,
  };

  if (searchQuery.value) params.query = searchQuery.value;
  if (sortOption.value) params.sort = sortOption.value;

  if (props.isRouteUpdated) {
    router.push({ query: params });
  }

  emit("updateParams", params);
});

onUnmounted(() => {
  // Clean up the event listener
  window.removeEventListener("resize", checkForScrollbar);
});
</script>

<template>
  <div class="mm-table" :data-cy="cy">
    <div v-if="showHeader" class="mm-table-header">
      <div
        v-if="description.length"
        class="mm-page-subtitle mm-page-subtitle--h2 mm-flex-align-center mm-table-header-description mm-w-7"
        data-cy="page-subtitle"
      >
        {{ description }}
      </div>
      <div
        v-if="!!slots.action || showSearchInput || showSort"
        class="mm-table-header-filters-container mm-w-10"
      >
        <div class="mm-table-header-filters">
          <m-m-input
            v-if="showSearchInput"
            v-model="searchQuery"
            is-table-control
            placeholder="Search"
            cy="filter"
            width="224px"
            height="32px"
            icon-prepended="search-magnify"
            clear-button="x-circle"
          />
          <m-m-select
            v-if="showSort"
            v-model="sortOption"
            prepend-label
            is-table-control
            cy="sort"
            :data-select-value="sortOption"
            :items="sortOptions"
            label="Sort:"
            label-left
            @update:model-value="handleUpdateSort"
          ></m-m-select>
        </div>
        <div class="mm-table-header-action">
          <slot name="action" />
        </div>
      </div>
    </div>
    <div ref="tableBody" :class="tableContentClassList">
      <table>
        <thead>
          <tr>
            <th
              v-for="header in headerItems"
              :key="header.key"
              :class="[
                { 'mm-table-actions-cell': header.key === 'actions' },
                headerWidthClass(header),
              ]"
            >
              <m-m-table-header-cell
                :sort-icon="header.sortIcon"
                :label="header.label"
                :name="header.key"
                :order="header.order"
                :active-order="activeSort(header)"
                :filter="header.filter"
                :row-items="props.rows"
                @update-filter="handleUpdateFilter"
                @update-sort="handleUpdateSort"
              />
            </th>
          </tr>
        </thead>

        <template v-if="isLoading">
          <tbody>
            <tr
              v-for="(_, i) in parseInt(pagination.limit)"
              :key="i"
              :data-cy="`loading-row-${i}`"
              class="loading-state-row"
            >
              <td
                v-for="header in headerItems"
                :key="`${i}_${header.key}`"
                :class="[
                  header.cellClass,
                  { 'mm-table-actions-cell': header.key === 'actions' },
                  'skeleton-loader-wrapper',
                ]"
                :data-cy="header.key"
              >
                <m-m-skeleton-loader />
              </td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-if="isDraggable && displayTableRows">
            <draggable
              v-model="rowsItems"
              item-key="id"
              class="draggable-table"
              @change="updateItems"
            >
              <template #item="{ element, i }">
                <tr>
                  <td
                    v-for="header in headerItems"
                    :key="`${i}_${header.key}`"
                    :class="[
                      header.cellClass,
                      { 'mm-table-actions-cell': header.key === 'actions' },
                    ]"
                    :data-cy="header.key"
                  >
                    <slot :name="header.key" :row="element" />
                    <template v-if="!$slots[header.key]">
                      {{ element[header.key] }}
                    </template>
                  </td>
                </tr>
              </template>
            </draggable>
          </tbody>
          <tbody v-else-if="rows.length">
            <tr
              v-for="(row, i) in rows"
              :key="i"
              :data-cy="`row-${i}`"
              :class="tableRowClassList(row)"
            >
              <td
                v-for="header in headerItems"
                :key="`${i}_${header.key}`"
                :class="[
                  header.cellClass,
                  { 'mm-table-actions-cell': header.key === 'actions' },
                ]"
                :data-cy="header.key"
              >
                <slot :name="header.key" :row="row" />
                <template v-if="!$slots[header.key]">
                  {{ row[header.key] }}
                </template>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
      <m-m-table-pagination
        v-if="paginationVisible && rows.length"
        v-model="pagination"
        :no-of-results="totalRows"
        :is-reset-page="isResetPage"
      />
    </div>
    <div v-if="isEmpty" :class="emptyStateClass" data-cy="table-empty-state">
      <div
        v-if="isSimpleEmptyState"
        class="mm-page-title--h4 mm-fw-600"
        data-cy="empty-state-title"
      >
        {{ emptyState }}
      </div>
      <div
        v-else
        class="empty-state-content mm-flex mm-flex-column mm-flex-align-center mm-mx-auto"
      >
        <div class="empty-state-icon mm-pa-6 mm-mb-8">
          <slot name="empty-state-icon">
            <m-m-icon :icon="emptyStateDefaults.icon" stroke="#072E51" />
          </slot>
        </div>
        <div class="mm-page-title--h3 mm-fw-600" data-cy="empty-state-title">
          <slot name="empty-state-title">{{ emptyStateDefaults.title }}</slot>
        </div>
        <div
          v-if="!hideEmptyStateSubtitle"
          class="mm-page-subtitle--h2"
          data-cy="empty-state-subtitle"
        >
          {{ emptyStateDefaults.description }}
        </div>
        <m-m-link
          v-if="emptyStateDefaults.learnMoreHref"
          class="empty-state-learn-more-link"
          :href="emptyStateDefaults.learnMoreHref"
          target="_blank"
        >
          Learn more</m-m-link
        >
        <div v-if="displayEmptyStateButton" class="mm-mt-12">
          <slot name="empty-state-button" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$widths_coefficient: 1%;
$widths_iterations: 100;
@for $i from 1 through $widths_iterations {
  $value: $widths_coefficient * $i;
  .mm-table-header-cell-#{$i} {
    width: $value;
  }
}
.mm-table {
  &-header {
    flex-direction: v-bind(tableHeaderFlexDirection);
    margin-bottom: 16px;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    &-action {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      align-self: center;
    }
    &-filters,
    &-filters-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    &-description {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    &-title {
      font-size: 20px;
      font-weight: 600;
      line-height: 30px;
      width: max-content;
      text-align: left;
    }
  }

  &-content {
    border: 1px solid var(--Gray-200, #eaecf0);
    border-radius: 12px;
    overflow-x: auto;
    position: relative;

    &.inset {
      border: none;
      box-shadow: none;
      border-radius: 0;

      table {
        border: none;
        border-radius: 0;
        background: transparent;
      }

      td,
      th {
        border-radius: 0;

        &:first-child {
          border-left: none;
        }

        &:last-child {
          border-right: none;
        }
      }

      td {
        background: transparent;
      }
    }
    &:has(.mm-table-pagination) tr:last-child td {
      border-bottom: 1px solid var(--Gray-200, #eaecf0);
    }

    &.has-scroll {
      .mm-table-actions-cell:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        box-shadow: -3px 0px 4px 0px #ebebeb;
        width: 10px;
      }
    }

    &-empty {
      border-radius: 12px 12px 0 0;

      table {
        thead {
          .mm-table-actions-cell {
            display: none;
          }

          th {
            border-bottom: none;
          }
        }
      }
    }
  }

  table {
    margin: 0;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 10px;
    background: #fff;
    text-align: left;

    tr {
      position: relative;
      transform: scale(1);

      td {
        background: #fff;
        border-bottom: 1px solid var(--Gray-200, #eaecf0);
      }

      &:has(.mm-dropdown-active) td {
        background: #f8f9fa;
      }

      &:last-child td {
        border-bottom: none;
      }
    }

    td {
      padding: 6px 24px;
      color: var(--Gray-600, #475467);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 26px;
      height: 40px;
      @media (max-width: $breakpoint-md) {
        padding: 6px 12px;
      }

      &.action-dropdown {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;

        :slotted(.mm-dropdown) {
          position: fixed;
          right: 24px;
        }
      }
    }

    th {
      border-bottom: 1px solid var(--Gray-200, #eaecf0);
      padding: 12px 24px;
      background: var(--Gray-25, #fcfcfd);
      color: var(--Gray-600, #475467);
      /* Text xs/Medium */
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 18px;
    }

    .mm-table-actions-cell {
      text-align: right;
      width: 20px;
      position: sticky;
      right: 0;
      top: 0;

      :deep(.mm-button) {
        padding: 0;
      }
    }
    .skeleton-loader-wrapper {
      min-width: 100px;

      :deep(.mm-skeleton-loader) {
        vertical-align: middle;
      }
    }
  }

  .draggable-table {
    display: contents;
  }
}

.simple-mm-table-empty-state {
  padding: 10px 16px;
  text-align: center;
  background-color: white;
  border-radius: 0 0 12px 12px;
  border: 1px solid var(--Gray-200, #eaecf0);
  border-top: none;
  color: #384250;
}

.mm-table-empty-state {
  padding: 40px 16px;
  text-align: center;
  background-color: white;
  border: 1px solid var(--Gray-200, #eaecf0);
  border-top: none;

  .empty-state {
    &-content {
      max-width: 340px;
    }

    &-icon {
      border: 1px solid #98a2b3;
      border-radius: 10px;
    }
    &-learn-more-link {
      text-decoration: underline;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      text-align: center;
      color: #475467;
    }
  }
}
</style>
