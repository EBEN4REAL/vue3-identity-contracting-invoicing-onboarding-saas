<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  Ref,
  ComputedRef,
  watch,
} from "vue";
import { usersService } from "~/users/users.service";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { onboardingServiceAuth } from "~/onboarding/onboarding.service";
import {
  UserRead,
  UserEmailRead,
  UserSocialAccountRead,
  AttributeRead,
  OrganizationUserUpdate,
} from "~/iam/iam.types";
import { ORGANIZATION_USER_STATUS_MAP } from "~/common/constants";
import { TypeDataIteratorItem } from "~/mm_ui_kit/src/types/dataIterator.types";
import ChangeEmailDialog from "~/users/ChangeEmailDialog.vue";
import {
  FormDataItem,
  OnboardingFormData,
  ServiceProviderAttributesConsentsRead,
} from "~/onboarding/onboarding.types";
import { TableHeader } from "~/mm_ui_kit/src/types/table.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import DialogReviewConsent from "./Dialogs/DialogReviewConsent.vue";
import { TypeIdName } from "~/common/types";
import { useFlag } from "@unleash/proxy-client-vue";
import DialogDeleteUserAccount from "./Dialogs/DialogDeleteUserAccount.vue";
import { Button } from "~/mm_ui_kit/src/types/overviewPage.types";
import {
  pruneNonEditableAttributes,
  toSnakeCase,
} from "~/mm_ui_kit/src/helpers/utils";
import { EnumDataType } from "~/attribute-types/types";
import { helpers } from "@vuelidate/validators";
import { isValidUUID } from "~/mm_ui_kit/src/helpers/errorIDValidator";
import useVuelidate from "@vuelidate/core";
import { shortcutsForDatepickers } from "~/onboarding/constants";
import dayjs from "dayjs";

const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isFormVisible: Ref<boolean> = ref(false);
const isEmailDialogVisible: Ref<boolean> = ref(false);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const user: Ref<UserRead | null> = ref(null);
const userSocialAccounts: Ref<UserSocialAccountRead[]> = ref([]);
const isConfirmDeleteEmailDialogOpen: Ref<boolean> = ref(false);
const pendingEmail: Ref<UserEmailRead | null> = ref(null);
const consents: Ref<ServiceProviderAttributesConsentsRead[]> = ref([]);
const consentToReview: Ref<ServiceProviderAttributesConsentsRead | null> =
  ref(null);
const isDialogReviewConsentOpen: Ref<boolean> = ref(false);
const isDialogReviewConsentButtonSubmitDisabled: Ref<boolean> = ref(false);
const isDialogReviewConsentButtonSubmitLoading: Ref<boolean> = ref(false);
const isConsentsUserEnabled = useFlag("consents_user");
const isDialogDeleteAccountOpen: Ref<boolean> = ref(false);
const isConsentsLoading: Ref<boolean> = ref(true);

const ORGANIZATION_ACCOUNTS_HEADERS = [
  { key: "organization", label: "Organization name" },
  { key: "status", label: "Status" },
];

const tableHeadersConsents: TableHeader[] = [
  {
    key: "name",
    label: "Organization name",
  },
  {
    key: "consent_date",
    label: "Consent given on",
  },
  {
    key: "actions",
    label: "",
  },
];

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

const isFormItemDisabled = (formItem?: {
  disabled?: boolean;
  editable?: boolean;
}) => !!(formItem?.disabled || !formItem?.editable);

const changeEmailDisabledReason: ComputedRef<string> = computed(() =>
  userSocialAccounts.value.length > 0
    ? "Your email address cannot be changed because you have a connected Single Sign-On (SSO) account."
    : "",
);

const localCopyUserData = reactive({
  first_name: "",
  last_name: "",
  email: "",
  pendingEmail: "",
  phone_number: "",
  organization_users: [{}],
});

const userDataEmailButtonAppended: ComputedRef<string> = computed(() =>
  localCopyUserData.pendingEmail ? "" : "Change",
);

