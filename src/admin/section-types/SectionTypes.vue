<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { sectionTypesService } from "~/admin/section-types/section-types.service";
import { SectionTypeRead } from "~/configuration/configuration.types";

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    order: "asc",
    sortIcon: true,
  },
];

const isLoading: Ref<boolean> = ref(false);
const sectionTypes: Ref<TableResponse<SectionTypeRead> | null> = ref(null);

const getSectionTypes = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    sectionTypes.value = await sectionTypesService.getSectionTypes(
      params || { limit: "10", offset: "0" },
    );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting section types",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getSectionTypes();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_section_types"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="sectionTypes?.results"
      :total-rows="sectionTypes?.total"
      show-search
      cy="table-section-types"
      @update-params="getSectionTypes"
    >
      <template #name="{ row }">
        <m-m-link :to="`/sc/admin/section-types/${row.id}`" font-weigth="500">
          {{ row.name }}
        </m-m-link>
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>
