<script setup lang="ts">
import { computed, onMounted, PropType, ref } from "vue";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import tableHeaders from "./TableHeaders";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { AuditEventRead } from "~/iam/iam.types";
import { FormattedAuditEvent } from "~/audit-events/audit-events.types";
import PayloadDialog from "../../Dialogs/EventPayloadDialog.vue";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";

const props = defineProps({
  auditEvents: {
    type: Object as PropType<TableResponse<AuditEventRead>>,
    default: null,
  },
  isLoading: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emptyState: EmptyStateType = {
  icon: sectionIcons["logs"],
  title: "No audit entries.",
  description:
    "Any changes made to your configuration or settings in Veriam customer portal will display here.",
};

const emit = defineEmits(["update"]);

const selectedRow = ref<FormattedAuditEvent | null>(null);
const showPayloadDialog = ref(false);

const initialQueryParams = ref<TableRequestParams>({
  limit: ITEMS_PER_PAGE[0],
  offset: "0",
});

const handleUpdateParams = (params: TableRequestParams) => {
  emit("update", {
    ...initialQueryParams.value,
    ...params,
  });
};

onMounted(() => {
  emit("update", initialQueryParams.value);
});

const formattedAuditEvents = computed<FormattedAuditEvent[]>(() => {
  return (
    props.auditEvents?.results?.map((event) => ({
      ...event,
      user: event?.user_name ?? "-",
      type: event?.resource?.type,
      hasPayload: event?.payload && Object.keys(event?.payload).length > 0,
    })) || []
  );
});

const openDialog = (row: FormattedAuditEvent) => {
  selectedRow.value = row;
  showPayloadDialog.value = true;
};

const closeDialog = () => {
  selectedRow.value = null;
  showPayloadDialog.value = false;
};
</script>

<template>
  <section class="tabs-content">
    <p class="mm-mt-3 mm-mb-12 mm-page-subtitle mm-page-subtitle--h2">
      Audit entries are all changes made to your team and access settings in
      Veriam.
    </p>
    <m-m-table
      cy="organization-audits-events-table"
      :is-loading="isLoading"
      :rows="formattedAuditEvents"
      :headers="tableHeaders"
      :total-rows="props.auditEvents?.total"
      :empty-state="emptyState"
      @update-params="handleUpdateParams"
    >
      <template #date="{ row }">
        <m-m-formatted-date :raw-date="row.date" format="D MMM YYYY, HH:mm" />
      </template>
      <template #user="{ row }">
        {{ row.user }}
      </template>
      <template #payload="{ row }">
        <m-m-icon
          v-if="row.hasPayload"
          class="cursor-pointer"
          icon="eye"
          width="16px"
          :data-cy="`event-log-table-eye-btn-${row.id}`"
          @click="openDialog(row)"
        />
        <span v-else>-</span>
      </template>
    </m-m-table>
    <payload-dialog
      :is-open="showPayloadDialog"
      :event="selectedRow"
      @close="closeDialog"
    />
  </section>
</template>