const attributeTypesForConsentToReview: ComputedRef<TypeIdName[]> = computed(
  () =>
    consentToReview.value?.attributes.map(
      (attributeType) => attributeType.type,
    ) || [],
);

const resetLocalCopyUserData = () => {
  if (!user.value) return;

  localCopyUserData.first_name = user.value.first_name;
  localCopyUserData.last_name = user.value.last_name;
  localCopyUserData.email = user.value.email;
  localCopyUserData.pendingEmail = pendingEmail.value?.email;
  localCopyUserData.organization_users = user.value.organization_users;
};

const getUser = async () => {
  user.value = await usersService.getUserMe();
  resetLocalCopyUserData();
};

const getUserMeConsents = async () => {
  try {
    isConsentsLoading.value = true;
    consents.value = await onboardingServiceAuth.getUserMeConsents();
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch consents",
      status: "error",
    });
  } finally {
    isConsentsLoading.value = false;
  }
};

const getUserEmails = async () => {
  const emails = await usersService.getUserMeEmails();
  const pendingObj = emails.find((e) => !e.verified);
  pendingEmail.value = pendingObj ? pendingObj : null;
  if (!pendingEmail.value) return;
  localCopyUserData.pendingEmail = pendingEmail.value.email;
};
const getUserSocialAccounts = async () => {
  userSocialAccounts.value = await usersService.getUserMeSocialAccounts();
};

const deleteUserEmail = async () => {
  if (!pendingEmail.value) return;

  isButtonSubmitLoading.value = true;
  isButtonSubmitDisabled.value = true;
  const email_id = pendingEmail.value?.id;
  await usersService.deleteUserEmail(email_id);
  toggleConfirmEmailDelete();
  pendingEmail.value = null;
  localCopyUserData.pendingEmail = null;
  isButtonSubmitLoading.value = false;
  isButtonSubmitDisabled.value = false;
};

const saveUser = async (e: Event) => {
  e.preventDefault();
  if (user.value) {
    isButtonSubmitLoading.value = true;
    normaliseDateValues();
    user.value = await usersService.updateUserMe({
      first_name: localCopyUserData.first_name,
      last_name: localCopyUserData.last_name,
      attributes: pruneNonEditableAttributes(form.value.attributes, formData),
    });
    resetLocalCopyUserData();
    toggleForm();
    isButtonSubmitLoading.value = false;
  }
};

const completeChangeEmail = async () => {
  await getUserEmails();
  toggleEmailDialog();
};

const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value;

  if (isFormVisible.value) {
    resetLocalCopyUserData();
  }
};

const toggleEmailDialog = () => {
  isEmailDialogVisible.value = !isEmailDialogVisible.value;
};

const toggleConfirmEmailDelete = () => {
  isConfirmDeleteEmailDialogOpen.value = !isConfirmDeleteEmailDialogOpen.value;
};

const toggleAccountDeleteDialog = () => {
  isDialogDeleteAccountOpen.value = !isDialogDeleteAccountOpen.value;
};

const formattedAttributes: ComputedRef<AttributeRead[]> = computed(() => {
  return (user.value?.attributes ?? []).map((attr) => {
    if (attr.data_type !== "date" || typeof attr.value !== "string")
      return attr;

    const parsed = dayjs(attr.value, ["YYYY-MM-DD", "MMMM DD, YYYY"], true);
    return parsed.isValid()
      ? { ...attr, value: parsed.format("MMMM DD, YYYY") }
      : attr;
  });
});

const userDetails = computed((): TypeDataIteratorItem[] => {
  const details = [
    {
      label: "First name",
      text: user.value?.first_name || "",
      isEmpty: !user.value?.first_name,
    },
    {
      label: "Last name",
      text: user.value?.last_name || "",
      isEmpty: !user.value?.last_name,
    },
    {
      label: "Email address",
      text: user.value?.email || "",
      isEmpty: !user.value?.email,
    },
  ];
  if (pendingEmail.value?.email)
    details.push({
      label: "Pending email address",
      text: pendingEmail.value?.email,
      isEmpty: false,
    });

  if (formattedAttributes.value) {
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

    details.push(
      ...formattedAttributes.value
        .filter((attr) => attr.editable)
        .map((attr: AttributeRead) => ({
          key: toSnakeCase(attr.name),
          label: attr.name,
          text: generateText(attr),
          isEmpty: generateIsEmpty(attr.value),
        })),
    );
  }

  return details;
});

