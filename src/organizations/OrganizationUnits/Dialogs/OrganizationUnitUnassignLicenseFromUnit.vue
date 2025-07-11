<script lang="ts" setup>
import { computed, PropType, ComputedRef } from "vue";
import { ServiceConsumerAgreementsRead_ } from "~/organizations/licenses/licenses.types";
import { OrganizationUnitRead } from "~/iam/iam.types";

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
  unit: {
    type: Object as PropType<OrganizationUnitRead>,
    required: true,
  },
  category: {
    type: String,
    default: "",
  },
});

const dialogTitle: ComputedRef<string> = computed(
  () => `Unassign ${props.licenseToUnassign?.agreement_type_name}?`,
);
const dialogSubtitle: ComputedRef<string> = computed(
  () =>
    `Are you sure you want to remove this ${props.category === "SUBSCRIPTION" ? "subscription" : "license"} assigned to ${props.unit.name}?`,
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
