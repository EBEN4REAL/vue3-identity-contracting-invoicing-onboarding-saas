<script setup lang="ts">
import { ref, computed, PropType, reactive, onMounted } from "vue";
import { TypeUpdateUserDetailsForm } from "../types";
import { OrganizationUserRead } from "~/iam/iam.types";
import { authService } from "~/auth/auth.service";
import { usersService } from "~/users/users.service";

const props = defineProps({
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: () => ({}),
  },
});

const emit = defineEmits(["update"]);

const defaultEmptyText = "Not added";
const details = computed(() => [
  {
    label: "First name",
    text: props.user?.first_name,
    isEmpty: !props.user?.first_name,
    emptyText: defaultEmptyText,
  },
  {
    label: "Last name",
    text: props.user?.last_name,
    isEmpty: !props.user?.last_name,
    emptyText: defaultEmptyText,
  },
  {
    label: "Email address",
    text: props.user?.email,
    isEmpty: !props.user?.email,
    emptyText: defaultEmptyText,
  },
  {
    label: "Token",
    text: props.user?.unit?.name,
    isEmpty: !props.user?.unit?.name,
    emptyText: defaultEmptyText,
  },
]);

const isInEditMode = ref(false);
const isUserAllowedToEdit = ref(false);
const isSubmitButtonDisabled = ref(false);

const form: TypeUpdateUserDetailsForm = reactive({
  first_name: props.user?.first_name,
  last_name: props.user?.last_name,
});

const onEnterEditMode = () => {
  isInEditMode.value = true;
};

const onExitEditMode = () => {
  isInEditMode.value = false;
};

const onFormDismiss = () => {
  onExitEditMode();
};

const checkUserAllowedToEdit = async () => {
  isUserAllowedToEdit.value = await authService.isUserOrgEditor();
};

const onFormSubmit = async () => {
  if (!props.user?.id) {
    return;
  }

  isSubmitButtonDisabled.value = true;

  try {
    const updatedUser = await usersService.updateUser(props.user.id, form);
    emit("update", updatedUser);
    onExitEditMode();
  } catch (error) {
    throw error;
  } finally {
    isSubmitButtonDisabled.value = false;
  }
};

onMounted(async () => {
  await checkUserAllowedToEdit();
});
</script>

<template>
  <template v-if="!isInEditMode">
    <m-m-button
      v-if="isUserAllowedToEdit"
      variant="outlined"
      size="small"
      prepend-icon="pencil"
      class="mm-ml-auto mm-mb-10"
      cy="button-edit-organization-user"
      @click="onEnterEditMode"
    >
      Edit
    </m-m-button>
    <m-m-data-iterator
      :data="details"
      cy-id-text="user-detail-item-text"
      cy-id-text-empty="user-detail-item-text-empty"
    />
  </template>
  <m-m-card v-else data-cy="edit-mode">
    <template #header>
      <div
        class="mm-flex mm-flex-justify-end mm-flex-align-center mm-flex-grow mm-flex-gap-6"
      >
        <m-m-button
          variant="outlined"
          type="reset"
          size="small"
          cy="button-dismiss"
          @click="onFormDismiss"
        >
          Dismiss
        </m-m-button>
        <m-m-button
          variant="elevated"
          type="submit"
          size="small"
          :is-disabled="isSubmitButtonDisabled"
          :loading="isSubmitButtonDisabled"
          cy="button-save-changes"
          @click="onFormSubmit"
        >
          Save changes
        </m-m-button>
      </div>
    </template>
    <form
      v-mm-focus-first
      class="mm-pa-12 mm-grid mm-grid-columns-2 mm-grid-row-gap-12 mm-grid-column-gap-16"
    >
      <m-m-input
        v-model="form.first_name"
        label="First name"
        cy="first-name-input"
      />
      <m-m-input
        v-model="form.last_name"
        label="Last name"
        cy="last-name-input"
      />
    </form>
  </m-m-card>
</template>
