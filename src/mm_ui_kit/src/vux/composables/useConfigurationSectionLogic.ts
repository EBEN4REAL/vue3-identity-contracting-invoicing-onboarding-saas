import {
  computed,
  ComputedRef,
  ModelRef,
  Ref,
  ref,
  watch,
  watchEffect,
} from "vue";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import { VuxTemplateComponentLogic } from "../types/vuxTemplateComponentLogic";
import { configurationService } from "../../../../configuration/configuration.service";
import { authService } from "../../../../auth/auth.service";
import { useComponentGroupLogic } from "./useComponentGroupLogic";
import { VuxModel } from "../types/useVuxModelType";
import { VuxAction } from "../types/useVuxActionType";

export function useConfigurationSectionLogic(
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel | undefined>,
): VuxTemplateComponentLogic {
  const baseStrategy = useComponentGroupLogic(props, emit, model);
  const strategyName: string = "useConfigurationSectionStrategy";
  const isLoading: Ref<boolean> = ref(false);
  const isChanged: Ref<boolean> = ref<boolean>(false);
  const renderMode: Ref<string> = ref<string>(props.mode);
  const serviceProviderId: Ref<string> = ref("");
  const isCollapsed: Ref<boolean> = ref(false);
  const isSectionLoading: Ref<boolean> = ref(true);

  watchEffect(async () => {
    const userProfile = await authService.getProfile();
    serviceProviderId.value = userProfile?.sp_org as string;

    if (
      !baseStrategy.groupModel.value?.data ||
      Object.keys(baseStrategy.groupModel.value.data).length === 0
    ) {
      await reload();
    } else {
      updateStatus();
    }
  });

  const isValid: ComputedRef<boolean> = computed(() => {
    return baseStrategy.isValid && baseStrategy.groupModel.value?.data;
  });

  const handleVuxAction = async (
    name: string,
    action: VuxAction,
    modelData: VuxModel,
  ) => {
    if (action.audience !== props.resourceKey) {
      emit("vux-action", name, action, modelData);
      return;
    }

    switch (name) {
      case "save":
        await save();
        renderMode.value = "view";
        emit("vux-action", name, action, modelData);
        return;
      case "discard":
        renderMode.value = "view";
        await discard();
        emit("vux-action", name, action, modelData);
        return;
      case "edit":
        renderMode.value = "edit";
        await edit();
        emit("vux-action", name, action, modelData);
        return;
      default:
        throw new Error(`Unhandled action '${name}' for ${props.resourceKey}`);
    }
  };

  const save = async (): Promise<void> => {
    if (isLoading.value) {
      throw new Error("Save operation is already in progress.");
    }
    const valid = await baseStrategy.validate();
    if (!valid) {
      throw new Error("Validation failed");
    }

    isLoading.value = true;
    try {
      await updateSectionData();
      isChanged.value = false;
    } finally {
      isLoading.value = false;
      await reload();
    }
  };

  const updateSectionData = async () => {
    const response = await configurationService.updateSection(
      serviceProviderId.value as string,
      baseStrategy.groupModel.value?.id as string,
      {
        data:
          (baseStrategy.groupModel.value?.data as Record<string, never>) ?? {},
      },
    );
    Object.assign(baseStrategy.groupModel.value, response);
  };

  const edit = async () => {
    await reload();
  };

  const reload = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
      await readSectionData();
      isChanged.value = false;
    } finally {
      isLoading.value = false;
      updateStatus();
    }
  };

  const readSectionData = async () => {
    isSectionLoading.value = true;
    try {
      const response = await configurationService.getSection(
        serviceProviderId.value as string,
        baseStrategy.groupModel.value?.id as string,
      );

      Object.assign(baseStrategy.groupModel.value, response);
    } catch (error) {
      console.error("Error getting section data:", error);
    } finally {
      isSectionLoading.value = false;
    }
  };

  // Starts polling if sync or publish is pending
  const updateStatus = async () => {
    pollSectionStatus();
  };

  const discard = async () => {
    await reload();
  };

  const pollingIntervalMs = 3000;
  let pollingActive = false;

  const pollSectionStatus = async () => {
    if (pollingActive) return;
    pollingActive = true;

    const pollLoop = async () => {
      do {
        const updatedStatus = await fetchSectionStatus(
          baseStrategy.groupModel.value?.id as string,
        );
        Object.assign(baseStrategy.groupModel.value, updatedStatus);
        await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs));
      } while (
        baseStrategy.groupModel.value?.sync_status === "PENDING" ||
        baseStrategy.groupModel.value?.publish_status === "PENDING"
      );
      pollingActive = false;
    };

    pollLoop();
  };

  const fetchSectionStatus = async (sectionId: string | undefined) => {
    if (!sectionId) {
      return null;
    }
    try {
      return await configurationService.getSectionStatus(
        serviceProviderId.value as string,
        sectionId,
      );
    } catch (error) {
      console.error("Error fetching section status:", error);
    }
  };

  const isSyncPending: ComputedRef<boolean> = computed(() => {
    return (
      baseStrategy.groupModel.value?.sync_status === "PENDING" ||
      baseStrategy.groupModel.value?.sync_status === null
    );
  });

  const isPublishPending: ComputedRef<boolean> = computed(() => {
    return (
      baseStrategy.groupModel.value?.publish_status === "PENDING" ||
      baseStrategy.groupModel.value?.publish_status === null
    );
  });

  //needed later to control button visibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const editButtonEnabled: ComputedRef<boolean> = computed(() => {
    return (
      !isLoading.value &&
      !isSyncPending.value &&
      !isPublishPending.value &&
      renderMode.value === "edit"
    );
  });

  const isChangedComputed: ComputedRef<boolean> = computed(
    () => isChanged.value,
  );

  const renderModeComputed: ComputedRef<string> = computed(
    () => renderMode.value,
  );

  // Determine the section status and return the corresponding class
  const getStatusClass: ComputedRef<string> = computed(() => {
    if (!baseStrategy.groupModel.value) return "";
    const { sync_status, publish_status } = baseStrategy.groupModel.value;

    // Any failure
    if (sync_status === "FAILURE" || publish_status === "FAILURE") {
      isCollapsed.value = false;
      return "status-failure";
    }

    if (sync_status === "SUCCESS" && publish_status === "SUCCESS") {
      isCollapsed.value = true;
      return "status-done";
    }

    if (sync_status === "PENDING" || publish_status === "PENDING") {
      isCollapsed.value = false;
      return "status-pending";
    }

    // Possibly not published yet but data is ok
    if (sync_status === "SUCCESS" && publish_status === null) {
      isCollapsed.value = false;
      return "status-warning";
    }

    isCollapsed.value = false;
    return "status-default"; // Default state
  });

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  watch(
    () =>
      !baseStrategy.groupModel.value?.data ||
      Object.keys(baseStrategy.groupModel.value.data).length === 0,
    () => {
      if (
        !baseStrategy.groupModel.value?.data ||
        Object.keys(baseStrategy.groupModel.value.data).length === 0
      ) {
        reload();
      }
    },
  );

  return {
    strategyName,
    groupMetadata: baseStrategy.groupMetadata,
    groupModel: baseStrategy.groupModel,
    groupProperties: baseStrategy.groupProperties,
    handlePropertyValidationChange: baseStrategy.handlePropertyValidationChange,
    isValid: isValid,
    handleVuxAction,
    validate: baseStrategy.validate,
    save,
    edit,
    registerPropertyComponent: baseStrategy.registerPropertyComponent,
    isChanged: isChangedComputed,
    renderMode: renderModeComputed,
    discard,
    isCollapsed,
    toggleCollapse,
    getStatusClass,
    isSectionLoading,
  };
}
