<script lang="ts" setup>
import { computed, ComputedRef, PropType } from "vue";
import { ServiceConsumerAgreementsRead_ } from "~/organizations/licenses/licenses.types";
import { OrganizationUserRead } from "~/iam/iam.types";

const emit = defineEmits(["close", "submit"]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  licenseToUnassign: {
    type: Object as PropType<ServiceConsumerAgreementsRead_>,
    required: true,
  },
  loadingUnassign: { type: Boolean, default: false },
  user: {
    type: Object as PropType<OrganizationUserRead>,
    required: true,
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
    `Remove ${props.category === "SUBSCRIPTION" ? "Subscription" : "License"}`,
);

const dialogSubtitle: ComputedRef<string> = computed(
  () =>
    `Are you sure you want to remove this ${props.category === "SUBSCRIPTION" ? "subscription" : "license"} assigned to ${userDetails.value}?`,
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
