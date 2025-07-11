<script lang="ts" setup>
import {
  reactive,
  ref,
  Ref,
  onMounted,
  ComputedRef,
  computed,
  watch,
} from "vue";
import { PropType } from "vue";
import { OrganizationGroupRead } from "~/iam/iam.types";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { TableRequestParams } from "~/mm_ui_kit/src/types/table.types";
import { policiesService } from "~/service-providers/policies.service";
import { ServiceConsumerAgreementRead } from "~/organizations/licenses/licenses.types";
import {
  TypeAllocateLicenseToGroupForm,
  TypeAllocateLicenseToGroupFormRules,
  TypeValidatorAllocateLicenseToGroupForm,
} from "~/service-providers/Licenses/licenses.types";
import { PolicyUsageRead } from "~/policies/policies.types";
import { TypeFormattedLicenses } from "../types";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";

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
  group: {
    type: Object as PropType<OrganizationGroupRead>,
    required: true,
  },
  assignedLicenses: {
    type: Array as PropType<TypeFormattedLicenses[]>,
    default: () => [],
  },
  category: {
    type: String,
    default: "",
  },
});

const isLoading: Ref<boolean> = ref(false);
const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const isButtonSubmitDisabled: Ref<boolean> = ref(true);
const isButtonSubmitLoading: Ref<boolean> = ref(false);
const agreements: Ref<ServiceConsumerAgreementRead[]> = ref([]);
const policies: Ref<PolicyUsageRead[]> = ref([]);
const totalItems: Ref<number> = ref(0);

const form = reactive<TypeAllocateLicenseToGroupForm>({
  agreement_id: props.group.id || "",
  optional_policy_ids: [],
});

const formRules: TypeAllocateLicenseToGroupFormRules = {
  agreement_id: {
    required: helpers.withMessage(
      `${props.category === "SUBSCRIPTION" ? "Subscription" : "License"} is required`,
      required,
    ),
  },
};

const v$: TypeValidatorAllocateLicenseToGroupForm = useVuelidate(
  formRules,
  form,
);

const formattedLicenses: ComputedRef<TypeFormattedLicenses[]> = computed(() => {
  const assignedLicenseIds = new Set(
    props.assignedLicenses?.map((license: TypeFormattedLicenses) => license.id),
  );

  return (agreements.value || []).map((agreement) => ({
    value: agreement.id,
    name: agreement.agreement_type_name,
    disabled: assignedLicenseIds.has(agreement.id),
  }));
});

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

  agreements.value = agreementRes?.results || [];
  totalItems.value = agreementRes?.total || 0;

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
    isAlertVisible.value = false;
    alertText.value = "";
  }, 100);
  v$.value.$reset();
};

const submitForm = async () => {
  const validationResult = await v$.value.$validate();

  if (!validationResult) {
    return;
  }

  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;

    await policiesService.assignServiceConsumerAgreementToGroup(
      props.serviceConsumerId as string,
      form.agreement_id,
      props.group.id as string,
      form.optional_policy_ids,
    );

    emit("submit");
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
    closeModal();
    agreements.value = [];
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value = "Failed to add license to group";
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};

const selectLicenseClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

watch(
  () => form.agreement_id,
  () => {
    if (!form.agreement_id) {
      policies.value = [];
    }

    isButtonSubmitDisabled.value = !form.agreement_id;
  },
);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  await getAgreementTypes({ limit: "10", offset: "0" });
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="`Assign ${props.category === 'SUBSCRIPTION' ? 'Subscription' : 'License'} to group ${group.name}`"
    icon="document-check"
    cy="assign-license-dialog"
    @close="closeModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="assign-license-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ alertText }}
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
            :placeholder="`Click to select ${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}`"
            :label="`Search & assign ${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}`"
            :cy="`assign-${props.category === 'SUBSCRIPTION' ? 'subscription' : 'license'}-to-group-autocomplete`"
            icon-prepended="search-lg"
            clear-button="x-circle"
            :items="formattedLicenses"
            :total-items="totalItems"
            item-title="name"
            item-value="value"
            required
            :loading="isLoading"
            @update-params="onSelectAgreementTypeScrolledToEnd"
            @update:model-value="getPolicies"
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
        cy="create-group-submit-button"
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        prepend-icon="plus-white"
        @click="submitForm"
      >
        Assign
        {{ props.category === "SUBSCRIPTION" ? "Subscription" : "License" }}
      </m-m-button>
    </template>
  </m-m-dialog>
</template>
