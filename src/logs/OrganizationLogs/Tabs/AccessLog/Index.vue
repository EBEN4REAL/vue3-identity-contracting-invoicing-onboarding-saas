<script setup lang="ts">
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { headers } from "./TableHeaders";
import { TypeAccessLogsItemForTable } from "~/logs/OrganizationLogs/Tabs/AccessLog/types";
import { AccessEvaluationBaseRead } from "~/iam/iam.types";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import outcome from "~/logs/outcome";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";

const props = defineProps({
  accessLogs: {
    type: Object as PropType<TableResponse<AccessEvaluationBaseRead>>,
    default: () => ({}),
  },
  isLoading: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emptyState: EmptyStateType = {
  icon: sectionIcons["logs"],
  title: "No access entries.",
  description:
    "When a user in your organization tries to log in to any application powered by Veriam it will display here.",
};

const emit = defineEmits(["update"]);

const initialQueryParams: Ref<TableRequestParams> = ref({
  limit: ITEMS_PER_PAGE[0],
  offset: "0",
});

const formattedRows: ComputedRef<TypeAccessLogsItemForTable[]> = computed(() =>
  props.accessLogs
    ? props.accessLogs.results.map(
        (accessLogsItem: AccessEvaluationBaseRead) => ({
          id: accessLogsItem.id,
          evaluation_date: accessLogsItem.evaluation_date || "-",
          user:
            `${accessLogsItem.user?.first_name} ${accessLogsItem.user?.last_name}` ||
            "-",
          service_provider: accessLogsItem.service_provider?.name || "-",
          oauth_client: accessLogsItem.oauth_client?.name || "-",
          outcome: accessLogsItem.outcome,
        }),
      )
    : [],
);

const handleUpdateParams = (params: TableRequestParams) => {
  emit("update", {
    ...initialQueryParams.value,
    ...params,
  });
};

const tableRowActionsDropdownItems = (id: string): TypeDropdownItem[] => [
  {
    label: "View Access Log",
    type: "link",
    to: `/sc/logs/${id}`,
  },
];

onMounted(() => {
  emit("update", initialQueryParams.value);
});
</script>

<template>
  <p class="mm-mt-3 mm-mb-12 mm-page-subtitle mm-page-subtitle--h2">
    All login attempts made by users for this organization to other services.
  </p>
  <m-m-table
    cy="table-access-logs"
    :is-loading="isLoading"
    :rows="formattedRows"
    :headers="headers"
    :total-rows="accessLogs?.total"
    show-search
    :empty-state="emptyState"
    @update-params="handleUpdateParams"
  >
    <template #evaluation_date="{ row }">
      <m-m-formatted-date
        :raw-date="row.evaluation_date"
        format="D MMM YYYY, HH:mm"
        :utc-offset="0"
      />
    </template>
    <template #outcome="{ row }">
      {{ outcome(row.outcome) }}
    </template>
    <template #actions="{ row }">
      <div class="mm-flex mm-flex-justify-end">
        <m-m-dropdown
          list-side="left"
          :cy="`actions-dropdown-${row.id}`"
          :items="tableRowActionsDropdownItems(row.id)"
        >
          <template #activator>
            <m-m-button
              prepend-icon="dots-vertical"
              variant="text"
              :cy="`actions-${row.id}`"
            />
          </template>
        </m-m-dropdown>
      </div>
    </template>
  </m-m-table>
</template>

<style scoped lang="scss"></style>
