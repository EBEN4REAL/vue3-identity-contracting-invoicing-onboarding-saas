<script lang="ts" setup>
import { useUnsavedChangesState } from "~/mm_ui_kit/src/composables/useUnsavedChanges";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "cancel"]);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Unsaved Changes"
    icon="warning"
    icon-color="warning"
    cy="dialog-unsaved-changes"
    @close="emit('cancel')"
  >
    <template #default>
      <div class="mm-page-subtitle mm-page-subtitle--h1">
        {{ useUnsavedChangesState.texts.subtitle }}
      </div>
    </template>
    <template #footer>
      <div class="mm-flex mm-flex-align-center mm-w-10 mm-flex-justify-end">
        <div class="mm-flex mm-flex-align-end mm-flex-gap-6">
          <m-m-button
            variant="outlined"
            cy="button-submit"
            @click="emit('cancel')"
          >
            {{ useUnsavedChangesState.texts.buttonCancel }}
          </m-m-button>
          <m-m-button cy="button-cancel" @click="emit('submit')">
            {{ useUnsavedChangesState.texts.buttonSubmit }}
          </m-m-button>
        </div>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
.icon-background {
  background-color: #fffaeb;
  padding: 8px;
  border-radius: 8px;
}
</style>
