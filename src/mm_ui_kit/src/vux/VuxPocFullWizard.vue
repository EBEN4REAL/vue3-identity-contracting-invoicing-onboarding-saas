<!--File just for testing purposes can be deleted later-->
<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { configurationService } from "~/configuration/configuration.service";
import { authService } from "~/auth/auth.service";
import {
  WizardCreate,
  WizardReadWithSections,
} from "~/configuration/configuration.types";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "./types/vuxTemplateComponent";
import { VuxModel } from "./types/useVuxModelType";

const props = withDefaults(defineProps<VuxTemplateComponentProps>(), {
  mode: "edit",
  dataFieldName: "",
});

const emit = defineEmits<VuxTemplateComponentEmits>();
const groupRef = ref();
const modelData = defineModel<VuxModel>();
const serviceProviderId: Ref<string | null> = ref(null);
const WIZARD_TYPE_ID: string = "8951ad19-c8ba-4726-b850-d0fd58d04506";
const wizard: Ref<WizardReadWithSections | null> = ref(null);
const loading: Ref<boolean> = ref(false);
const status = ref<string>("create");
const wizardId = ref<string>("");
const wizardName = ref<string>("");

// Computed property to check if the status is "create"
const isCreateMode = computed(() => status.value === "create");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadataWithoutWizardGroup = computed(() => {
  const metadata = props.metaData[props.dataFieldName];
  if (metadata) {
    const { wizard_group, ...rest } = metadata;
    return rest;
  }
  return null;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadataWizard = computed(() => {
  const metadata = props.metaData[props.dataFieldName];
  if (metadata) {
    return {
      wizard: metadata.wizard,
    };
  }
  return null;
});

const createWizard = async () => {
  const payload: WizardCreate = {
    wizard_type_id: WIZARD_TYPE_ID,
    name: wizardName.value,
  };
  try {
    wizard.value = await configurationService.createWizard(
      serviceProviderId.value as string,
      payload,
    );
    wizardId.value = wizard.value.id;
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: error,
      status: "error",
    });
  }
};

async function readWizard() {
  try {
    loading.value = true;

    // Fetch the wizard data
    const response = await configurationService.getWizard(
      serviceProviderId.value as string,
      wizardId.value,
    );

    // Update the model data with the fetched wizard data
    Object.assign(modelData.value[props.dataFieldName].wizard.wizard, response);
    status.value = "show";
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error loading wizard",
      status: "error",
    });
  } finally {
    loading.value = false;
  }
}

function emitVuxAction(
  actionName: string,
  actionMetadata: unknown,
  model: unknown,
) {
  emit("vux-action", actionName, actionMetadata, model);
}

async function handleVuxAction(
  actionName: string,
  actionMetadata: unknown,
  model: unknown,
) {
  if (actionName === "delete") {
    status.value = "create";
  }
  if (actionMetadata.audience !== props.resourceKey) {
    emitVuxAction(actionName, actionMetadata, model);
    return;
  }

  try {
    await createWizard(model.input);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error creating wizard",
      status: "error",
    });
  }
}

onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.sp_org) {
    serviceProviderId.value = userProfile.sp_org;
  }
});
</script>

<template>
  <div class="wizard-component">
    <div v-if="isCreateMode">
      <div class="create-wizard mm-mt-12">
        <div>Create wizard</div>
        <m-m-input v-model="wizardName" placeholder="wizard name" />
        <m-m-button
          :is-disabled="loading"
          class="mm-mt-10"
          @click="createWizard"
          >Create Wizard
        </m-m-button>
      </div>

      <div class="create-wizard mm-mt-12">
        <div>Read wizard</div>
        <m-m-input v-model="wizardId" placeholder="wizard name" />
        <m-m-button :is-disabled="loading" class="mm-mt-10" @click="readWizard"
          >Read Wizard
        </m-m-button>
      </div>
    </div>
    <div v-else>
      <vux-property-group-template
        v-if="!loading"
        ref="groupRef"
        v-model="modelData[dataFieldName]"
        :meta-data="props.metaData[dataFieldName]"
        :resource-key="props.resourceKey"
        :mode="props.mode"
        @vux-action="handleVuxAction"
      />
    </div>
  </div>
</template>

<style scoped>
.wizard-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}
</style>
