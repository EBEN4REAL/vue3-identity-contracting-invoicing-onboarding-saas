<script setup lang="ts">
import { PropType, reactive, ref, computed, Ref, onMounted } from "vue";
import {
  AttributeRead,
  OrganizationDomainSchema,
  OrganizationOIDCRead,
  OrganizationRead,
  OrganizationReadWithAttributes,
  OrganizationUpdate,
} from "~/iam/iam.types";
import { RANGE_OF_EMPLOYEES, INDUSTRIES } from "~/common/constants";
import { organizationsService } from "~/organizations/organizations.service";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";
import { ErrorObject, useVuelidate } from "@vuelidate/core";
import { helpers, maxLength, required } from "@vuelidate/validators";
import {
  TypeUpdateOrganizationBillingAddressFormRules,
  TypeUpdateOrganizationDetailsFormRules,
  TypeValidatorUpdateOrganization,
  TypeValidatorUpdateOrganizationBillingAddress,
} from "~/organizations/organizations.types";
import {
  BillingAddressCreate,
  BillingAddressRead,
} from "~/billing_and_invoicing/billing_and_invoicing.types";
import { ComputedRef } from "vue";
import { billingAndInvoicingService } from "~/billing_and_invoicing/billing_and_invoicing.service";
import { watch } from "vue";
import _ from "lodash";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import DialogAddOrganizationSSOConfig from "./Dialogs/DialogAddSSOConfig.vue";
import { useFlag } from "@unleash/proxy-client-vue";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { toSnakeCase } from "~/mm_ui_kit/src/helpers/utils";
import { shortcutsForDatepickers } from "~/onboarding/constants";
import { isValidUUID } from "~/mm_ui_kit/src/helpers/errorIDValidator";
import { EnumDataType } from "~/attribute-types/types";
import { useUiStore } from "~/stores/useUiStore";
import {
  FormDataItem,
  OnboardingFormData,
} from "~/onboarding/onboarding.types";

const props = defineProps({
  organization: {
    type: Object as PropType<OrganizationReadWithAttributes>,
    default: () => ({}),
  },
  billingAddress: {
    type: Object as PropType<BillingAddressRead>,
    default: () => {},
  },
});

const emit = defineEmits(["update"]);
const uiStore = useUiStore();
const billingAddressEnabled = useFlag("billing_and_invoicing");
const isOrganizationMFAConfigurable = useFlag("org_mfa_configurable");
const isInEditMode = ref(false);
const loading = ref(false);
const EMPTY_BILLING_ADDRESS: BillingAddressCreate = {
  address_line_1: "",
  address_line_2: "",
  town_city: "",
  postal_code: "",
  country: "",
  default: true,
};
const initialFormState: Ref<BillingAddressCreate | null> = ref(null);
const isAddSSOConfigDialogOpen: Ref<boolean> = ref(false);
const organizationSSOConfig: Ref<OrganizationOIDCRead | null> = ref(null);
const isSSOSaving: Ref<boolean> = ref(false);
const isSSORemoving: Ref<boolean> = ref(false);
const organizationHasSSOConfig: Ref<boolean> = ref(false);
const closeDialog: Ref<boolean> = ref(false);
const isMFARequired: Ref<boolean> = ref(
  props.organization?.mfa_required || false,
);
const mfaBadgeStatus: ComputedRef<string> = computed(() =>
  isMFARequired.value ? BadgeTypes.Active : BadgeTypes.Inactive,
);

const showAddSSOBtn: ComputedRef<boolean> = computed(
  () => !organizationSSOConfig.value || !organizationHasSSOConfig.value,
);
const showEditEnableDisableAndRemoveSSOBtns = computed(
  () => organizationSSOConfig.value || organizationHasSSOConfig.value,
);

const organizationDetailsCypressId = computed(() =>
  isInEditMode.value
    ? "organization-details-update"
    : "organization-details-read",
);

const formatDomains = (
  domains: OrganizationDomainSchema[] | null | undefined,
) =>
  domains?.map((domain: OrganizationDomainSchema) => domain.name).join(", ") ||
  "";

