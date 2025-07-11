<script setup lang="ts">
import { computed, ComputedRef, ref, Ref, watch } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { organizationsService } from "~/organizations/organizations.service";
import { read, WorkBook } from "xlsx";
import { DialogStatusTypes } from "~/mm_ui_kit/src/types/dialog.types";
import {
  clearIntervalAsync,
  setIntervalAsync,
} from "set-interval-async/dynamic";
import { SyncStatus } from "~/iam/iam.types";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  organizationId: {
    type: String,
    default: "",
  },
  context: {
    type: String,
    default: "Organization User",
  },
});

const emit = defineEmits(["close", "update"]);

const isButtonSubmitDisabled: Ref<boolean> = ref(true);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const supportedFormats = ["xls", "xlsx", "csv"];
const supportedFileTypes = [
  "application/vnd.ms-excel", // xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "text/csv", //csv
];
const uploadedFile: Ref<File | null> = ref(null);
const dragNDropFileStatus: Ref<"default" | "error"> = ref("default");
const dragNDropFileErrorMessage: Ref<string> = ref(
  "Error while uploading file",
);
const excelFile: Ref<WorkBook | null> = ref(null);
const dialogStatus: Ref<DialogStatusTypes> = ref(DialogStatusTypes.Default);
const organizationUserImportId: Ref<string> = ref("");
const isAlertVisible: Ref<boolean> = ref(false);

const organizationUsersCount: ComputedRef<number> = computed(() => {
  if (!excelFile.value) return 0;

  const sheets = excelFile.value.Sheets;
  const uniqueData: Set<string> = new Set();

  Object.keys(sheets).forEach((sheetName) => {
    const sheet = sheets[sheetName];

    // Extracting the range from the !ref property
    const range = sheet["!ref"];

    if (!range) return 0;

    // Extract start and end row numbers from the range
    const [start, end] = range.split(":");
    const matchResultStart = start.match(/[0-9]+/);
    const startRow = matchResultStart ? matchResultStart[0] : "";
    const matchResultEnd = end.match(/[0-9]+/);
    const endRow = matchResultEnd ? matchResultEnd[0] : "";

    // Iterate through rows based on extracted start and end rows
    for (let i = parseInt(startRow) + 1; i <= parseInt(endRow); i++) {
      const cell = `A${i}`;
      const cellData = sheet[cell];

      if (
        typeof cellData === "object" &&
        "v" in cellData &&
        cellData.v !== undefined
      ) {
        uniqueData.add(String(cellData.v)); // Ensure v is converted to string
      }
    }
  });

  // Convert Set to Array and return
  return Array.from(uniqueData).length;
});

const aboutToImportOrganizationUsersText: ComputedRef<string> = computed(
  () =>
    `You are about to import ${organizationUsersCount.value} ${props.context.toLowerCase()}${organizationUsersCount.value === 1 ? "" : "s"}`,
);

const isAboutToImportOrganizationUsersTextVisible: ComputedRef<boolean> =
  computed(() => Boolean(isStatusDefault.value && uploadedFile.value));

const successfullyImportedOrganizationUsersText: ComputedRef<string> = computed(
  () =>
    `${organizationUsersCount.value} ${props.context.toLowerCase()}${organizationUsersCount.value === 1 ? "" : "s"}`,
);

const isStatusDefault: ComputedRef<boolean> = computed(
  () => dialogStatus.value === DialogStatusTypes.Default,
);

const isStatusLoading: ComputedRef<boolean> = computed(
  () => dialogStatus.value === DialogStatusTypes.Loading,
);

const isStatusSuccess: ComputedRef<boolean> = computed(
  () => dialogStatus.value === DialogStatusTypes.Success,
);

const dialogTitle: ComputedRef<string> = computed(() => {
  if (isStatusLoading.value)
    return `Importing ${uploadedFile.value?.name}` || "";
  else if (isStatusSuccess.value) return "Import successful";
  else return `Import ${props.context}s`;
});

const buttonCloseText: ComputedRef<string> = computed(() =>
  isStatusSuccess.value ? "Done" : "Close",
);

const onUploadFile = async (file: File) => {
  if (!supportedFileTypes.includes(file.type)) {
    dragNDropFileStatus.value = "error";
    dragNDropFileErrorMessage.value = "Wrong file format!";
  } else {
    uploadedFile.value = file;
    isButtonSubmitDisabled.value = false;
    dragNDropFileStatus.value = "default";
    const data = await file.arrayBuffer();
    excelFile.value = read(data);
  }
};

const onDeleteFile = () => {
  uploadedFile.value = null;
  isButtonSubmitDisabled.value = true;
};

const resetData = () => {
  dialogStatus.value = DialogStatusTypes.Default;
  dragNDropFileStatus.value = "default";
  uploadedFile.value = null;
  organizationUserImportId.value = "";
  isButtonSubmitDisabled.value = true;
};

