<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from "vue";

const props = defineProps({
  cy: {
    type: String,
    default: "document-upload",
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  file: {
    type: File,
    default: null,
  },
  errors: {
    type: Array,
    default: () => [],
  },
  pdfUrl: { type: Object, default: () => {} },
  hasFileChanged: {
    type: Boolean,
    default: false,
  },
});

const isButtonUploadDisabled: ComputedRef<boolean> = computed(
  () => Boolean(docFile.value) || !props.isEditMode,
);

const classList = computed(() => {
  return [
    "doc-upload-button",
    { "file-added": docFile.value },
    { "doc-upload-button-error": errorMsg.value || props.errors.length },
    { "doc-upload-button-disabled": isButtonUploadDisabled.value },
  ];
});

const emit = defineEmits(["document-uploaded", "document-removed"]);
const errorMsg = ref("");
const docFile = ref<null | File>(props.file);
const fileInput = ref<HTMLInputElement | null>(null);
const downloadLink = ref<HTMLAnchorElement | null>(null);
const downloadUrl = ref(props.pdfUrl);
const isDragging = ref(false);

const uploadDocument = (): void => {
  if (fileInput.value) fileInput.value.click();
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files?.length) {
    handleFileChange({ target: { files } });
  }
};

const handleRemoveFile = () => {
  docFile.value = null;
  const fileElt = document.querySelector(
    "input[type=file]",
  ) as HTMLInputElement;
  if (fileElt) {
    fileElt.value = "";
  }
  emit("document-uploaded", docFile.value);
  emit("document-removed");
};

const handleDownloadFile = () => {
  if (downloadLink.value) downloadLink.value.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target?.files || (event as DragEvent).dataTransfer?.files;
  errorMsg.value = "";

  if (!files?.length) {
    return;
  }

  const file = files[0];

  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = "Please upload a file that's less than 2 MB";
    handleRemoveFile();
    return;
  }

  if (file.type !== "application/pdf") {
    errorMsg.value = "Please upload a PDF file";
    handleRemoveFile();
    return;
  }

  docFile.value = file;
  emit("document-uploaded", docFile.value);
};

const errorsFormatted = computed(() => [
  ...props.errors.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
  ...(errorMsg.value ? [{ validator: "", message: errorMsg.value }] : []),
]);

watch(
  () => props.pdfUrl,
  () => {
    downloadUrl.value = props.pdfUrl;
  },
);
</script>

<template>
  <div class="doc-upload">
    <div
      class="mm-flex mm-flex-gap-10"
      @dragover.prevent
      @dragleave.prevent
      @drop.prevent="handleDrop"
    >
      <button
        :class="classList"
        :disabled="isButtonUploadDisabled"
        @click="uploadDocument"
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
      >
        <template v-if="!docFile">
          <template v-if="isEditMode">
            <span class="mm-flex mm-flex-column mm-flex-align-center">
              <div class="doc-upload-icon">
                <m-m-icon icon="arrow-up-tray" />
              </div>
              <div>
                <span class="doc-upload-message">Click to Upload</span
                ><span class="font-weight-400"> or drag and drop</span>
              </div>
            </span>
            <span class="mm-page-item-label"> Supported formats: PDF </span>
          </template>
          <span v-else class="mm-page-title--h3">No document</span>
        </template>
        <div v-else class="mm-flex mm-flex-column mm-flex-align-center">
          <div class="doc-upload-icon"><m-m-icon icon="document-text" /></div>
          <span class="doc-upload-message" data-cy="doc-name">{{
            docFile.name
          }}</span>
          <span class="mm-page-item-label" data-cy="doc-size"
            >Size: {{ Math.round(docFile.size / 1000) }}KB</span
          >
          <div class="mm-flex mm-flex-gap-6">
            <m-m-button
              v-if="!isEditMode || (isEditMode && !hasFileChanged)"
              class="mm-mt-12 doc-upload-button-download"
              variant="tertiary"
              prepend-icon="arrow-down-tray"
              data-cy="button-download-file"
              @click.stop="handleDownloadFile"
            >
              <a
                id="download-button"
                ref="downloadLink"
                :href="downloadUrl?.pdf_url"
                target="_blank"
                :download="docFile.name"
              />
              Download
            </m-m-button>
            <m-m-button
              v-if="isEditMode"
              class="mm-mt-12 doc-upload-button-remove"
              variant="text-danger"
              prepend-icon="trash"
              data-cy="button-remove-file"
              min-width="125px"
              @click.stop="handleRemoveFile"
              >Remove</m-m-button
            >
          </div>
        </div>
      </button>
      <input
        ref="fileInput"
        :data-cy="cy"
        type="file"
        accept="application/pdf"
        class="doc-upload-input"
        :disabled="docFile ? true : false"
        @change="handleFileChange"
      />
    </div>
    <div
      v-for="error in errorsFormatted"
      :key="`${error.validator}-${error.message}`"
      class="doc-upload-error mm-mt-6"
      data-cy="error-message"
    >
      <m-m-icon icon="warning" width="16" height="16" />
      <div>{{ error.message }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.doc-upload {
  display: flex;
  flex-direction: column;
  width: 100%;

  a {
    display: none;
  }

  &-message {
    margin-top: 7px;
    color: #072e51;
  }

  &-icon {
    border: 1px solid #eaecf0;
    border-radius: 40px;
    padding: 7px;
    background: white;
  }

  &-button {
    border: 2px dashed #d3d7dc;
    border-radius: 8px;
    width: 100%;
    min-height: 200px;
    background-color: #fafbfc;
    color: #6d7480;
    font-size: 14px;
    font-weight: 500;

    &.file-added {
      border: none;
    }

    &-error {
      border: 1px dashed #f04438;
    }

    &-disabled {
      cursor: not-allowed;
    }

    &-remove,
    &-download {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
    }
  }

  &-select {
    align-self: center;
  }

  &-error {
    color: #d92d20;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    gap: 5px;
    align-items: center;
  }

  input[type="file"] {
    display: none;
  }
}
</style>
