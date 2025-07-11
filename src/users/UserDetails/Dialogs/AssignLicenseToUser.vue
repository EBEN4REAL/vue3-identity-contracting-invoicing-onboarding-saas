<script lang="ts" setup>
import {
  reactive,
  ref,
  Ref,
  onMounted,
  computed,
  ComputedRef,
  PropType,
  watch,
} from "vue";
import { ServiceConsumerAgreementRead } from "~/organizations/licenses/licenses.types";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { TableRequestParams } from "~/mm_ui_kit/src/types/table.types";
import { policiesService } from "~/service-providers/policies.service";
import {
  TypeAllocateLicenseToUserFormRules,
  TypeAllocateLicenseToUserForm,
  TypeValidatorAllocateLicenseToUserForm,
  SubmitType,
  ErrorAlertProp,
} from "~/service-providers/Licenses/licenses.types";
import { OrganizationUserRead } from "~/iam/iam.types";
import { PolicyUsageRead } from "~/policies/policies.types";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { TypeFormattedLicenses } from "~/organizations/OrganizationGroups/types";

const emit = defineEmits(["close", "submit", "updateOrgLicenses"]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  serviceConsumerId: {
    type: String,
    default: "",
  },
  user: {
    type: Object as PropType<OrganizationUserRead>,
    required: true,
  },
  errorAlert: {
    type: Object as PropType<ErrorAlertProp>,
    required: true,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  assignedLicenses: {
    type: Array as PropType<ServiceConsumerAgreementRead[]>,
    default: () => [],
  },
  category: {
    type: String,
    default: "",
  },
});

const userDetails: ComputedRef<string> = computed(() => {
  if (props.user.first_name && props.user.last_name) {
    return `${props.user.first_name} ${props.user.last_name}`;
  }
  return props.user.email;
});

const dialogTitle: ComputedRef<string> = computed(
  () =>
    `Assign ${props.category === "SUBSCRIPTION" ? "Subscription" : "License"} to ${userDetails.value}`,
);
const DEFAULT_PAGINATION = { limit: "10", offset: "0" };
const isAlertVisible: Ref<boolean> = ref(false);
const agreements: Ref<ServiceConsumerAgreementRead[]> = ref([]);
const policies: Ref<PolicyUsageRead[]> = ref([]);
const totalItems: Ref<number> = ref(0);
const isLoading: Ref<boolean> = ref(false);

const formattedLicenses: ComputedRef<TypeFormattedLicenses[]> = computed(() => {
  const assignedLicenseIds = new Set(
    props.assignedLicenses?.map(
      (license: ServiceConsumerAgreementRead) => license.id,
    ),
  );

  return agreements.value.map((agreement) => ({
    value: agreement.id,
    name: agreement.agreement_type_name,
    disabled: assignedLicenseIds.has(agreement.id),
  }));
});

const selectLicenseClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () => props.isSaving || !Boolean(form.agreement_id),
);

const form = reactive<TypeAllocateLicenseToUserForm>({
  agreement_id: "",
  optional_policy_ids: [],
});

const formRules: TypeAllocateLicenseToUserFormRules = {
  agreement_id: {
    required: helpers.withMessage(
      `${props.category === "SUBSCRIPTION" ? "Subscription" : "License"} is required`,
      required,
    ),
  },
};

const v$: TypeValidatorAllocateLicenseToUserForm = useVuelidate(
  formRules,
  form,
);

const getPolicies = async (agreement_id: string) => {
  if (agreement_id) {
    isLoading.value = true;

    const response = await policiesService.getServiceConsumerAgreementPolicies(
      props.serviceConsumerId as string,
      agreement_id,
    );

    isLoading.value = false;

    policies.value = response;
  }
};

const getAgreementTypes = async (params: TableRequestParams) => {
  isLoading.value = true;

  const agreementRes = await policiesService.getServiceConsumerAgreements(
    props.serviceConsumerId as string,
    {
      ...params,
      cancelled: false,
      category: props.category,
    },
  );

  isLoading.value = false;

  totalItems.value = agreementRes?.total || 0;
  agreements.value = agreementRes?.results || [];

  emit("updateOrgLicenses", agreements.value);
};
const onSelectAgreementTypeScrolledToEnd = async (
  params: TableRequestParams,
) => {
  await getAgreementTypes(params);
};

const closeModal = () => {
  resetForm();
  emit("close");
};

const resetForm = () => {
  setTimeout(() => {
    form.agreement_id = "";
    form.optional_policy_ids = [];
    props.errorAlert!.resetErrorState();
  }, 100);
  v$.value.$reset();
};

const submitForm = async () => {
  const validationResult = await v$.value.$validate();

  if (!validationResult) {
    return;
  }

  const assignedLicense: SubmitType = {
    agreement_id: form.agreement_id,
    optional_policy_ids: form.optional_policy_ids,
  };
  policies.value = [];
  agreements.value = [];
  emit("submit", assignedLicense);
  closeModal();
};

watch(
  () => form.agreement_id,
  () => {
    if (!form.agreement_id) {
      policies.value = [];
    }
  },
);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  await getAgreementTypes(DEFAULT_PAGINATION);
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="dialogTitle"
    icon="document-check"
    :cy="`assign-${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}-dialog`"
    @close="closeModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        :status="AlertTypes['Error']"
        cy="assign-license-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ errorAlert!.alertText }}
      </m-m-alert>
      <form
        v-mm-focus-first
        class="mm-page-dialog-form"
        data-cy="assign-license-form"
      >
        <div>
          <m-m-autocomplete
            id="autocomplete"
            v-model="form.agreement_id"
            :errors="v$.agreement_id.$errors"
            :placeholder="`Click to assign ${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}`"
            :label="`Search & add ${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}`"
            :cy="`assign-${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}-to-user-autocomplete`"
            icon-prepended="search-lg"
            clear-button="x-circle"
            :items="formattedLicenses"
            :total-items="totalItems"
            item-title="name"
            item-value="value"
            required
            :loading="isLoading"
            @update:model-value="getPolicies"
            @update-params="onSelectAgreementTypeScrolledToEnd"
          >
            <template #option="{ item }">
              <div class="mm-flex mm-flex-justify-between mm-w-10">
                <div :class="selectLicenseClassList(item.disabled)">
                  {{ item.name }}
                  <div
                    v-if="item.disabled"
                    class="mm-flex mm-flex-justify-between mm-flex-grow"
                  >
                    <m-m-badge
                      class="mm-ml-3"
                      :status="BadgeTypes.Inactive"
                      text="Already added"
                      cy="badge-added"
                    />
                    <m-m-icon icon="check-thin-primary" width="12px" />
                  </div>
                </div>
              </div>
            </template>
          </m-m-autocomplete>
        </div>
        <div v-if="policies?.length" data-cy="optional-policies">
          <div class="mm-page-form-label">Assign optional policies</div>
          <div v-for="policy in policies" :key="policy.id" class="mm-mt-8">
            <m-m-checkbox
              v-model="form.optional_policy_ids"
              :value="policy.id"
              name="optional_policy_ids"
              >{{ policy.name }}</m-m-checkbox
            >
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal"> Dismiss </m-m-button>
      <m-m-button
        variant="elevated"
        :cy="`assign-${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}-to-user-submit-button`"
        :is-disabled="isButtonSubmitDisabled"
        :loading="isSaving"
        prepend-icon="plus-white"
        @click="submitForm"
      >
        Assign
        {{ props.category === "SUBSCRIPTION" ? "Subscription" : "License" }}
      </m-m-button>
    </template>
  </m-m-dialog>
</template>
