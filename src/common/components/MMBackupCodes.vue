<script setup lang="ts">
import { PropType } from "vue";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { copyToClipboard } from "~/mm_ui_kit/src/helpers/copyToClipboard";

const props = defineProps({
  backupCodes: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const onCopyBackupCodes = () => {
  try {
    copyToClipboard(props.backupCodes.join("\n"));
    eventBus.$emit("onShowToast", {
      text: "Backup codes copied successfully!",
      status: "info",
    });
  } catch (err) {
    eventBus.$emit("onShowToast", {
      text: "Failed to copy backup codes",
      status: "error",
    });
  }
};
</script>

<template>
  <m-m-alert :status="AlertTypes.Warning" :is-closable="false" class="mm-mb-12">
    You’ll see this message only once. Make sure to keep them safe.
  </m-m-alert>
  <m-m-card
    class="mm-grid mm-grid-columns-3 mm-grid-row-gap-12 mm-grid-column-gap-12 mm-pa-8 mm-mb-8"
  >
    <div
      v-for="(backupCode, index) in backupCodes"
      :key="backupCode"
      class="backup-code"
      :data-cy="`backup-code-${index}`"
    >
      {{ backupCode }}
    </div>
  </m-m-card>
  <m-m-button
    prepend-icon="clipboard-primary"
    variant="outlined"
    size="small"
    cy="button-copy-backup-codes"
    @click="onCopyBackupCodes"
  >
    Copy backup codes
  </m-m-button>
</template>

<style scoped lang="scss">
.backup-code {
  padding: 6px 24px;
  background-color: #f4f5f7;
  border-radius: 8px;
  font-size: 16px;
  color: #384250;
  font-weight: 500;
  text-align: center;
}
</style>
