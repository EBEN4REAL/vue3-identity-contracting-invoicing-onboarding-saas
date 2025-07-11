<script setup lang="ts">
import { computed, ComputedRef, PropType, ref, Ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { policiesService } from "~/service-providers/policies.service";

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
  unit: {
    type: Object as PropType<{ id: string; name: string }>,
    default: null,
  },
});

const emit = defineEmits(["close", "unassigned"]);

const isSubmitButtonLoading: Ref<boolean> = ref(false);
const isSubmitButtonDisabled: Ref<boolean> = ref(false);

const subtitle: ComputedRef<string> = computed(
  () =>
    `Are you sure you want to remove ${props.unit?.name} from this license?`,
);

const onSubmit = async () => {
  try {
    isSubmitButtonDisabled.value = true;
    isSubmitButtonLoading.value = true;
    await policiesService.unassignServiceConsumerAgreementFromOrgUnit(
      props.serviceConsumerId,
      props.licenseId,
      props.unit?.id as string,
    );
    emit("unassigned");
    emit("close");
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to unassign license from unit",
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
    title="Remove Unit"
    :subtitle="subtitle"
    icon="error"
    icon-color="error"
    cy="dialog-unassign-license-from-unit"
    @close="emit('close')"
  >
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" color="gray" @click="emit('close')">
          No
        </m-m-button>
        <m-m-button
          cy="button-unassign-license-from-unit"
          variant="danger"
          :loading="isSubmitButtonLoading"
          :disabled="isSubmitButtonDisabled"
          @click="onSubmit"
        >
          Yes, remove
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>
