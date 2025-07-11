<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { WizardExtendedRead } from "~/configuration/configuration.types";
import { wizardsService } from "~/admin/wizards/wizards.service";

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "service_provider",
    label: "Service Provider",
  },
];

const isLoading: Ref<boolean> = ref(true);
const wizards: Ref<TableResponse<WizardExtendedRead> | null> = ref(null);

const getWizards = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    wizards.value = await wizardsService.getWizards(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting wizards",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getWizards();
});
</script>

<template>
  <m-m-overview-page resource-id="admin_wizards" :show-config-banner="false">
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="wizards?.results"
      :total-rows="wizards?.total"
      show-search
      cy="table-wizards"
      @update-params="getWizards"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/admin/wizards/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #type="{ row }">{{ row.type.name }}</template>
      <template #service_provider="{ row }"
        >{{ row.service_provider.name }}
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>

<style scoped lang="scss"></style>
