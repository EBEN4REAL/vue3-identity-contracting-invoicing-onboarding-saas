<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { TypeDialogConfirmDisableUserData } from "~/users/OrganizationUsers/Tabs/Users/types";
import { usersService } from "~/users/users.service";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<TypeDialogConfirmDisableUserData | null>,
    default: null,
  },
});

const emit = defineEmits(["close", "update"]);

const isAlertVisible = ref(false);
const isLoading = ref(false);

const fullName = computed(
  () => `${props.data?.first_name} ${props.data?.last_name}`,
);

const displayName = computed(() => {
  const name = fullName.value;
  const email = props?.data?.email;
  return name && name !== "null null" ? name : email;
});

const title = computed(() => `Disable ${displayName.value}`);

const subtitle = computed(
  () => `Are you sure you want to disable ${displayName.value}?`,
);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const onDialogClose = () => {
  emit("close");
  isLoading.value = false;
  isAlertVisible.value = false;
};

const submit = async () => {
  if (props.data?.user_id) {
    try {
      isLoading.value = true;
      await usersService.updateUserDisable(props.data.user_id);
      onDialogClose();
      emit("update");
    } catch {
      isAlertVisible.value = true;
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    :subtitle="subtitle"
    icon="warning"
    icon-color="warning"
    cy="dialog-confirm-disable-user"
    @close="onDialogClose"
  >
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      @close="onAlertClose"
    >
      Error occurred. Please, try again.
    </m-m-alert>
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button variant="outlined" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button
          cy="disable-user-button"
          variant="danger"
          :loading="isLoading"
          @click="submit"
          >Disable user
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>