const formatIndustry = (industry: string | null | undefined) =>
  INDUSTRIES.find((INDUSTRY) => INDUSTRY.value === industry)?.title || "";

const formatNumberOfEmployeesRange = (range: string | null | undefined) =>
  RANGE_OF_EMPLOYEES.find((RANGE) => RANGE.value === range)?.title || "";

const formData: OnboardingFormData = reactive({});

const organzationAlreadyHasBillingAddress: ComputedRef<boolean> = computed(() =>
  Boolean(props.billingAddress?.id),
);

const billing_address_form: BillingAddressRead | BillingAddressCreate =
  reactive(
    organzationAlreadyHasBillingAddress.value
      ? props.billingAddress
      : { ...EMPTY_BILLING_ADDRESS },
  );
const isBillingAddressChanged = computed(() => {
  return !_.isEqual(billing_address_form, initialFormState.value);
});

const toggleAddSSOConfigDialog = () => {
  isAddSSOConfigDialogOpen.value = !isAddSSOConfigDialogOpen.value;
};
const onBlur = (key: string) => {
  if (v$.value[key]?.$dirty) v$.value[key].$touch();
};

const booleanItemsForSelect = [
  {
    title: "Yes",
    value: true,
  },
  {
    title: "No",
    value: false,
  },
];

// Details computed
const details: ComputedRef<TypeDataIteratorItem[]> = computed(() => {
  const detailsIteratorElements = [
    {
      key: "name",
      label: "Org name",
      text: props.organization?.name,
      isEmpty: !props.organization?.name,
    },
    {
      key: "domains",
      label: "Domains",
      text: formatDomains(props.organization?.domains),
      isEmpty: !props.organization?.domains?.length,
      emptyText: "Not Added",
    },
    {
      key: "industry",
      label: "Industry",
      text: formatIndustry(props.organization?.industry),
      isEmpty: !props.organization?.industry,
    },
    {
      key: "number_of_employees_range",
      label: "Number of employees",
      text: formatNumberOfEmployeesRange(
        props.organization?.number_of_employees_range,
      ),
      isEmpty: !props.organization?.number_of_employees_range,
    },
  ];
  if (isOrganizationMFAConfigurable.value) {
    detailsIteratorElements.push({
      key: "mfa_required",
      label: "Require MFA on all logins",
      text: isMFARequired.value ? "Yes" : "No",
      hasBadge: true,
      badgeText: isMFARequired.value ? "Yes" : "No",
      badgeStatus: mfaBadgeStatus.value,
    });
  }
  if (billingAddressEnabled.value) {
    detailsIteratorElements.push({
      key: "billing_address",
      label: "Billing address",
      text: formatBillingAddress.value,
      isEmpty: formatBillingAddress.value.length === 0,
    });
  }
  if (props.organization?.attributes) {
    const generateBooleanText = (value: boolean) => {
      const foundBooleanItem = booleanItemsForSelect.find(
        (booleanItem) => booleanItem.value === value,
      );
      return foundBooleanItem?.title || "";
    };

    const generateText = (attribute: AttributeRead) => {
      switch (attribute.data_type) {
        case "boolean":
          return generateBooleanText(attribute.value as boolean);
        default:
          return attribute.value;
      }
    };

    const generateIsEmpty = (value: boolean | string | number): boolean =>
      Boolean(typeof value !== "boolean" && !value);

    detailsIteratorElements.push(
      ...props.organization.attributes.map((attribute: AttributeRead) => ({
        key: toSnakeCase(attribute.name),
        label: attribute.name,
        text: generateText(attribute),
        isEmpty: generateIsEmpty(attribute.value),
      })),
    );
  }
  return detailsIteratorElements;
});

const formRules: TypeUpdateOrganizationDetailsFormRules = reactive({
  name: {
    required: helpers.withMessage("Organization name is required", required),
    maxLength: helpers.withMessage(
      "Organization name is too long",
      maxLength(64),
    ),
  },
});

