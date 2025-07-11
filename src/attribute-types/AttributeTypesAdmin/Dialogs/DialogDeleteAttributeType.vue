<script lang="ts" setup>
import { PropType, ref, Ref } from "vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { AttributeTypeRead } from "~/onboarding/onboarding.types";
import { onboardingServiceAuth } from "~/onboarding/onboarding.service";

const props = defineProps({
  data: {
    type: Object as PropType<AttributeTypeRead | null>,
    default: null,
  },
});

const emit = defineEmits(["close", "delete"]);

const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);

const submit = async () => {
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;
    if (props.data) {
      await onboardingServiceAuth.deleteAttributeType(props.data.id);
    }
    emit("delete");
    emit("close");
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to delete attribute type",
      status: "error",
    });
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :title="`Delete ${data?.name}`"
    subtitle="Are you sure you want to delete this resource attribute?"
    icon="trash"
    icon-color="error"
    cy="dialog-delete-attribute-type"
    @close="emit('close')"
  >
    <template #footer>
      <m-m-button variant="outlined" cy="button-cancel" @click="emit('close')">
        No
      </m-m-button>
      <m-m-button
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        variant="danger"
        cy="button-submit"
        @click="submit"
      >
        Yes, delete
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>
