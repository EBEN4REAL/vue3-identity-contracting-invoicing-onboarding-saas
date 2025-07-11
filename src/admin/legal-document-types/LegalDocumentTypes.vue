<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import {
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { legalDocumentTypesService } from "~/admin/legal-document-types/legal-document-types.service";
import { LegalDocumentTypeRead } from "~/organizations/licenses/legal-documents.types";

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
    key: "created_date",
    label: "Created Date",
  },
];

const isLoading: Ref<boolean> = ref(false);
const legalDocumentTypes: Ref<TableResponse<LegalDocumentTypeRead> | null> =
  ref(null);

const getLegalDocumentTypes = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    legalDocumentTypes.value =
      await legalDocumentTypesService.getLegalDocumentTypes(
        params || { limit: "10", offset: "0" },
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error getting legal document types",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getLegalDocumentTypes();
});
</script>

<template>
  <m-m-overview-page
    resource-id="admin_legal_document_types"
    :show-config-banner="false"
  >
    <m-m-table
      :is-loading="isLoading"
      :headers="headers"
      :rows="legalDocumentTypes?.results"
      :total-rows="legalDocumentTypes?.total"
      show-search
      cy="table-legal-document-types"
      @update-params="getLegalDocumentTypes"
    >
      <template #name="{ row }">
        <m-m-link
          :to="`/sc/admin/legal-document-types/${row.id}`"
          font-weigth="500"
        >
          {{ row.name }}
        </m-m-link>
      </template>
      <template #created_date="{ row }">
        <m-m-formatted-date
          :raw-date="row.created_date"
          format="D MMM YYYY, HH:mm"
        />
      </template>
    </m-m-table>
  </m-m-overview-page>
</template>

<style scoped lang="scss"></style>
