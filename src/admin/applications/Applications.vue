<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { OAuthClientRead } from "~/admin/applications/applications.types";
import { applicationsService } from "~/admin/applications/applications.service";

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
  {
    key: "service_provider",
    label: "Service Provider",
  },
  {
    key: "onboarded_users_count",
    label: "# Users Onboarded",
  },
  {
    key: "onboarded_organizations_count",
    label: "# Organizations Onboarded",
  },
];

const isLoading: Ref<boolean> = ref(true);
const applications: Ref<TableResponse<OAuthClientRead> | null> = ref(null);

const getApplications = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    applications.value = await applicationsService.getApplications(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting applications",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getApplications();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_applications"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="applications?.results"
      :total-rows="applications?.total"
      show-search
      cy="table-applications"
      @update-params="getApplications"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/admin/applications/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #service_provider="{ row }">
        {{ row.service_provider.name }}
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>