const consentOrganizationsCount: ComputedRef<number> = computed(
  () => consents.value.length,
);

const organizationNameInConsentToReview: ComputedRef<string> = computed(
  () => consentToReview.value?.name || "-",
);

const organizationName = (row: ServiceProviderAttributesConsentsRead) =>
  row.name || "-";

const dropdownItems = (
  consent: ServiceProviderAttributesConsentsRead,
): TypeDropdownItem[] => [
  {
    label: "Review consent",
    type: "button",
    onClick: () => onOpenDialogReviewConsent(consent),
  },
];

const onOpenDialogReviewConsent = (
  consent: ServiceProviderAttributesConsentsRead,
) => {
  consentToReview.value = consent;
  isDialogReviewConsentOpen.value = true;
};

const onCloseDialogReviewConsent = () => {
  consentToReview.value = null;
  isDialogReviewConsentOpen.value = false;
};

const onSubmitDialogReviewConsent = async () => {
  if (!consentToReview.value) return;

  try {
    isDialogReviewConsentButtonSubmitDisabled.value = true;
    isDialogReviewConsentButtonSubmitLoading.value = true;

    await onboardingServiceAuth.deleteUserMeConsent(
      consentToReview.value.id as string,
    );
    await getUserMeConsents();
    eventBus.$emit("onShowToast", {
      text: `Consent for ${consentToReview.value.name} is removed successfully.`,
      status: "info",
    });
    onCloseDialogReviewConsent();
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to remove consent",
      status: "error",
    });
  } finally {
    isDialogReviewConsentButtonSubmitDisabled.value = false;
    isDialogReviewConsentButtonSubmitLoading.value = false;
  }
};

const buttons: ComputedRef<Button[]> = computed(() => [
  {
    key: "edit_button",
    action: toggleForm,
    isVisible: !isFormVisible.value,
  },
  {
    key: "cancel_button",
    action: toggleForm,
    isVisible: isFormVisible.value,
  },
  {
    key: "save_button",
    action: saveUser,
    isVisible: isFormVisible.value,
    isLoading: isButtonSubmitLoading.value,
  },
]);

const formData: OnboardingFormData = reactive({});

const form: ComputedRef<OrganizationUserUpdate> = computed(() => {
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
    attributes:
      Object.keys(generatedAttributes).length === 0
        ? null
        : generatedAttributes,
  } as OrganizationUserUpdate;
});

const normaliseDateValues = () => {
  Object.values(formData).forEach((attr) => {
    if (attr?.data_type === "date" && attr?.value) {
      const parsed = dayjs(attr.value);
      if (parsed.isValid()) {
        form.value.attributes[attr.id] = parsed.format("YYYY-MM-DD");
      }
    }
  });
};

const formRules = reactive({});

const v$ = useVuelidate(formRules, formData);

const setFormData = () => {
  formattedAttributes.value?.forEach((attribute) => {
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
  if (!formattedAttributes.value) return;

  formattedAttributes.value.forEach((attribute) => {
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
        `${attribute.name} must be at most ${max_length} characters long`,
        () => {
          const value = form.value.attributes[attribute.id];
          return value ? value.length <= max_length : true;
        },
      );
    }
  });
};

const isTextInput = (item: FormDataItem) =>
  ["string", "uuid"].includes(item?.data_type ?? "") &&
  !isFormItemDisabled(item);

const isEnumSelect = (item: FormDataItem) =>
  item?.data_type === "enum" && !isFormItemDisabled(item);

const isBooleanSelect = (item: FormDataItem) =>
  item?.data_type === "boolean" && !isFormItemDisabled(item);

const isDateAttribute = (item: FormDataItem) =>
  item?.data_type === "date" && !isFormItemDisabled(item);

const generateMultiselectOptionsForEnum = (formItem: FormDataItem) =>
  formItem?.restrictions?.options || formItem?.options || [];