const billingFormRules: TypeUpdateOrganizationBillingAddressFormRules = {
  country: {
    required: helpers.withMessage("Country is required", required),
  },
  address_line_1: {
    required: helpers.withMessage("Address Line 1 is required", required),
  },
  town_city: {
    required: helpers.withMessage("Town or city required", required),
  },
  postal_code: {
    required: helpers.withMessage("Postal code is required", required),
  },
};

const form: ComputedRef<OrganizationUpdate> = computed(() => {
  const generatedAttributes = Object.keys(formData).reduce(
    (acc, key) => {
      if (
        formData[key]?.value !== undefined &&
        formData[key]?.value !== null &&
        formData[key]?.isAttribute
      ) {
        acc[formData[key].id] = formData[key].value;
        if (
          formData[key].data_type === "boolean" ||
          formData[key].data_type === "enum"
        ) {
          acc[formData[key].id] = formData[key].value.value;
        }
      }
      return acc;
    },
    {} as Record<string, never> | null,
  );
  return {
    name: formData.name?.value || "",
    industry: formData.industry?.value?.value || null,
    number_of_employees_range:
      formData.number_of_employees_range?.value?.value || null,
    mfa_required: isMFARequired.value,
    attributes:
      Object.keys(generatedAttributes).length === 0
        ? null
        : generatedAttributes,
  } as OrganizationUpdate;
});

const v$: TypeValidatorUpdateOrganization = useVuelidate(formRules, formData);
const billing_address_v$: TypeValidatorUpdateOrganizationBillingAddress =
  useVuelidate(billingFormRules, billing_address_form, { $autoDirty: true });

const updateDetailsWithNewData = (newDetailsData: OrganizationRead) => {
  const getDetailByKey = (key: string): TypeDataIteratorItem | undefined =>
    details.value.find((detail) => detail.key === key);

  const name = getDetailByKey("name");
  if (name) name.text = newDetailsData.name;

  const industry = getDetailByKey("industry");
  if (industry) industry.text = formatIndustry(newDetailsData.industry);

  const number_of_employees_range = getDetailByKey("number_of_employees_range");
  if (number_of_employees_range)
    number_of_employees_range.text = formatNumberOfEmployeesRange(
      newDetailsData.number_of_employees_range,
    );
};

const formatBillingAddress: ComputedRef<string> = computed(() => {
  const billingAddress = billing_address_form;
  const {
    country = "",
    postal_code = "",
    town_city = "",
    address_line_1 = "",
    address_line_2 = "",
  } = billingAddress;

  const displayAddressField =
    [address_line_1, address_line_2, country, town_city].join("").length > 0;
  return displayAddressField
    ? `${[address_line_1, address_line_2, country, town_city].filter((val) => !!val).join(", ")}, ${postal_code}`
    : "";
});
const populateInitialFormState = () => {
  initialFormState.value = organzationAlreadyHasBillingAddress.value
    ? { ...props.billingAddress }
    : { ...EMPTY_BILLING_ADDRESS };
};
const addBillingAddress = async () => {
  try {
    const createdBillingAddress =
      await billingAndInvoicingService.updateBillingAddress(
        props.organization?.id,
        billing_address_form,
      );
    return createdBillingAddress;
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Billing address could not be added",
      status: "error",
    });
  }
};
const updateBillingAddress = async () => {
  try {
    const updatedBillingAddress =
      await billingAndInvoicingService.updateBillingAddress(
        props.organization?.id,
        billing_address_form,
      );
    return updatedBillingAddress;
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Billing address could not be updated",
      status: "error",
    });
  }
};

const onToggleAddSSODialogVisibility = (mode?: string) => {
  closeDialog.value = mode !== "addSSO";
  toggleAddSSOConfigDialog();
};

const onEnterEditMode = () => {
  isInEditMode.value = true;
};

const onExitEditMode = () => {
  isInEditMode.value = false;
};

const onFormDismiss = () => {
  onExitEditMode();
  setFormData();
};

