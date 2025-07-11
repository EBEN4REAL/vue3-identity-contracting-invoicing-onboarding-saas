<script setup lang="ts">
import { PropType } from "vue";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { PaymentIntentRead } from "~/billing_and_invoicing/billing_and_invoicing.types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { convertToMainUnit } from "~/mm_ui_kit/src/helpers/priceUnitConverter";
defineProps({
  payments: {
    type: Object as PropType<TableResponse<PaymentIntentRead>>,
    default: () => {},
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-params"]);
const paymentStatus = (row: PaymentIntentRead) => ({
  label: row.succeeded ? "Succeeded" : "Failed",
  badgeType: row.succeeded ? "Active" : "Inactive",
});
const emptyState: EmptyStateType = {
  icon: sectionIcons["licenses"],
  title: "No payments available",
};
const headers = [
  {
    key: "payment_id",
    label: "Payment ID",
    sortable: false,
  },
  {
    key: "payment_method",
    label: "Payment method",
    sortable: false,
  },
  {
    key: "status",
    label: "Payment status",
    sortable: false,
  },
  {
    key: "amount",
    label: "Amount",
    sortable: false,
  },
  {
    key: "date",
    label: "Payment date",
    sortable: false,
  },
];

const handleUpdateParams = (params: TableRequestParams) => {
  emit("update-params", params);
};
</script>

<template>
  <m-m-expandable-card title="Payments" cy="payments-expandable">
    <m-m-table
      cy="payments-table"
      :headers="headers"
      :is-loading="isLoading"
      :rows="payments?.results"
      :total-rows="payments?.total"
      :empty-state="emptyState"
      @update-params="handleUpdateParams"
    >
      <template #payment_id="{ row }">
        <m-m-text-ellipsis
          max-width="200px"
          :data-cy="`payment-id-column-${row.id}`"
          >{{ row.id }}
        </m-m-text-ellipsis>
      </template>
      <template #status="{ row }">
        <m-m-badge
          :status="BadgeTypes[paymentStatus(row).badgeType]"
          :text="paymentStatus(row).label"
        />
      </template>
      <template #date="{ row }">
        <m-m-formatted-date :raw-date="row.date" />
      </template>
      <template #amount="{ row }">
        <span>{{
          convertToMainUnit(Number(row.amount), row.currency).formatted
        }}</span>
      </template>
    </m-m-table>
  </m-m-expandable-card>
</template>

<style scoped></style>
