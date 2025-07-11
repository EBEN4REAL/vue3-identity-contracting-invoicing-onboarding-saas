<script lang="ts" setup>
import { computed, ComputedRef, PropType } from "vue";
import { OrganizationRead } from "~/iam/iam.types";
import { SCAgreementRead } from "~/policies/policies.types";

const emit = defineEmits(["close", "submit"]);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  licenseToUnassign: {
    type: Object as PropType<SCAgreementRead>,
    required: true,
  },
  loadingUnassign: { type: Boolean, default: false },
  organization: {
    type: Object as PropType<OrganizationRead>,
    required: true,
  },
});

const isSubscriptionsAccess = computed<boolean>(() => {
  return props.licenseToUnassign?.category === "SUBSCRIPTION";
});

const dialogTitle: ComputedRef<string> = computed(
  () => `Remove ${isSubscriptionsAccess.value ? "subscription" : "license"}`,
);

const dialogSubtitle: ComputedRef<string> = computed(
  () =>
    `Are you sure you want to remove this ${isSubscriptionsAccess.value ? "subscription" : "license"} assigned to ${props.organization.name}?`,
);
const closeModal = () => emit("close");

const onUnassignButtonClick = () => emit("submit");
</script>

<template>
  <m-m-dialog
    v-if="licenseToUnassign"
    :is-open="isOpen"
    :title="dialogTitle"
    icon="warning"
    icon-color="error"
    :subtitle="dialogSubtitle"
    cy="confirm-unassign"
    @close="closeModal"
  >
    <template #footer>
      <m-m-button
        variant="outlined"
        data-cy="button-cancel-unassign"
        @click="closeModal"
      >
        No
      </m-m-button>
      <m-m-button
        variant="danger"
        :loading="loadingUnassign"
        data-cy="button-confirm-unassign"
        @click="onUnassignButtonClick"
      >
        Yes, remove
      </m-m-button>
    </template>
  </m-m-dialog>
</template>
