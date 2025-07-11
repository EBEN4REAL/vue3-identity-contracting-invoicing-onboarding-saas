<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { TypeDialogConfirmDeleteAdminUser } from "~/users/OrganizationUsers/Tabs/Users/types";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { usersService } from "../users.service";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<TypeDialogConfirmDeleteAdminUser>,
    default: null,
  },
  mode: {
    type: String,
    default: "Remove",
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

const title = computed(() => `${props.mode} ${displayName.value}`);

const subtitle = computed(
  () =>
    `Are you sure you want to ${props.mode.toLowerCase()} ${displayName.value}?`,
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
  try {
    isLoading.value = true;
    await usersService.deleteAdminUser(props.data.user_id);
    onDialogClose();
    emit("update");
  } catch {
    isAlertVisible.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="title"
    :subtitle="subtitle"
    icon="error"
    icon-color="error"
    cy="dialog-confirm-remove-user-from-organization"
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
        <m-m-button variant="outlined" color="gray" @click="onDialogClose">
          Cancel
        </m-m-button>
        <m-m-button
          variant="danger"
          cy="button-submit"
          :loading="isLoading"
          @click="submit"
        >
          Yes, {{ mode }}
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>
