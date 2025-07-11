<script setup lang="ts">
import { computed, onMounted, PropType, Ref, ref } from "vue";
import { TypeDialogConfirmDisableUserData } from "~/users/OrganizationUsers/Tabs/Users/types";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { organizationsService } from "~/organizations/organizations.service";
import { usersService } from "../users.service";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<TypeDialogConfirmDisableUserData | null>,
    default: null,
  },
  fromAdmin: {
    type: Boolean,
    default: false,
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

const title = computed(() => `Reset password`);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onDialogClose = () => {
  emit("close");
  isLoading.value = false;
  isAlertVisible.value = false;
};

const submit = async () => {
  if (!props.data?.user_id) return;

  try {
    isLoading.value = true;
    const userId = props.data.user_id;

    if (props.fromAdmin) {
      await usersService.resetUserPassword(userId);
    } else {
      const orgId = userProfile.value?.org as string;
      await organizationsService.resetUserPassword(userId, orgId);
    }

    onDialogClose();
    emit("update");
    eventBus.$emit("onShowToast", {
      text: `Password reset is successful`,
      status: "info",
    });
  } catch {
    isAlertVisible.value = true;
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
    cy="dialog-confirm-reset-password"
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
      Are you sure you want to reset password for
      <span class="font-weight-700">{{ displayName }}</span
      >?
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button
          :loading="isLoading"
          cy="button-reset-password"
          @click="submit"
          >Reset password</m-m-button
        >
      </div>
    </template>
  </m-m-dialog>
</template>
