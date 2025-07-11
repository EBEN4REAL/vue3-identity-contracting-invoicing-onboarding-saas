<script setup lang="ts">
import { PropType, Ref, ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import { legalDocumentsService } from "~/service-providers/legal-documents.service";
import { LegalDocumentTypeWithLegalDocumentRead } from "../../legal-documents.types";
import { policiesService } from "~/service-providers/policies.service";
import { LegalDocumentStatus } from "~/policies/policies.types";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  licenseId: {
    type: String,
    default: "",
  },
  serviceConsumerId: {
    type: String,
    default: "",
  },
  documents: {
    type: Object as PropType<TableResponse<LegalDocumentTypeWithLegalDocumentRead> | null>,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeDialog", "updateLicenses", "signatureCreated"]);
const isSubmitButtonLoading: Ref<boolean> = ref(false);
const documentItems = ref([]);
const isSubmitButtonDisabled: Ref<boolean> = ref(true);
const downloadLink = ref(null);

const onDialogClose = () => {
  emit("closeDialog");
};

const handleUpdate = () => {
  if (documentItems.value.length === props.documents?.total) {
    isSubmitButtonDisabled.value = false;
  } else {
    isSubmitButtonDisabled.value = true;
  }
};

const pdfUrl = async (legal_document_type: string) => {
  try {
    const response = await legalDocumentsService.getLegalDocumentsForSigning(
      props.serviceConsumerId,
      legal_document_type,
    );
    if (downloadLink.value) {
      downloadLink.value.href = response.pdf_url;
      if (downloadLink.value) downloadLink.value?.click();
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to download the document",
      status: "error",
    });
  }
};

const onSubmit = async () => {
  const legal_document_status: LegalDocumentStatus = "PROCESSING";

  try {
    isSubmitButtonLoading.value = true;
    const documentsIdList = props.documents?.results.flatMap((result) =>
      result.legal_documents.map((doc) => doc.id),
    );
    if (documentsIdList) {
      await legalDocumentsService.createLegalDocsSignature(
        props.serviceConsumerId,
        documentsIdList,
      );
    }
    emit("signatureCreated");
    try {
      await policiesService.updateLegalDocumentStatus(
        props.serviceConsumerId,
        props.licenseId,
        legal_document_status,
      );
    } catch (error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 400) {
        emit("updateLicenses");
      } else {
        throw error;
      }
    }
    isSubmitButtonLoading.value = false;
    emit("closeDialog");
    emit("updateLicenses");
  } catch (error) {
    isSubmitButtonLoading.value = false;
    eventBus.$emit("onShowToast", {
      text: "Failed to sign the document",
      status: "error",
    });
  }
};
</script>
<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Almost done"
    subtitle="In order to use this license, you must agree to below terms of use"
    icon="rocket-launch"
    cy="dialog-activate-license"
    @close="onDialogClose"
  >
    <template #default>
      <div v-if="isLoading"><m-m-skeleton-loader /></div>
      <div v-else class="activate-license-container">
        <div
          v-for="(document, index) in documents?.results"
          :key="index"
          class="activate-license-documents"
        >
          <m-m-checkbox
            v-model="documentItems"
            :value="document.id"
            name="document_name"
            :data-cy="`checkbox-document-${index}`"
            @update:model-value="handleUpdate"
          >
            I agree to the
            <m-m-link
              :data-cy="`checkbox-link-${index}`"
              :download="downloadLink"
              @click.prevent="pdfUrl(document.id)"
            >
              {{ document.name }}
            </m-m-link>
          </m-m-checkbox>
        </div>
      </div>
      <a ref="downloadLink" class="hidden-link" download target="_blank" />
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button
          cy="button-cancel-activate-license"
          variant="outlined"
          color="gray"
          @click="onDialogClose"
        >
          Cancel
        </m-m-button>
        <m-m-button
          cy="button-continue-activate-license"
          :loading="isSubmitButtonLoading"
          :disabled="isSubmitButtonDisabled"
          @click="onSubmit"
        >
          Continue
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>
<style scoped lang="scss">
.activate-license {
  &-container {
    background-color: #fafbfc;
    border-radius: 12px;
    padding: 24px;
    color: #4d5761;
  }

  &-documents {
    color: #4d5761;
    a {
      text-decoration: underline;
    }
  }

  &-documents:not(:first-child) {
    margin-top: 16px;
  }
}

.hidden-link {
  display: none;
}
</style>