const onFormSubmit = async () => {
  v$.value.$touch();
  billing_address_v$.value.$touch();

  const billingFormInvalid =
    formatBillingAddress.value.length && billing_address_v$.value.$invalid;
  if (!v$.value.$invalid && !billingFormInvalid) {
    loading.value = true;
    if (!isOrganizationMFAConfigurable.value) delete form.value.mfa_required;
    const updateOrganizationPromise = organizationsService.updateOrganization(
      props.organization?.id,
      form.value,
    );

    const bookingAddressPromise = organzationAlreadyHasBillingAddress.value
      ? updateBillingAddress
      : addBillingAddress;

    const promises = [updateOrganizationPromise];
    if (isBillingAddressChanged.value) {
      promises.push(bookingAddressPromise());
    }
    const [updatedOrganization] = await Promise.all(promises);
    updateDetailsWithNewData(updatedOrganization);
    emit("update", updatedOrganization.id);
    loading.value = false;
    onExitEditMode();
  }
};
const customBillingValidationErrorsWrapper = (
  property: string,
): ErrorObject[] => {
  if (formatBillingAddress.value.length > 0)
    return billing_address_v$.value[property].$errors;
  else return [];
};
const customBillingValidationEventHandler = (property: string): void => {
  if (formatBillingAddress.value.length > 0)
    return billing_address_v$.value[property].$touch;
};

const getOrganizationSSOConfiguration = async () => {
  if (props.organization?.id) {
    try {
      organizationSSOConfig.value =
        await organizationsService.getOrganizationSSOConfig(
          props.organization?.id,
        );
      organizationHasSSOConfig.value = true;
    } catch (err) {
      organizationHasSSOConfig.value = false;
    }
  }
};

const removeOrganizationSSOConfig = async () => {
  isSSORemoving.value = true;
  try {
    const orgId = props.organization?.id;

    if (!orgId) {
      return;
    }

    await organizationsService.deleteOrganizationSSOConfig(orgId);

    eventBus.$emit("onShowToast", {
      text: "SSO IdP successfully removed",
      status: "info",
    });
    organizationHasSSOConfig.value = false;
    organizationSSOConfig.value = null;
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error removing organization SSO Config",
      status: "error",
    });
  } finally {
    isSSORemoving.value = false;
  }
};

const saveSSOConfiguration = async (ssoEnabled: boolean) => {
  isSSOSaving.value = true;
  try {
    const orgId = props.organization?.id;

    if (!orgId) {
      return;
    }

    const payload = {
      ...organizationSSOConfig.value,
      enabled: ssoEnabled,
    };

    await organizationsService.updateOrganizationSSOConfig(
      orgId,
      payload as OrganizationOIDCRead,
    );

    eventBus.$emit("onShowToast", {
      text: `${ssoEnabled ? "SSO IdP successfully enabled" : "SSO IdP successfully disabled"}`,
      status: "info",
    });
    await getOrganizationSSOConfiguration();

    if (ssoEnabled) organizationHasSSOConfig.value = true;
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to save SSO configuration",
      status: "error",
    });
  } finally {
    isSSOSaving.value = false;
  }
};

const setFormData = () => {
  formData.name = {
    name: "Name",
    value: props.organization?.name,
    placeholder: "Enter name",
    data_type: "string",
  };
  formData.domains = {
    name: "Domains",
    value: props.organization?.domains
      ? props.organization.domains
          ?.map((domain: OrganizationDomainSchema) => domain.name)
          .join(", ")
      : "",
    placeholder: "",
    data_type: "string",
    disabled: true,
  };
  formData.industry = {
    name: "Industry",
    value:
      INDUSTRIES.find(
        (industry) => industry.value === props.organization?.industry,
      ) || null,
    placeholder: "Select industry",
    data_type: "enum",
    options: INDUSTRIES,
  };
  formData.number_of_employees_range = {
    name: "Number of Employees Range",
    value:
      RANGE_OF_EMPLOYEES.find(
        (rangeOfEmployees) =>
          rangeOfEmployees.value ===
          props.organization?.number_of_employees_range,
      ) || null,
    placeholder: "Select range of employees",
    data_type: "enum",
    options: RANGE_OF_EMPLOYEES,
  };

  props.organization?.attributes?.forEach((attribute) => {
    const attributeKey = toSnakeCase(attribute.name);

    formData[attributeKey] = {
      ...attribute,
      placeholder: attribute.name,
      isAttribute: true,
    };

    if (attribute.data_type === "boolean") {
      formData[attributeKey].value = booleanItemsForSelect.find(
        (booleanItem) => booleanItem.value === attribute.value,
      );
    }

    if (attribute.data_type === "enum") {
      formData[attributeKey].value = {
        title: attribute.value,
        value: attribute.value,
      };
    }
  });
};