const checkImportStatus = async () => {
  const timer = setIntervalAsync(async () => {
    try {
      await organizationsService.getImportOrganizationUsers(
        props.organizationId,
        organizationUserImportId.value,
      );
      const importStatus: SyncStatus =
        organizationsService.state.importOrganizationUsersStatus?.status ||
        "P" ||
        "PENDING";
      const isImportStatusNotPending: boolean =
        importStatus !== "P" && importStatus !== "PENDING";
      const isImportStatusSuccess: boolean =
        importStatus === "S" || importStatus === "SUCCESS";
      const isImportStatusFailure: boolean =
        importStatus === "F" || importStatus === "FAILURE";
      if (isImportStatusNotPending) {
        if (isImportStatusSuccess) {
          dialogStatus.value = DialogStatusTypes.Success;
          emit("update");
        }
        if (isImportStatusFailure) {
          resetData();
          isAlertVisible.value = true;
        }
        await clearIntervalAsync(timer);
      }
    } catch (err) {
      dragNDropFileStatus.value = "error";
      dialogStatus.value = DialogStatusTypes.Default;
      uploadedFile.value = null;
      await clearIntervalAsync(timer);
    }
  }, 2000);
};

const onSubmit = async () => {
  if (!uploadedFile.value) return;

  try {
    dialogStatus.value = DialogStatusTypes.Loading;
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;

    const formData: FormData = new FormData();
    formData.append("import_file", uploadedFile.value, uploadedFile.value.name);

    const importRes = await organizationsService.postImportOrganizationUsers(
      props.organizationId,
      formData,
    );
    organizationUserImportId.value = importRes.id;
    await checkImportStatus();
  } catch (err) {
    dragNDropFileStatus.value = "error";
    dialogStatus.value = DialogStatusTypes.Default;
    uploadedFile.value = null;

    if (err?.response.status === 400) {
      dragNDropFileErrorMessage.value =
        "The formatting of the file looks different than the sample template.";
    } else if (err?.response.status === 409) {
      dragNDropFileErrorMessage.value = "This file has already been uploaded";
    } else {
      eventBus.$emit("onShowToast", {
        text: "Failed to import file",
        status: "error",
      });
    }
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

watch(
  () => props.isOpen,
  () => {
    resetData();
  },
);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="cloud-arrow-down"
    :title="dialogTitle"
    :status="dialogStatus"
    cy="dialog-import-organization-users"
    @close="emit('close')"
  >
    <template v-if="isStatusDefault" #subtitle>
      Upload a file to import your (existing) {{ context.toLowerCase() }}s. See
      <m-m-link
        download
        font-weigth="500"
        href="/sample-files/users_import.csv"
      >
        this example (csv)
      </m-m-link>
      file containing sample data and accepted values to ensure your information
      is in the correct format before uploading.
    </template>
    <template v-else-if="isStatusLoading" #subtitle>
      Import is in progress... depending on the number of organization users,
      might take a couple of minutes. You can safely close this dialog and
      continue working in the Veriam portal, your import will continue to run on
      the background. When the import is completed, you will find the
      {{ context.toLowerCase() }}s on this page.
    </template>
    <template v-else-if="isStatusSuccess" #subtitle>
      You’ve successfully imported
      <span class="font-weight-500 mm-page-color-primary">
        {{ successfullyImportedOrganizationUsersText }}
      </span>
      into Veriam. The users from your organization have been invited to
      finalize setting up their account.
    </template>
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      is-closable
      class="mm-mb-8"
      @close="onAlertClose"
    >
      Something went wrong while importing file
    </m-m-alert>
    <m-m-drag-n-drop
      v-if="isStatusDefault"
      :supported-formats="supportedFormats"
      :status="dragNDropFileStatus"
      :error-message="dragNDropFileErrorMessage"
      @upload="onUploadFile"
      @delete="onDeleteFile"
    />
    <div
      v-if="isAboutToImportOrganizationUsersTextVisible"
      class="mm-flex mm-flex-align-start mm-mt-2 about-to-import-organization-users"
      data-cy="about-to-import-organization-users"
    >
      <m-m-icon
        icon="information-circle"
        width="12px"
        height="12px"
        class="mm-mr-3 mm-mt-1"
      />
      {{ aboutToImportOrganizationUsersText }}
    </div>
    <template #footer>
      <m-m-button variant="outlined" cy="button-close" @click="emit('close')">
        {{ buttonCloseText }}
      </m-m-button>
      <m-m-button
        v-if="isStatusDefault"
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        variant="elevated"
        data-cy="button-submit"
        @click="onSubmit"
      >
        Import
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
.about-to-import-organization-users {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #6d7480;
}
</style>
