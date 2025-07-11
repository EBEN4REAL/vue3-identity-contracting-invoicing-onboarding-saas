<script setup lang="ts">
import { PropType } from "vue";
import { TypeIdName } from "~/common/types";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isButtonSubmitDisabled: {
    type: Boolean,
    default: false,
  },
  isButtonSubmitLoading: {
    type: Boolean,
    default: false,
  },
  attributeTypes: {
    type: Array as PropType<TypeIdName[]>,
    default: () => [],
  },
  organizationName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="circle-stack"
    icon-size="auto"
    title="Review consent"
    :subtitle="`Following are the attributes that are shared with ${organizationName}:`"
    cy="dialog-review-consent"
    @close="emit('close')"
  >
    <div
      v-for="attributeType in attributeTypes"
      :key="attributeType.id"
      class="mm-page-list-item"
    >
      {{ attributeType.name }}
    </div>
    <template #footer>
      <m-m-button variant="outlined" @click="emit('close')"> Close </m-m-button>
      <m-m-button
        variant="danger"
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        cy="button-submit"
        @click="emit('submit')"
      >
        Remove consent
      </m-m-button>
    </template>
  </m-m-dialog>
</template>