const setFormRules = () => {
  if (!props.organization?.attributes) return;

  props.organization.attributes.forEach((attribute) => {
    const formDataItemName = toSnakeCase(attribute.name);

    formRules[formDataItemName] = {};

    if (attribute.data_type === EnumDataType.UUID && attribute?.required) {
      formRules[formDataItemName].required = helpers.withMessage(
        `${attribute.name} should be correct UUID`,
        () => {
          const value = form.value.attributes[attribute.id];
          return value ? isValidUUID(`${value}`) : true;
        },
      );
    }

    const { min_length, max_length } = attribute.restrictions || {};
    if (min_length) {
      formRules[formDataItemName].minLength = helpers.withMessage(
        `${attribute.name} must be at least ${min_length} characters long`,
        () => {
          const value = form.value.attributes[attribute.id];
          return value ? value.length >= min_length : true;
        },
      );
    }
    if (max_length) {
      formRules[formDataItemName].maxLength = helpers.withMessage(
        `${attribute.name} must be at most ${min_length} characters long`,
        () => {
          const value = form.value.attributes[attribute.id];
          return value ? value.length <= max_length : true;
        },
      );
    }
  });
};

const generateMultiselectOptionsForEnum = (formItem: FormDataItem) =>
  formItem?.restrictions?.options || formItem?.options || [];

watch(
  () => formData,
  (newFormData) => {
    Object.entries(newFormData).forEach(([formDataItemName, attribute]) => {
      if (attribute?.data_type === "uuid") {
        const hasValue =
          typeof attribute.value === "string" && attribute.value.length > 0;

        if (hasValue || attribute.required) {
          if (!formRules[formDataItemName]) {
            formRules[formDataItemName] = {};
          }

          formRules[formDataItemName].required = helpers.withMessage(
            `${attribute.name} should be a valid UUID`,
            () =>
              hasValue ? isValidUUID(attribute.value) : !attribute.required,
          );
        } else {
          formRules[formDataItemName] = {};
        }
        v$.value?.[formDataItemName]?.$touch();
      }
    });
  },
  { deep: true },
);

onMounted(() => {
  populateInitialFormState();
  getOrganizationSSOConfiguration();
  setFormData();
  setFormRules();
});

watch(
  () => formatBillingAddress.value,
  (val) => {
    if (val.length === 0) billing_address_v$.value.$reset();
  },
);
</script>

