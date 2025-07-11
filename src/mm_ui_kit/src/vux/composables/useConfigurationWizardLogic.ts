import { ref, computed, toRaw, ModelRef, watchEffect, Ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { configurationService } from "~/configuration/configuration.service";
import {
  WizardCreate,
  WizardReadWithSections,
} from "~/configuration/configuration.types";
import {
  VuxTemplateComponentProps,
  VuxTemplateComponentEmits,
} from "../types/vuxTemplateComponent";
import { VuxTemplateComponentLogic } from "../types/vuxTemplateComponentLogic";
import { authService } from "~/auth/auth.service";
import { useComponentGroupLogic } from "./useComponentGroupLogic";
import { VuxModel } from "../types/useVuxModelType";
import { VuxAction } from "../types/useVuxActionType";

export function useConfigurationWizardLogic(
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel | undefined>,
): VuxTemplateComponentLogic {
  const baseStrategy = useComponentGroupLogic(props, emit, model);
  const strategyName: string = "useConfigurationWizardStrategy";
  const isChanged: Ref<boolean> = ref(false);
  const loading: Ref<boolean> = ref(true);
  const serviceProviderId: Ref<string> = ref("");
  const isReady: Ref<boolean> = ref(false);
  const WIZARD_TYPE_ID: string = "8951ad19-c8ba-4726-b850-d0fd58d04506";

  watchEffect(async () => {
    const userProfile = await authService.getProfile();
    if (userProfile?.sp_org) {
      serviceProviderId.value = userProfile.sp_org;
    }
  });

  //needed later to control button visibilty
  //   const publishWizardButtonEnabled = computed(() => {
  //     return baseStrategy.groupModel.data?.publish_status !== "completed";
  //   });

  const createWizard = async (wizardName: string) => {
    const payload: WizardCreate = {
      wizard_type_id: WIZARD_TYPE_ID,
      name: wizardName,
    };
    try {
      const wizardCreated = await configurationService.createWizard(
        serviceProviderId.value as string,
        payload,
      );
      return wizardCreated.id;
    } catch (error) {
      eventBus.$emit("onShowToast", {
        text: error,
        status: "error",
      });
    }
  };

  const updateModelData = (input: WizardReadWithSections) => {
    const data: Record<string, unknown> = { ...input };

    for (const section of input?.sections ?? []) {
      const rawSection = toRaw(section);
      const key = rawSection.type?.name;
      if (!key) continue;

      if (data[key] == null) {
        data[key] = [{ section: rawSection }];
      } else if (Array.isArray(data[key])) {
        // Push the section wrapped in { section: ... }
        data[key].push({ section: rawSection });
      } else {
        // Convert the existing value into an array and add the new section
        data[key] = [{ section: data[key] }, { section: rawSection }];
      }
    }

    return data;
  };

  const readWizard = async (wizardId?: string) => {
    try {
      loading.value = true;
      const response = await configurationService.getWizard(
        serviceProviderId.value,
        wizardId
          ? wizardId
          : (baseStrategy.groupModel.value?.wizard.id as string),
      );

      Object.assign(baseStrategy.groupModel.value, {
        wizard: updateModelData(response),
      });

      isChanged.value = false;
      isReady.value = true;
    } catch (error) {
      eventBus.$emit("onShowToast", {
        text: "Error loading wizard",
        status: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  const updateWizard = async () => {
    try {
      loading.value = true;
      isChanged.value = false;

      return configurationService.updateWizard(
        serviceProviderId.value,
        baseStrategy.groupModel.value?.id as string,
        {
          name: baseStrategy.groupModel.value?.name,
          description: baseStrategy.groupModel.value?.description,
        },
      );
    } catch (error) {
      eventBus.$emit("onShowToast", {
        text: "Error updating wizard",
        status: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  const deleteWizard = async () => {
    try {
      await configurationService.deleteWizard(
        serviceProviderId.value,
        baseStrategy.groupModel.value?.wizard.id as string,
      );
      eventBus.$emit("onShowToast", {
        text: "Wizard deleted successfully",
        status: "success",
      });
      emit("vux-action", "delete", {}, baseStrategy.groupModel.value);
    } catch {
      eventBus.$emit("onShowToast", {
        text: "Error while deleting wizard",
        status: "error",
      });
    }
  };

  const disconnectWizard = async () => {
    try {
      await configurationService.deleteWizard(
        serviceProviderId.value,
        baseStrategy.groupModel.value?.wizard.id as string,
        { disconnect: true },
      );
      eventBus.$emit("onShowToast", {
        text: "Wizard disconnected successfully",
        status: "success",
      });
    } catch {
      eventBus.$emit("onShowToast", {
        text: "Error while disconnecting wizard",
        status: "error",
      });
    }
  };

  const publishWizard = async () => {
    try {
      loading.value = true;

      const response = await configurationService.publishWizard(
        serviceProviderId.value,
        baseStrategy.groupModel.value?.wizard.id as string,
      );

      Object.assign(baseStrategy.groupModel, response);

      isChanged.value = false;
    } catch (error) {
      eventBus.$emit("onShowToast", {
        text: "Error while publishing wizard",
        status: "error",
      });
    } finally {
      loading.value = false;
    }
  };

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
      case "create":
        const wizardId = await createWizard(modelData?.input_wizard_name);
        await readWizard(wizardId);
        return;
      case "save":
        await updateWizard();
        return;
      case "read":
        await readWizard(modelData?.input_wizard_id);
        return;
      case "delete":
        await deleteWizard();
        return;
      case "disconnect":
        await disconnectWizard();
        return;
      case "publish":
        await publishWizard();
        await readWizard();
        return;
      case "default":
      case "":
        return {
          variant: "elevated",
          icon: "",
        };
      default:
        throw new Error(
          `Unhandled action '${action}' for ${props.resourceKey}`,
        );
    }
  };

  const isValid = computed(() => {
    return baseStrategy.isValid && isReady.value;
  });

  return {
    ...baseStrategy,
    strategyName,
    groupProperties: baseStrategy.groupProperties,
    groupMetadata: baseStrategy.groupMetadata,
    groupModel: baseStrategy.groupModel,
    isValid: isValid,
    handleVuxAction,
  };
}
