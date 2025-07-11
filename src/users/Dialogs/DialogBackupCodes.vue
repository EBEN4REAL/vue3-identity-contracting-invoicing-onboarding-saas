<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  backupCodes: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["close", "submit"]);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="shield-check-outline"
    title="Save your backup codes"
    subtitle="Use these codes to log in if you lose access to your device. Each of them can only be used once."
    @close="emit('close')"
  >
    <m-m-backup-codes :backup-codes="backupCodes" />
    <template #footer>
      <m-m-button variant="outlined" @click="emit('close')">
        Close window
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>
