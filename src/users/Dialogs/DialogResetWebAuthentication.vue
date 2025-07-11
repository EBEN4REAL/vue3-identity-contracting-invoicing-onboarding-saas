<script setup lang="ts">
import { computed, onMounted, PropType, Ref, ref } from "vue";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { usersService } from "../users.service";
import { TypeDialogConfirmResetWebAuthenticationUser } from "../users.types";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<TypeDialogConfirmResetWebAuthenticationUser | null>,
    default: null,
  },
});

const emit = defineEmits(["close", "update"]);

const isAlertVisible = ref(false);
const isLoading = ref(false);
const userProfile: Ref<UserProfileMM | null> = ref(null);

const fullName = computed(
  () => `${props.data?.first_name} ${props.data?.last_name}`,
);

const displayName = computed(() => {
  const name = fullName.value;
  const email = props?.data?.email;
  return name && name !== "null null" ? name : email;
});

const title = computed(() => `Reset biometrics`);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onDialogClose = () => {
  emit("close");
  isLoading.value = false;
  isAlertVisible.value = false;
};

const submit = async () => {
  try {
    isLoading.value = true;
    await usersService.resetUserMeWebAuthn();
    onDialogClose();
    emit("update");
    eventBus.$emit("onShowToast", {
      text: `Biometrics has been reset successfully`,
      status: "info",
    });
  } catch {
    isAlertVisible.value = true;
    eventBus.$emit("onShowToast", {
      text: `Error resetting biometrics`,
      status: "info",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    icon="key"
    cy="dialog-confirm-reset-webauthn"
    @close="onDialogClose"
  >
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      @close="onAlertClose"
    >
      Error occurred. Please, try again.
    </m-m-alert>
    <template #subtitle>
      Are you sure you want to reset biometrics for
      <span class="font-weight-700">{{ displayName }}</span
      >?
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button :loading="isLoading" cy="button-submit" @click="submit"
          >Reset biometrics</m-m-button
        >
      </div>
    </template>
  </m-m-dialog>
</template>
