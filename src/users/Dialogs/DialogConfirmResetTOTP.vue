<script setup lang="ts">
import { computed, ComputedRef, onMounted, PropType, Ref, ref } from "vue";
import { TypeDialogConfirmDisableUserData } from "~/users/OrganizationUsers/Tabs/Users/types";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { organizationsService } from "~/organizations/organizations.service";
import { usersService } from "../users.service";
import { TypeErrorResponse } from "~/mm_ui_kit/src/types/types";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<TypeDialogConfirmDisableUserData | null>,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "update"]);

const isAlertVisible = ref(false);
const isLoading = ref(false);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const errorMsg: Ref<string> = ref("");

const displayName: ComputedRef<string | undefined> = computed(() => {
  const firstName = props?.data?.first_name?.trim();
  const lastName = props?.data?.last_name?.trim();
  const email = props?.data?.email;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else {
    return email;
  }
});

const title: ComputedRef<string> = computed(() => `Reset TOTP`);

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

    if (props.isAdmin) {
      await usersService.resetAdminUserTOTP(userId);
    } else {
      const orgId = userProfile.value?.org as string;
      await organizationsService.resetUserTOTP(userId, orgId);
    }

    onDialogClose();
    emit("update");
    eventBus.$emit("onShowToast", {
      text: `TOTP reset is successful`,
      status: "info",
    });
  } catch (error) {
    const errorDetail = (error as TypeErrorResponse)?.response?.data?.detail;
    errorMsg.value =
      errorDetail === "Not Found"
        ? `${displayName.value} has no TOTP configured`
        : "Error occurred. Please, try again";
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
    cy="dialog-confirm-reset-totp"
    @close="onDialogClose"
  >
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      @close="onAlertClose"
    >
      {{ errorMsg }}
    </m-m-alert>
    <template #subtitle>
      Are you sure you want to reset TOTP for
      <span class="font-weight-700">{{ displayName }}</span
      >?
    </template>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button :loading="isLoading" cy="button-reset-totp" @click="submit"
          >Reset TOTP</m-m-button
        >
      </div>
    </template>
  </m-m-dialog>
</template>