const onBlur = (key: string) => {
  if (v$.value[key]?.$dirty) v$.value[key].$touch();
};

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

onMounted(async () => {
  userProfile.value = await authService.getProfile();

  if (isConsentsUserEnabled.value) await getUserMeConsents();

  await Promise.all([getUser(), getUserEmails(), getUserSocialAccounts()]);
  setFormData();
  setFormRules();
});
</script>

<template>
  <m-m-overview-page
    resource-id="profile"
    :show-config-banner="false"
    :buttons="buttons"
  />
  <div class="user-profile-page">
    <m-m-card v-if="isFormVisible" header-variant="header-lighter">
      <form
        v-mm-focus-first
        class="mm-pa-16 mm-grid mm-grid-columns-2 mm-grid-row-gap-12 mm-grid-column-gap-16"
        @submit="saveUser"
      >
        <m-m-input
          v-model="localCopyUserData.first_name"
          label="First Name"
          cy="firstNameInput"
        />
        <m-m-input
          v-model="localCopyUserData.last_name"
          label="Last Name"
          cy="secondNameInput"
        />
        <m-m-input
          v-model="localCopyUserData.email"
          :disabled="true"
          label="Email Address (Current)"
          cy="emailInput"
          :button-appended="userDataEmailButtonAppended"
          :button-appended-disabled-reason="changeEmailDisabledReason"
          @click:append="toggleEmailDialog"
        />
        <m-m-input
          v-if="localCopyUserData.pendingEmail"
          v-model="localCopyUserData.pendingEmail"
          :disabled="true"
          label="Email address (pending confirmation)"
          cy="pendingEmailInput"
          class="mt-4"
          button-appended="Delete"
          @click:append="toggleConfirmEmailDelete"
        />
        <div v-for="(formItem, key) in formData" :key="key">
          <m-m-input
            v-if="isTextInput(formItem)"
            v-model="formItem.value"
            :disabled="isFormItemDisabled(formItem)"
            :label="formItem?.name"
            :placeholder="formItem.placeholder"
            :errors="v$[key]?.$errors"
            @update:model-value="v$[key]?.$touch"
          />
          <m-m-multiselect
            v-if="isEnumSelect(formItem)"
            v-model="formItem.value"
            :options="generateMultiselectOptionsForEnum(formItem)"
            :is-multiselect-disabled="isFormItemDisabled(formItem)"
            :label="formItem?.name"
            :placeholder="formItem.placeholder"
            :errors="v$[key]?.$errors"
            @blur="onBlur(key)"
          />
          <m-m-multiselect
            v-if="isBooleanSelect(formItem)"
            v-model="formItem.value"
            :options="booleanItemsForSelect"
            :is-multiselect-disabled="isFormItemDisabled(formItem)"
            :label="formItem?.name"
            :placeholder="formItem.placeholder"
            :errors="v$[key]?.$errors"
            @blur="onBlur(key)"
          />
          <template v-if="isDateAttribute(formItem)">
            <m-m-field-label :label="formItem.name" />
            <m-m-datepicker
              v-model="formItem.value"
              placeholder="Select date"
              :is-disabled="isFormItemDisabled(formItem)"
              :datepicker-shortcuts="shortcutsForDatepickers.datetime"
              time-title-format="MMMM DD, YYYY"
              format="MMMM DD, YYYY"
              type="date"
              errors-position="absolute"
              :errors="v$[key]?.$errors"
            />
          </template>
        </div>
      </form>
    </m-m-card>
    <m-m-data-iterator
      v-else
      :data="userDetails"
      :columns="2"
      cy-id-data-iterator="user-profile-details"
      cy-id-text="user-profile-detail-item-text"
    />

    <template v-if="isConsentsUserEnabled">
      <m-m-divider class="mm-my-12" />

      <div class="mm-mb-8">
        <h2 class="mm-page-title mm-page-title--h2">Сonsents</h2>
        <div class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8">
          You have given consents to
          <span class="mm-fw-700" data-cy="consent-organizations-count">
            {{ consentOrganizationsCount }}
          </span>
          organizations
        </div>
        <m-m-table
          :headers="tableHeadersConsents"
          :rows="consents"
          :is-loading="isConsentsLoading"
          cy="table-consents"
        >
          <template #name="{ row }">
            {{ organizationName(row) }}
          </template>
          <template #consent_date="{ row }">
            <m-m-formatted-date
              :raw-date="row.consent_date"
              format="DD MMM YYYY, HH:mm A"
            />
          </template>
          <template #actions="{ row }">
            <m-m-dropdown
              :cy="`dropdown-${row.id}`"
              :items="dropdownItems(row)"
            >
              <template #activator>
                <m-m-button
                  prepend-icon="dots-vertical"
                  variant="text"
                  :cy="`actions-button-${row.id}`"
                />
              </template>
            </m-m-dropdown>
          </template>
        </m-m-table>
      </div>
    </template>

    <m-m-divider class="mm-my-12" />

    <div>
      <div class="mm-mb-8">
        <h2 class="mm-page-title mm-page-title--h2">Organizations</h2>
        <div class="mm-page-subtitle mm-page-subtitle--h2">
          List of all organizations you have an account for
        </div>
      </div>
      <m-m-table
        :headers="ORGANIZATION_ACCOUNTS_HEADERS"
        :rows="localCopyUserData.organization_users"
        cy="user-org-accounts"
      >
        <template #organization="{ row }">
          {{ row.organization?.name || "" }}
        </template>
        <template #status="{ row }">
          <m-m-badge
            :status="ORGANIZATION_USER_STATUS_MAP[row.status]"
            indicator
          />
        </template>
      </m-m-table>
    </div>

    <m-m-divider class="mm-my-12" />
    <div class="m-delete-account">
      <div class="mm-mb-12">
        <h2 class="mm-page-title mm-page-title--h2">Delete account</h2>
        <div class="mm-page-subtitle mm-page-subtitle--h2">
          Once you delete your account, there is no going back. Please be
          certain.
        </div>
      </div>
      <div>
        <m-m-button
          variant="outlined-danger"
          size="small"
          prepend-icon="trash"
          cy="delete-account-button"
          @click="toggleAccountDeleteDialog"
        >
          Delete account
        </m-m-button>
      </div>
    </div>

    <change-email-dialog
      v-if="userProfile?.email"
      :is-open="isEmailDialogVisible"
      :username="userProfile?.email"
      @close="completeChangeEmail"
    />

    <m-m-dialog
      :is-open="isConfirmDeleteEmailDialogOpen"
      title="Delete user email"
      icon="trash"
      subtitle="Are you sure you want to delete this email?"
      @close="toggleConfirmEmailDelete"
    >
      <template #footer>
        <m-m-button
          variant="outlined"
          data-cy="button-cancel-delete-sub-organization"
          @click="toggleConfirmEmailDelete"
        >
          Cancel
        </m-m-button>
        <m-m-button
          variant="danger"
          :loading="isButtonSubmitLoading"
          :is-disabled="isButtonSubmitDisabled"
          data-cy="button-confirm-delete-pending-email"
          @click="deleteUserEmail"
        >
          Delete
        </m-m-button>
      </template>
    </m-m-dialog>
  </div>

  <dialog-delete-user-account
    :is-open="isDialogDeleteAccountOpen"
    :username="userProfile?.email as string"
    @close="toggleAccountDeleteDialog"
  />

  <dialog-review-consent
    :is-open="isDialogReviewConsentOpen"
    :organization-name="organizationNameInConsentToReview"
    :attribute-types="attributeTypesForConsentToReview"
    :is-button-submit-disabled="isDialogReviewConsentButtonSubmitDisabled"
    :is-button-submit-loading="isDialogReviewConsentButtonSubmitLoading"
    @close="onCloseDialogReviewConsent"
    @submit="onSubmitDialogReviewConsent"
  />
</template>

<style scoped lang="scss">
.remove-connection-button {
  line-height: 20px;
  color: #b42318;
}
.users-profile {
  &-no-accounts {
    color: #6c737f;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
