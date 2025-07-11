<script lang="ts" setup>
import { PropType, ComputedRef, computed } from "vue";
import { FormattedAuditEvent } from "~/audit-events/audit-events.types";
import { EventRead } from "~/events/events.types";

const props = defineProps({
  event: {
    type: Object as PropType<FormattedAuditEvent | EventRead | null>,
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const formattedPayload: ComputedRef<string> = computed(() => {
  if (!props?.event?.payload) return "";

  return Object.entries(props.event.payload)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
});

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <m-m-dialog
    :is-open="props?.isOpen"
    title="Payload details"
    :subtitle="`Type: ${props?.event?.type}`"
    icon="document-text"
    icon-size="24px"
    cy="events-payload-dialog"
    @close="closeModal"
  >
    <template #default>
      <pre class="mm-text-white payload-container">{{ formattedPayload }}</pre>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal">Dismiss</m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
.payload-container:focus {
  outline: none;
  border-color: #384250;
  box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
}
</style>
