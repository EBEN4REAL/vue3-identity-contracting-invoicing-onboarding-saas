<script setup lang="ts">
import { computed, ComputedRef, PropType, ref, Ref, watch } from "vue";
import { policiesService } from "~/service-providers/policies.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import {
  PolicyTypeRead,
  PolicyUsageRead,
  ServiceConsumerAgreementPoliciesRead,
} from "~/policies/policies.types";

const emit = defineEmits(["close"]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  serviceConsumerId: {
    type: String,
    default: "",
  },
  licenseId: {
    type: String,
    default: "",
  },
  group: {
    type: Object as PropType<{ id: string; name: string } | null>,
    default: null,
  },
  optionalPolicies: {
    type: Array as PropType<PolicyTypeRead[]>,
    default: () => [],
  },
});

const isPoliciesFetched: Ref<boolean> = ref(false);
const isSubmitButtonLoading: Ref<boolean> = ref(false);
const isSubmitButtonDisabled: Ref<boolean> = ref(false);
const selectedOptionalPolicies: Ref<string[]> = ref([]);
const optionalPoliciesAvailable: Ref<PolicyUsageRead[]> = ref(
  props.optionalPolicies || [],
);

watch(
  () => props.isOpen,
  async () => {
    if (props.isOpen) {
      if (props?.group?.id) {
        const policies: ServiceConsumerAgreementPoliciesRead =
          await policiesService.getServiceConsumerAgreementPoliciesAssignedToGroup(
            props.serviceConsumerId,
            props.licenseId,
            props?.group.id,
          );
        selectedOptionalPolicies.value = policies.optional_policy_ids;
      }
      if (!isPoliciesFetched.value) {
        try {
          const fetchedPolicies: PolicyUsageRead[] = await fetchLicensePolicies(
            props.licenseId,
          );
          optionalPoliciesAvailable.value = fetchedPolicies;
          isPoliciesFetched.value = true;
        } catch (error) {
          eventBus.$emit("onShowToast", {
            text: `Failed to fetch optional policies for ${props.group?.name}`,
            status: "error",
          });
        }
      }
    }
  },
);

const fetchLicensePolicies = async (licenseId: string) => {
  return policiesService.getServiceConsumerAgreementPolicies(
    props.serviceConsumerId,
    licenseId,
  );
};

const title: ComputedRef<string> = computed(
  () => `Manage Optional Policies for ${props.group?.name}`,
);

const onSubmit = async () => {
  try {
    isSubmitButtonDisabled.value = true;
    isSubmitButtonLoading.value = true;
    if (props?.group?.id) {
      await policiesService.updateServiceConsumerAgreementOptionalPoliciesAssignedToGroup(
        props.serviceConsumerId,
        props.licenseId,
        props.group?.id,
        selectedOptionalPolicies.value,
      );
      eventBus.$emit("onShowToast", {
        text: "Optional policies updated successfully",
        status: "info",
      });
      emit("close");
    }
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to update optional policies",
      status: "error",
    });
  } finally {
    isSubmitButtonDisabled.value = false;
    isSubmitButtonLoading.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    icon="shield-check-outline"
    cy="dialog-manage-optional-licenses-for-group"
    @close="emit('close')"
  >
    <template #default>
      <div class="mm-page-options-hint">
        Select or unselect optional policies
      </div>
      <m-m-checkbox
        v-for="option in optionalPoliciesAvailable"
        :key="option.id"
        v-model="selectedOptionalPolicies"
        :value="option.id"
        :name="option.name"
        class="mm-mt-8"
        :cy="`checkbox-${option.id}`"
      >
        {{ option.name }}
      </m-m-checkbox>
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" color="gray" @click="emit('close')">
          Cancel
        </m-m-button>
        <m-m-button
          cy="button-submit-manage-optional-policies-for-group"
          :loading="isSubmitButtonLoading"
          :disabled="isSubmitButtonDisabled"
          @click="onSubmit"
        >
          Apply
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>
