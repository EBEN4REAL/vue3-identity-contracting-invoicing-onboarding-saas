<script setup lang="ts">
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { onMounted, ref, Ref } from "vue";
import { AgreementTypeWithServiceProviderRead } from "~/policies/policies.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { agreementTypesService } from "~/admin/agreement-types/agreement-types.service";

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    sortName: "agreement_type.name",
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
const agreementTypes: Ref<TableResponse<AgreementTypeWithServiceProviderRead> | null> =
  ref(null);

const getAgreementTypes = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    agreementTypes.value = await agreementTypesService.getAgreementTypes(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting agreement types",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getAgreementTypes();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_agreement_types"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="agreementTypes?.results"
      :total-rows="agreementTypes?.total"
      show-search
      cy="table-agreement-types"
      @update-params="getAgreementTypes"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/admin/agreement-types/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #service_provider="{ row }">
        {{ row.service_provider?.name }}
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>
