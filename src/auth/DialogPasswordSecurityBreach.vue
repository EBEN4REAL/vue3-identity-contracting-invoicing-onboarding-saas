<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ComputedRef } from "vue";
import { ERRORS_PASSWORD } from "~/auth/constants";

const route = useRoute();
const errorDescription = route.query.error
  ? ERRORS_PASSWORD[
      route.query.error.toString() as keyof typeof ERRORS_PASSWORD
    ]
  : "Something went wrong. Please try again.";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const subtitle: ComputedRef<string> = computed(() =>
  route.query.error
    ? `${errorDescription}`
    : "It is advised you use a different password. Do you want to continue with this password?",
);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Password part of a known security breach"
    :subtitle="subtitle"
    icon="shield-exclamation"
    cy="dialog-password-security-breach"
    @close="emit('close')"
  >
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" color="gray" @click="emit('close')">
          No, change password
        </m-m-button>
        <m-m-button cy="button-submit" @click="emit('submit')">
          Yes, continue
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>
