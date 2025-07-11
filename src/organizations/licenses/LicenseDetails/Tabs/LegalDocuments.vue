<script setup lang="ts">
import { PropType } from "vue";
import {
  EmptyStateType,
  TableHeader,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import {
  LegalDocumentTypeRead,
  LegalDocumentTypeWithLegalDocumentRead,
} from "../../legal-documents.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { legalDocumentsService } from "~/service-providers/legal-documents.service";

const props = defineProps({
  documents: {
    type: Object as PropType<TableResponse<LegalDocumentTypeWithLegalDocumentRead> | null>,
    required: true,
    default: () => {},
  },
  isLoading: {
    type: Boolean,
    required: true,
    default: false,
  },
  serviceConsumerId: {
    type: String,
    required: true,
    default: "",
  },
});
const documentName = (row: LegalDocumentTypeRead) => row.name || "-";
const emit = defineEmits(["updateParams"]);
const emptyState: EmptyStateType = {
  icon: sectionIcons["licenses"],
  title: "No signed legal documents",
};
const handleUpdateParams = (params: TableRequestParams) => {
  emit("updateParams", params);
};

const headers: TableHeader[] = [
  {
    key: "name",
    label: "Document name",
  },
  {
    key: "date_created",
    label: "Date created",
  },
  {
    key: "actions",
    label: "Legal documents",
  },
];

const fetchPDFUrl = async (id: string) => {
  try {
    if (!props.documents) return;
    const result = await legalDocumentsService.getLegalDocumentsForSigning(
      props.serviceConsumerId,
      id,
    );
    if (result.pdf_url) {
      window.open(result.pdf_url, "_blank");
    } else {
      eventBus.$emit("onShowToast", {
        text: "PDF URL not found",
        status: "error",
      });
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "There was an error while fetching pdf url",
      status: "error",
    });
  }
};
</script>
<template>
  <m-m-expandable-card title="Legal Documents" cy="legal-docs-expandable">
    <m-m-table
      show-search
      background-color="#F2F4F7"
      :is-loading="isLoading"
      :headers="headers"
      :rows="documents?.results"
      :total-rows="documents?.total"
      cy="legal-documents-table"
      :empty-state="emptyState"
      @update-params="handleUpdateParams"
    >
      <template #name="{ row }">
        <div class="name-column" :data-cy="`column-name-${row.id}`">
          {{ documentName(row) }}
        </div>
      </template>
      <template #date_created="{ row }">
        <m-m-formatted-date :raw-date="row.date_created as string" />
      </template>
      <template #actions="{ row }">
        <m-m-button
          variant="text"
          font-weigth="500"
          :data-cy="`column-name-${row.id}`"
          class="view-document-column"
          @click="() => fetchPDFUrl(row.id as string)"
        >
          View Document
        </m-m-button>
      </template>
    </m-m-table>
  </m-m-expandable-card>
</template>
<style scoped lang="scss">
.view-document-column {
  text-decoration: underline;
}
:deep(.mm-button) {
  font-size: 14px;
  &:hover {
    background-color: transparent;
    border-color: transparent;
  }
  &:active {
    outline: transparent;
  }
}
</style>
