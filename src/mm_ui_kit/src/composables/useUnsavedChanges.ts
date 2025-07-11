import { reactive, Ref, ref, watchEffect } from "vue";

type TypeUnsavedChangesState = {
  hasUnsavedChanges: boolean;
  texts: {
    subtitle: string;
    buttonSubmit: string;
    buttonCancel: string;
  };
};

export const useUnsavedChangesState: TypeUnsavedChangesState = reactive({
  hasUnsavedChanges: false,
  texts: {
    subtitle:
      "You have unsaved changes. If you discard your changes, all unsaved changes will be lost.",
    buttonSubmit: "Yes, discard",
    buttonCancel: "No, keep editing",
  },
});

export function useUnsavedChanges() {
  const hasUnsavedChanges: Ref<boolean> = ref(false);
  const isDialogUnsavedChangesOpen: Ref<boolean> = ref(false);
  let doNotShowNextTime =
    localStorage.getItem("doNotShowNextTime")?.toLowerCase() === "true";
  const currentPage: Ref<string> = ref("");
  const nextPage: Ref<string> = ref("");

  watchEffect(() => {
    useUnsavedChangesState.hasUnsavedChanges = hasUnsavedChanges.value;
  });

  const updateTargetPages = (from: string, to: string) => {
    currentPage.value = from;
    nextPage.value = to;
  };

  const warnUnsavedChanges = () => {
    if (hasUnsavedChanges.value && !doNotShowNextTime) {
      isDialogUnsavedChangesOpen.value = true;
    }
  };

  const confirmLeave = (next) => {
    hasUnsavedChanges.value = false;
    isDialogUnsavedChangesOpen.value = false;
    if (next) next();
  };

  const onCancelDialogUnsavedChanges = () => {
    isDialogUnsavedChangesOpen.value = false;
  };

  const updateDoNotShowNextTime = (isNotShowNextTime: boolean) => {
    doNotShowNextTime = isNotShowNextTime;
    localStorage.setItem("doNotShowNextTime", isNotShowNextTime.toString());
  };

  const setTextsForUnsavedChangesDialog = (reason: "discard" | "leave") => {
    if (reason === "discard") {
      useUnsavedChangesState.texts.subtitle =
        "You have unsaved changes. If you discard your changes, all unsaved changes will be lost.";
      useUnsavedChangesState.texts.buttonSubmit = "Yes, discard";
      useUnsavedChangesState.texts.buttonCancel = "No, keep editing";
    }
    if (reason === "leave") {
      useUnsavedChangesState.texts.subtitle =
        "You have unsaved changes. If you continue, all unsaved changes will be lost.";
      useUnsavedChangesState.texts.buttonSubmit = "Yes, continue";
      useUnsavedChangesState.texts.buttonCancel = "No, keep editing";
    }
  };

  return {
    hasUnsavedChanges,
    isDialogUnsavedChangesOpen,
    currentPage,
    nextPage,
    doNotShowNextTime,
    updateTargetPages,
    confirmLeave,
    onCancelDialogUnsavedChanges,
    warnUnsavedChanges,
    updateDoNotShowNextTime,
    setTextsForUnsavedChangesDialog,
  };
}
