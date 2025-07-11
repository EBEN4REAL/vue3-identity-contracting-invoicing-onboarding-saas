<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { policyTypesService } from "~/admin/policy-types/policy-types.service";
import { PolicyTypeWithServiceProviderRead } from "~/policies/policies.types";

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
];

const isLoading: Ref<boolean> = ref(false);
const policyTypes: Ref<TableResponse<PolicyTypeWithServiceProviderRead> | null> =
  ref(null);

const getPolicyTypes = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    policyTypes.value = await policyTypesService.getPolicyTypes(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting policy types",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getPolicyTypes();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_policy_types"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="policyTypes?.results"
      :total-rows="policyTypes?.total"
      show-search
      cy="table-policy-types"
      @update-params="getPolicyTypes"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/admin/policy-types/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #service_provider="{ row }">
        {{ row.service_provider?.name }}
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>

<style scoped lang="scss"></style>
