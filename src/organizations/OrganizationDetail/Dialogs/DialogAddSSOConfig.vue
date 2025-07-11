<script lang="ts" setup>
import {
  reactive,
  ref,
  Ref,
  PropType,
  watch,
  computed,
  ComputedRef,
} from "vue";
import { helpers, required, url } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {
  TypeAddOrganizationSSOConfig,
  TypeAddOrganizationSSOConfigFormRules,
  TypeValidatorAddOrganizationSSOConfigForm,
} from "../types";
import { OrganizationOIDCRead, OrganizationRead } from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { TypeErrorResponse } from "~/mm_ui_kit/src/types/types";
import { copyToClipboard } from "~/mm_ui_kit/src/helpers/copyToClipboard";

const emit = defineEmits(["close", "submit"]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  closeDialog: {
    type: Boolean,
    default: false,
  },
  serviceConsumerId: {
    type: String,
    default: "",
  },
  organization: {
    type: Object as PropType<OrganizationRead>,
    default: () => ({}),
  },
  organizationSSOConfig: {
    type: Object as PropType<OrganizationOIDCRead | null>,
    default: null,
  },
});

const lastKnownURlLength: Ref<number> = ref(0);
const isEnableSSOSaving: Ref<boolean> = ref(false);
const isSSOSaving: Ref<boolean> = ref(false);
const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<TypeErrorResponse | unknown> = ref(null);
const updateFormCalled: Ref<boolean> = ref(false);

const form = reactive<TypeAddOrganizationSSOConfig>({
  clientId: "",
  clientSecret: "",
  serverMetadataUrl: "",
});

const maskedClientSecret = ref("");

const enableSBtnSOLabel: ComputedRef<string> = computed(() =>
  SSOEnabled.value ? "Save & disable" : "Save & enable",
);

const SSOEnabled: ComputedRef<boolean> = computed(
  () => !!props.organizationSSOConfig?.enabled,
);

const formRules: TypeAddOrganizationSSOConfigFormRules = {
  clientId: {
    required: helpers.withMessage("Client ID is required", required),
  },
  clientSecret: {
    required: helpers.withMessage("Client secret is required", required),
  },
  serverMetadataUrl: {
    required: helpers.withMessage("Server metadata URL is required", required),
    url: helpers.withMessage("URL must be valid", url),
  },
};

const v$: TypeValidatorAddOrganizationSSOConfigForm = useVuelidate(
  formRules,
  form,
);

const closeModal = () => {
  emit("close");
};

const resetForm = () => {
  form.clientId = "";
  form.clientSecret = "";
  form.serverMetadataUrl = "";
  maskedClientSecret.value = "";
  v$.value.$reset();
};

