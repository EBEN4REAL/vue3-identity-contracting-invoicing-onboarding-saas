<script setup lang="ts">
import { onMounted, PropType, Ref, ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { LegalDocumentTypeWithLegalDocumentRead } from "~/organizations/licenses/legal-documents.types";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import LogoSVG from "~/assets/images/veriam-logo.svg";
import { AgreementType } from "~/iam/iam.types";
import { legalDocumentsService } from "../legal-documents.service";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  selectedPlan: {
    type: Object as PropType<AgreementType>,
    required: true,
    default: () => {},
  },
  serviceConsumerId: {
    type: String,
    required: true,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);
const legalDocuments: Ref<TableResponse<LegalDocumentTypeWithLegalDocumentRead> | null> =
  ref(null);
const signedLegalDocuments = ref([]);
const isSubmitButtonDisabled = ref(true);
const isSubmitButtonLoading: Ref<boolean> = ref(false);
const downloadLink: Ref<HTMLAnchorElement | null> = ref(null);

// Fetch legal documents
const getLegalDocs = async () => {
  try {
    legalDocuments.value =
      await legalDocumentsService.getLegalDocumentTypesByAgreementTypeId(
        props.serviceConsumerId as string,
        props.selectedPlan.id,
        {
          fully_signed: false,
          limit: "50",
          offset: "0",
        },
      );
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to get legal documents",
      status: "error",
    });
  }
};

const handleCheckboxChange = () => {
  isSubmitButtonDisabled.value = !legalDocuments.value?.results.every((doc) =>
    signedLegalDocuments.value.includes(doc.legal_documents[0].id),
  );
};

// Fetch document pdf url
const pdfUrl = async (legal_document_type: string) => {
  try {
    const response = await legalDocumentsService.getLegalDocumentsForSigning(
      props.serviceConsumerId as string,
      legal_document_type,
    );
    if (response.pdf_url) {
      window.open(response.pdf_url, "_blank");
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to get pdf url",
      status: "error",
    });
  }
};

const onSubmit = async () => {
  isSubmitButtonLoading.value = true;
  try {
    const documentsIdList = legalDocuments.value?.results.map(
      (result) => result.legal_documents[0].id,
    );
    if (documentsIdList) {
      await legalDocumentsService.createLegalDocsSignature(
        props.serviceConsumerId,
        documentsIdList,
      );
    }
    emit("submit");
    emit("close");
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to submit legal documents",
      status: "error",
    });
  } finally {
    isSubmitButtonLoading.value = false;
  }
};

onMounted(async () => {
  await getLegalDocs();
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="rocket-launch"
    title="Almost done"
    subtitle="In order to use this license, you must agree to below terms of use"
    @close="emit('close')"
  >
    <div>
      <div class="mm-flex mm-flex-align-center mm-flex-gap-6">
        <img
          v-if="selectedPlan.logoSrc"
          class="mm-auth-view-logo"
          :src="selectedPlan.logoSrc"
          data-cy="brand-logo"
          alt="Logo"
        />
        <LogoSVG v-else class="logo" data-cy="default-logo" />
        <div class="mm-flex mm-flex-column mm-flex-gap-2">
          <div class="mm-page-title--h4 font-weight-500">
            {{ selectedPlan.name }}
          </div>
          <div class="mm-page-subtitle--h2">
            {{ selectedPlan.description }}
          </div>
        </div>
      </div>
      <div
        v-if="legalDocuments?.results"
        class="mm-mt-12 mm-pa-4 legal-documents"
      >
        <div
          v-for="(document, index) in legalDocuments.results"
          :key="index"
          class="activate-license-documents"
        >
          <m-m-checkbox
            v-model="signedLegalDocuments"
            :value="document.legal_documents[0].id"
            name="document_name"
            @change="handleCheckboxChange"
          >
            <span>I agree to the </span>
            <m-m-link
              :data-cy="`checkbox-link-${index}`"
              underline
              @click.prevent="
                pdfUrl(document.legal_documents[0].legal_document_type)
              "
            >
              {{ document.name }}
            </m-m-link>
            <a
              ref="downloadLink"
              class="hidden-link"
              download
              target="_blank"
            />
          </m-m-checkbox>
        </div>
      </div>
    </div>
    <template #footer>
      <m-m-button variant="outlined" @click="emit('close')">
        Cancel
      </m-m-button>
      <m-m-button
        :loading="isSubmitButtonLoading"
        :disabled="isSubmitButtonDisabled"
        @click="onSubmit"
      >
        Continue
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
.mm-page-subtitle--h2 {
  color: #6c737f;
}
.legal-documents {
  border: 1px solid #e6e8ec;
  border-radius: 12px;
}
.logo {
  width: 60px;
  height: 24px;
}
</style>
