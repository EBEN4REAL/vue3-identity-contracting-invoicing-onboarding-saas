<script setup lang="ts">
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { onMounted, ref, Ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { configsService } from "~/admin/configs/configs.service";
import { ConfigOverviewRead } from "~/configuration/configuration.types";

const headers: TableHeader[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "created_date",
    label: "Created On",
    sortable: true,
    order: "desc",
    sortIcon: true,
  },
  {
    key: "status_updated_date",
    label: "Status Updated On",
    sortable: true,
    sortIcon: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    sortIcon: true,
  },
  {
    key: "service_provider",
    label: "Service Provider",
  },
];

const isLoading: Ref<boolean> = ref(false);
const configs: Ref<TableResponse<ConfigOverviewRead> | null> = ref(null);

const getConfigs = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    configs.value = await configsService.getConfigs(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting configs",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getConfigs();
});
</script>

<template>
  <m-m-overview-page resource-id="admin_configs" :show-config-banner="false">
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="configs?.results"
      :total-rows="configs?.total"
      show-search
      cy="table-configs"
      @update-params="getConfigs"
    >
      <template #id="{ row }">
        <m-m-link :to="`/sc/admin/configs/${row.id}`" font-weigth="500">
          {{ row.id }}
        </m-m-link>
      </template>
      <template #created_date="{ row }">
        <m-m-formatted-date
          :raw-date="row.created_date"
          format="D MMM YYYY, HH:mm"
        />
      </template>
      <template #status_updated_date="{ row }">
        <m-m-formatted-date
          :raw-date="row.status_updated_date"
          format="D MMM YYYY, HH:mm"
        />
      </template>
      <template #service_provider="{ row }">
        {{ row.service_provider?.name }}
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>
