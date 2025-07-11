<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { PolicyReadWithOwnerName } from "~/policies/policies.types";
import { policiesService } from "~/admin/policies/policies.service";

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "service_provider",
    label: "Service Provider",
  },
  {
    key: "valid_from",
    label: "Valid From",
  },
  {
    key: "valid_until",
    label: "Valid Until",
  },
];

const isLoading: Ref<boolean> = ref(false);
const policies: Ref<TableResponse<PolicyReadWithOwnerName> | null> = ref(null);

const getPolicies = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    policies.value = await policiesService.getPolicies(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting policies",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getPolicies();
});
</script>

<template>
  <m-m-overview-page resource-id="admin_policies" :show-config-banner="false">
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="policies?.results"
      :total-rows="policies?.total"
      show-search
      cy="table-policies"
      @update-params="getPolicies"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/admin/policies/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #service_provider="{ row }">
        {{ row.owner_name }}
      </template>
      <template #valid_from="{ row }">
        <m-m-formatted-date
          :raw-date="row.valid_from"
          format="D MMM YYYY, HH:mm"
        />
      </template>
      <template #valid_until="{ row }">
        <m-m-formatted-date
          :raw-date="row.valid_until"
          format="D MMM YYYY, HH:mm"
        />
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>

<style scoped lang="scss"></style>
