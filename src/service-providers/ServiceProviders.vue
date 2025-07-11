<script setup lang="ts">
import { ref, Ref } from "vue";
import { PaginationSchema_ServiceProviderRead_ } from "~/iam/iam.types";
import { serviceProvidersService } from "~/service-providers/service-providers.service";
import {
  TableHeader,
  TableRequestParams,
} from "~/mm_ui_kit/src/types/table.types";
import { useRouter } from "vue-router";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const isLoading: Ref<boolean> = ref(true);
const serviceProviders: Ref<PaginationSchema_ServiceProviderRead_ | null> =
  ref(null);
const router = useRouter();
const getServiceProviders = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    serviceProviders.value =
      await serviceProvidersService.getServiceProviders(params);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error while fetching service providers",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
const handleUpdateParams = async (params?: TableRequestParams) => {
  await getServiceProviders(params);
};
const headers: TableHeader[] = [
  {
    key: "name",
    label: "Organization Name ",
    sortable: true,
    order: "asc",
    sortIcon: true,
    width: "30%",
  },
  {
    key: "organization_created_date",
    label: "Org created date",
    order: "desc",
    sortName: "organization.created_date",
    sortable: true,
    sortIcon: true,
  },
  {
    key: "created_date",
    label: "Became SP at date",
    sortable: true,
    sortIcon: true,
    order: "desc",
    defaultSortItem: true,
  },
  { key: "actions", label: "", sortable: false },
];
</script>

<template>
  <m-m-overview-page
    resource-id="admin_service_providers"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      cy="service-providers-table"
      :headers="headers"
      :rows="serviceProviders?.results || []"
      :total-rows="serviceProviders?.total || 0"
      show-search
      @update-params="handleUpdateParams"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/organizations/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
      <template #organization_created_date="{ row }">
        <m-m-formatted-date
          :raw-date="row.organization_created_date"
          format="D MMM YYYY, HH:mm"
        />
      </template>
      <template #created_date="{ row }">
        <m-m-formatted-date
          :raw-date="row.created_date"
          format="D MMM YYYY, HH:mm"
        />
      </template>

      <template #actions="{ row }">
        <div class="mm-flex mm-flex-justify-end">
          <m-m-dropdown
            list-side="left"
            :items="[
              {
                label: 'Edit',
                type: 'button',
                onClick: () => {
                  router.replace(`/sc/organizations/${row.id}`);
                },
              },
            ]"
            :cy="`actions-dropdown-${row.id}`"
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
      </template> </m-m-table
  ></m-m-overview-page>
</template>

<style scoped lang="scss">
.organization-header {
  max-width: 67%;
  display: flex;
  gap: 5px;
  flex-direction: column;
  margin-bottom: 10px;
  &-text {
    font-weight: 400;
  }
}
</style>