<template>
  <div class="organization-details" :data-cy="organizationDetailsCypressId">
    <div class="mm-flex mm-flex-justify-between mm-flex-align-center mm-mb-8">
      <div
        class="mm-page-subtitle mm-page-subtitle--h2 mm-flex-align-center mm-table-header-description"
        data-cy="page-subtitle"
      >
        All the information available about your organization.
      </div>
      <m-m-button
        v-if="!isInEditMode"
        variant="outlined"
        class="edit-button"
        size="small"
        prepend-icon="pencil"
        cy="button-edit-details"
        :is-disabled="uiStore.isSCViewerOnly"
        @click="onEnterEditMode"
      >
        Edit
      </m-m-button>
      <div
        v-else
        class="mm-flex mm-flex-justify-end mm-flex-align-center mm-flex-grow mm-flex-gap-6"
      >
        <m-m-button
          variant="outlined"
          type="reset"
          size="small"
          data-cy="button-dismiss"
          @click="onFormDismiss"
        >
          Dismiss
        </m-m-button>
        <m-m-button
          variant="elevated"
          type="submit"
          size="small"
          :loading="loading"
          data-cy="button-save-changes"
          @click="onFormSubmit"
        >
          Save changes
        </m-m-button>
      </div>
    </div>
    <div v-if="!isInEditMode">
      <m-m-data-iterator
        :data="details"
        :columns="2"
        cy-id-text="organization-detail-item-text"
      />
      <div
        class="organization-details-sso-config mm-pa-12 mm-flex mm-flex-justify-between mm-flex-align-center mm-mt-10"
      >
        <div>
          <span
            class="organization-details-sso-config-title mm-fw-600"
            data-cy="organization-sso-config"
            >SSO configuration</span
          >
          <p class="organization-details-sso-config-sub-title mm-fw-400">
            Allow your users to login on their Veriam account with a third party
            application that hosts your users’ accounts. When this is enabled,
            all users within your organization will be able to login with this
            external account.
          </p>
        </div>
        <div class="mm-flex mm-flex-align-center">
          <m-m-button
            v-if="showAddSSOBtn"
            variant="outlined"
            class="mm-ml-auto"
            size="small"
            prepend-icon="plus"
            cy="button-add-sso-config"
            :is-disabled="uiStore.isSCViewerOnly"
            @click="onToggleAddSSODialogVisibility('addSSO')"
          >
            Add SSO
          </m-m-button>
          <div class="mm-flex mm-flex-gap-10">
            <div
              v-if="showEditEnableDisableAndRemoveSSOBtns"
              class="mm-flex mm-flex-gap-10"
            >
              <m-m-button
                variant="outlined"
                class="mm-ml-auto"
                size="small"
                prepend-icon="pencil"
                cy="button-edit-sso-config"
                @click="onToggleAddSSODialogVisibility"
              >
                Edit SSO
              </m-m-button>
              <m-m-button
                v-if="!organizationSSOConfig?.enabled"
                variant="elevated"
                size="small"
                prepend-icon="play"
                :loading="isSSOSaving"
                icon-height="14px"
                cy="button-enable-sso-config"
                @click="saveSSOConfiguration(true)"
              >
                Enable SSO
              </m-m-button>
              <m-m-button
                v-if="organizationSSOConfig?.enabled"
                variant="text-danger"
                class="mm-ml-auto"
                size="small"
                :loading="isSSOSaving"
                icon-height="16px"
                prepend-icon="ban"
                cy="button-disable-sso-config"
                @click="saveSSOConfiguration(false)"
              >
                Disable SSO
              </m-m-button>
              <m-m-button
                variant="danger"
                class="mm-ml-auto"
                size="small"
                :loading="isSSORemoving"
                icon-height="16px"
                cy="button-remove-sso-config"
                @click="removeOrganizationSSOConfig"
              >
                Remove SSO
              </m-m-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <m-m-card v-else>
      <form
        v-mm-focus-first
        class="mm-pa-12 mm-grid mm-grid-columns-2 mm-grid-row-gap-12 mm-grid-column-gap-16"
      >
        <div v-for="(formItem, key) in formData" :key="key">
          <m-m-input
            v-if="
              formItem.data_type === 'string' || formItem.data_type === 'uuid'
            "
            v-model="formItem.value"
            :disabled="formItem?.disabled"
            :label="formItem.name"
            :placeholder="formItem.placeholder"
            :errors="v$[key]?.$errors"
            @update:model-value="v$[key]?.$touch"
          />
          <m-m-multiselect
            v-if="formItem.data_type === 'enum'"
            v-model="formItem.value"
            :options="generateMultiselectOptionsForEnum(formItem)"
            :label="formItem.name"
            :placeholder="formItem.placeholder"
            :errors="v$[key]?.$errors"
            @blur="onBlur(key)"
          />
          <m-m-multiselect
            v-if="formItem.data_type === 'boolean'"
            v-model="formItem.value"
            :options="booleanItemsForSelect"
            :label="formItem.name"
            :placeholder="formItem.placeholder"
            :errors="v$[key]?.$errors"
            @blur="onBlur(key)"
          />
          <template v-if="formItem.data_type === 'date'">
            <m-m-field-label :label="formItem.name" />
            <m-m-datepicker
              v-model="formItem.value"
              placeholder="Select date"
              :datepicker-shortcuts="shortcutsForDatepickers.datetime"
              time-title-format="MMMM DD, YYYY"
              format="MMMM DD, YYYY"
              type="date"
              errors-position="absolute"
              :errors="v$[key]?.$errors"
            />
          </template>
        </div>
        <div v-if="isOrganizationMFAConfigurable" class="mm-mt-4">
          <m-m-field-label label="Require MFA on all logins" />
          <m-m-toggle-button v-model="form.mfa_required" />
          <div class="mm-flex mm-flex-align-center mm-flex-gap-2 mm-mt-2">
            <m-m-icon
              icon="info"
              width="15px"
              height="15px"
              stroke="#475467"
              class="info-icon"
            />
            <span class="mm-page-options-hint">
              Enabling this will force all users to use MFA when logging in to
              application.
            </span>
          </div>
        </div>
      </form>
      <m-m-divider />
      <template v-if="billingAddressEnabled">
        <div class="billing-address-header-title mm-pl-12 mm-pt-12">
          Billing address
        </div>
        <form
          class="mm-pa-12 mm-grid mm-grid-columns-2 mm-grid-row-gap-12 mm-grid-column-gap-16"
        >
          <m-m-input
            v-model="billing_address_form.country"
            :required="formatBillingAddress.length"
            label="Country"
            placeholder="Country"
            data-cy="input-country"
            :errors="customBillingValidationErrorsWrapper('country')"
            @blur="customBillingValidationEventHandler('country')"
          />
          <m-m-input
            v-model="billing_address_form.address_line_1"
            label="Street address line 1"
            :required="formatBillingAddress.length"
            placeholder="Street address line 1"
            data-cy="input-address-line-1"
            :errors="customBillingValidationErrorsWrapper('address_line_1')"
            @blur="customBillingValidationEventHandler('address_line_1')"
          />
          <m-m-input
            v-model="billing_address_form.address_line_2"
            label="Street address line 2"
            placeholder="Street address line 2"
            data-cy="input-address-line-2"
          />
          <m-m-input
            v-model="billing_address_form.postal_code"
            label="Postal code"
            :required="formatBillingAddress.length"
            placeholder="Postal code"
            data-cy="input-postal-code"
            :errors="customBillingValidationErrorsWrapper('postal_code')"
            @blur="customBillingValidationEventHandler('postal_code')"
          />
          <m-m-input
            v-model="billing_address_form.town_city"
            label="City / Town"
            :required="formatBillingAddress.length"
            placeholder="City / Town"
            data-cy="input-city-town"
            :errors="customBillingValidationErrorsWrapper('town_city')"
            @blur="customBillingValidationEventHandler('town_city')"
          />
        </form>
      </template>
    </m-m-card>
  </div>

  <dialog-add-organization-s-s-o-config
    v-if="isAddSSOConfigDialogOpen"
    :organization-s-s-o-config="organizationSSOConfig"
    :organization="organization"
    :is-open="isAddSSOConfigDialogOpen"
    :close-dialog="closeDialog"
    @close="toggleAddSSOConfigDialog"
    @submit="getOrganizationSSOConfiguration"
  />
</template>

<style lang="scss" scoped>
.organization-details {
  &-sso-config {
    width: 100%;
    border: 1px solid #d0d5dd;
    min-height: 100px;
    border-radius: 16px;
    &-title {
      line-height: 28px;
      font-size: 18px;
      color: #384250;
    }
    &-sub-title {
      color: #475467;
      line-height: 20px;
      font-size: 14px;
    }
  }
}
.billing-address-header-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
  color: #101828;
}
</style>