watch(
  () => props.organizationSSOConfig,
  (SSOConfig) => {
    if (SSOConfig) {
      form.clientId = SSOConfig.client_id || "";
      form.clientSecret = SSOConfig.client_secret || "";
      form.serverMetadataUrl = SSOConfig.server_metadata_url || "";
      maskedClientSecret.value = "*".repeat(form.clientSecret.length);
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

const updateFormByField = (field: string, value: string) => {
  updateFormCalled.value = true;

  if (field === "clientId") {
    v$.value.clientId.$touch();
    form.clientId = value;
  }

  if (field === "clientSecret") {
    form.clientSecret = value;
    v$.value.clientSecret.$touch();
  }

  if (field === "serverMetadataUrl") {
    const hasHttp = value.includes("http://");
    const hasHttps = value.includes("https://");

    let normalizedUrl = value;

    if (!hasHttp && !hasHttps) {
      if (value.length > lastKnownURlLength.value) {
        normalizedUrl = `https://${value}`;
      }
    }

    form.serverMetadataUrl = normalizedUrl;
    v$.value.serverMetadataUrl.$touch();
  }

  lastKnownURlLength.value = form.serverMetadataUrl.length;
};

const handleAppendedIconClick = (mode: string, copyText: string) => {
  copyToClipboard(copyText);
  eventBus.$emit("onShowToast", {
    text: `${mode} copied successfully`,
    status: "info",
  });
};

const formatLabel = (key: string) => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const saveConfiguration = async (ssoEnabled: boolean, enableBtn?: boolean) => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  if (ssoEnabled || enableBtn) {
    isEnableSSOSaving.value = true;
  } else {
    isSSOSaving.value = true;
  }

  try {
    const orgId = props.organization?.id;
    if (!orgId) {
      return;
    }

    const payload = {
      client_id: form.clientId,
      client_secret: form.clientSecret,
      server_metadata_url: form.serverMetadataUrl,
      enabled: ssoEnabled,
    };

    if (props.organizationSSOConfig) {
      await organizationsService.updateOrganizationSSOConfig(orgId, payload);
      eventBus.$emit("onShowToast", {
        text: "Organization SSO configuration saved successfully",
        status: "info",
      });
    } else {
      await organizationsService.addOrganizationSSOConfig(orgId, payload);
      eventBus.$emit("onShowToast", {
        text: "Organization SSO configuration added successfully",
        status: "info",
      });
    }
    emit("submit");
    if (props.closeDialog) closeModal();
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value =
      "Failed to save organization SSO configuration. Please try again.";
  } finally {
    isEnableSSOSaving.value = false;
    isSSOSaving.value = false;
  }
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="SSO configuration"
    subtitle="This SSO profile will apply to all users in your organization."
    icon="shield-check-outline"
    icon-size="21"
    cy="sso-configuration-dialog"
    @close="closeModal"
  >
    <template #default>
      <form
        v-mm-focus-first
        class="mm-page-dialog-form"
        data-cy="add-organization-sso-config-form"
      >
        <div>
          <m-m-alert
            v-if="isAlertVisible"
            status="error"
            cy="create-suborg-form-alert"
            class="mm-mb-12"
            @close="onAlertClose"
          >
            {{ alertText }}
          </m-m-alert>
        </div>
        <div>
          <m-m-input
            v-model="form.clientId"
            label="Client ID"
            :errors="v$.clientId.$errors"
            placeholder="Client ID"
            type="text"
            required
            cy="sso-config-client-id"
            @input="updateFormByField('clientId', $event.target.value)"
          />
        </div>
        <div>
          <m-m-input
            v-model="form.clientSecret"
            label="Client secret"
            placeholder="Client secret"
            type="text"
            required
            :errors="v$.clientSecret.$errors"
            cy="sso-config-client-secret"
            class="masked-input"
            @input="
              (event: InputEvent) =>
                updateFormByField(
                  'clientSecret',
                  (event.target as HTMLInputElement).value,
                )
            "
          />
        </div>
        <div>
          <m-m-input
            v-model="form.serverMetadataUrl"
            label="Server Metadata URL"
            label-icon-appended="info"
            placeholder="Server Metadata URL"
            type="email"
            required
            :errors="v$.serverMetadataUrl.$errors"
            cy="sso-config-server-metadata-url"
            label-tool-tip-text="Also known as Discovery URL or Well Known URL"
            @input="updateFormByField('serverMetadataUrl', $event.target.value)"
          />
        </div>
        <div v-if="organizationSSOConfig?.config">
          <m-m-input
            v-for="(value, key) in organizationSSOConfig.config"
            :key="key"
            class="mm-mb-10"
            :label="formatLabel(key)"
            :label-tool-tip-text="`Copy ${formatLabel(key)}`"
            label-icon-appended="clipboard"
            :model-value="value"
            type="text"
            :cy="`sso-config-${key}`"
            readonly
            icon-appended-clickable
            @handle-appended-icon-click="
              handleAppendedIconClick(formatLabel(key), value)
            "
          />
        </div>
      </form>
    </template>
    <template #footer>
      <m-m-button variant="transparent" @click="closeModal"> Close </m-m-button>
      <m-m-button
        variant="outlined"
        size="small"
        cy="button-save-sso"
        :loading="isSSOSaving"
        @click="saveConfiguration(false)"
      >
        Save
      </m-m-button>
      <m-m-button
        :variant="SSOEnabled ? 'text-danger' : 'elevated'"
        :disabled="false"
        size="small"
        cy="button-save-sso-config"
        :loading="isEnableSSOSaving"
        @click="saveConfiguration(SSOEnabled ? false : true, true)"
      >
        {{ enableSBtnSOLabel }}
      </m-m-button>
    </template>
  </m-m-dialog>
</template>
