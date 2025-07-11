<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { wizardTypesService } from "~/admin/wizard-types/wizard-types.service";
import { WizardTypeRead } from "~/configuration/configuration.types";

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
  {
    key: "path",
    label: "Path",
  },
];

const isLoading: Ref<boolean> = ref(false);
const wizardTypes: Ref<TableResponse<WizardTypeRead> | null> = ref(null);

const getWizardTypes = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    wizardTypes.value = await wizardTypesService.getWizardTypes(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting wizard types",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getWizardTypes();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_wizard_types"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="wizardTypes?.results"
      :total-rows="wizardTypes?.total"
      show-search
      cy="table-wizard-types"
      @update-params="getWizardTypes"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/admin/wizard-types/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>

<style scoped lang="scss"></style>
