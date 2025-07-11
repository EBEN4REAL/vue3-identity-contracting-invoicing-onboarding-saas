<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import {
  AccessEvaluationRead,
  AgreementReadIAM,
  PolicyReadIAM,
} from "~/iam/iam.types";
import { accessEvaluationsService } from "~/access-logs/access-logs.service";
import { authService } from "~/auth/auth.service";
import { useRoute } from "vue-router";
import { TypeAccessLogDetailsItem } from "~/logs/OrganizationLogs/Tabs/AccessLog/types";
import outcome from "~/logs/outcome";
import { TableHeader } from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const route = useRoute();

const tableHeaders: TableHeader[] = [
  {
    key: "policy",
    label: "Policy",
  },
  {
    key: "agreement",
    label: "Agreement",
  },
  {
    key: "outcome",
    label: "Result",
  },
];

const accessEvaluation: Ref<AccessEvaluationRead | null> = ref(null);
const isLoading: Ref<boolean> = ref(false);

const details: ComputedRef<TypeAccessLogDetailsItem[]> = computed(() => [
  {
    label: "Application",
    value: accessEvaluation.value?.oauth_client?.name || "-",
  },
  {
    label: "Resource",
    value: accessEvaluation.value?.resource_urn || "-",
  },
  {
    label: "User",
    value: accessEvaluation.value?.user?.email || "-",
  },
  {
    label: "Date/Time",
    value: "formattedDate",
  },
  {
    label: "Result",
    value: accessEvaluation.value
      ? outcome(accessEvaluation.value?.outcome)
      : "-",
  },
]);

const isDetailFormattedDate = (detail: string): boolean =>
  detail === "formattedDate";

const preparePolicyCellInTable = (policyRaw: PolicyReadIAM) =>
  policyRaw?.type.name || "-";

const prepareAgreementCellInTable = (agreementRaw: AgreementReadIAM) =>
  agreementRaw?.type.name || "-";

const getAccessEvaluation = async (organization_id: string) => {
  try {
    isLoading.value = true;

    accessEvaluation.value =
      await accessEvaluationsService.getOrganizationAccessEvaluation(
        organization_id,
        route.params.id.toString(),
      );
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch access evaluation",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const profile = await authService.getProfile();

  if (profile?.org) {
    await getAccessEvaluation(profile?.org.toString());
  }
});
</script>

<template>
  <m-m-teleport to="common-page-layout-header-title">
    Access detail
  </m-m-teleport>
  <m-m-teleport to="common-page-layout-header-subtitle">Details</m-m-teleport>
  <div v-for="(detail, index) in details" :key="index" class="mm-flex">
    <div
      class="details--title mm-px-2 mm-py-8"
      :data-cy="`detail-label-${detail.label}`"
    >
      {{ detail.label }}
    </div>
    <div
      class="details--value mm-fw-400 mm-px-12 mm-py-8"
      :data-cy="`detail-value-${detail.label}`"
    >
      <template v-if="isDetailFormattedDate(detail.value)">
        <m-m-formatted-date
          :raw-date="accessEvaluation?.evaluation_date"
          format="D MMM YYYY, HH:mm"
          :utc-offset="0"
        />
      </template>
      <template v-else>
        {{ detail.value }}
      </template>
    </div>
  </div>

  <m-m-table
    cy="table-access-logs-details"
    :is-loading="isLoading"
    :rows="accessEvaluation?.lines"
    :headers="tableHeaders"
    class="mt-12"
  >
    <template #policy="{ row }">
      {{ preparePolicyCellInTable(row.policy) }}
    </template>
    <template #agreement="{ row }">
      {{ prepareAgreementCellInTable(row.agreement) }}
    </template>
    <template #outcome="{ row }">
      {{ outcome(row.outcome) }}
    </template>
  </m-m-table>
</template>

<style scoped lang="scss">
.details {
  &--title {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-align: left;
    color: #101828;
    min-width: 200px;
  }

  &--value {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: #475467;
  }
}
</style>
