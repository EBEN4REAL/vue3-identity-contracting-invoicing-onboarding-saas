<script lang="ts" setup>
import { ref, computed, reactive, Ref, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import {
  OrganizationGroupRead,
  OrganizationUnitRead,
  OrganizationUsersCreate,
} from "~/iam/iam.types";
import {
  TypeInviteUsersForm,
  TypeInviteUsersFormRules,
  TypeValidatorInviteUsersForm,
} from "~/users/users.types";
import { authService } from "~/auth/auth.service";
import { organizationsService } from "~/organizations/organizations.service";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import { emailValidator } from "~/mm_ui_kit/src/helpers/emailValidator";

const organizationUnits: Ref<OrganizationUnitRead[]> = ref([]);
const organizationGroups: Ref<TableResponse<OrganizationGroupRead>> = ref(null);

const inviteUsersForm = reactive<TypeInviteUsersForm>({
  emails: [],
  organizationalUnit: null,
  groups: [],
});
const loading = ref(false);

const formRules: TypeInviteUsersFormRules = {
  emails: {
    required: helpers.withMessage("Emails are required", required),
    emails: helpers.withMessage(
      "Check the format of email address",
      emailValidator,
    ),
  },
};

const v$: TypeValidatorInviteUsersForm = useVuelidate(
  formRules,
  inviteUsersForm,
  { $scope: "inviteUsers" },
);

const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const inviteUsersButtonText = computed(() => {
  if (inviteUsersForm.emails.length === 0) {
    return "Invite users";
  }
  return `Invite ${inviteUsersForm.emails.length} user${
    inviteUsersForm.emails.length > 1 ? "s" : ""
  }`;
});

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  loading.value = true;
  const userProfile = await authService.getProfile();
  const organizationId = userProfile?.org as string;

  if (!organizationId) {
    loading.value = false;
    return false;
  }

  const inviteUsersRequest: OrganizationUsersCreate = {
    users: inviteUsersForm.emails.map((email) => ({
      email,
    })),
    unit: inviteUsersForm.organizationalUnit,
    groups: inviteUsersForm.groups,
  };

  try {
    await organizationsService.createOrganizationUsers(
      organizationId,
      inviteUsersRequest,
    );
    emit("submit");
    loading.value = false;
    closeInviteUsersModal();
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value = "Failed to create organization users";
    loading.value = false;
  }
};

const resetInviteUsersForm = () => {
  v$.value.$reset();
  inviteUsersForm.emails = [];
  inviteUsersForm.organizationalUnit = null;
  inviteUsersForm.groups = [];
  isAlertVisible.value = false;
  alertText.value = "";
};

const closeInviteUsersModal = () => {
  resetInviteUsersForm();
  emit("close");
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  const userProfile = await authService.getProfile();
  if (userProfile?.org) {
    organizationGroups.value = await organizationsService.getOrganizationGroups(
      userProfile?.org,
    );
    organizationUnits.value = await organizationsService.getOrganizationUnits(
      userProfile?.org,
    );
  }
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Invite users"
    subtitle="Invite your users to create a Veriam account"
    icon="invite-user"
    @close="closeInviteUsersModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="invite-users-form-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ alertText }}
      </m-m-alert>
      <form v-mm-focus-first class="mm-page-dialog-form">
        <m-m-tags-input
          v-model="inviteUsersForm.emails"
          label="Email address"
          cy="invite-users-form-emails"
          placeholder="Add one or more email addresses"
          type="email"
          required
          :errors="v$.emails.$errors"
          @blur="v$.emails.$touch"
        />
        <m-m-select
          v-model="inviteUsersForm.organizationalUnit"
          :data-select-value="inviteUsersForm.organizationalUnit"
          :items="organizationUnits"
          item-title="name"
          item-value="id"
          label="Organizational unit"
          data-cy="invite-users-form-organizational-unit"
        ></m-m-select>
        <m-m-select
          v-model="inviteUsersForm.groups"
          :data-select-value="inviteUsersForm.groups"
          :items="organizationGroups?.results"
          item-title="name"
          item-value="id"
          multiple
          label="Select Group(s)"
          data-cy="invite-users-form-groups"
        />
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeInviteUsersModal">
        Dismiss
      </m-m-button>
      <m-m-button
        variant="elevated"
        :loading="loading"
        data-cy="invite-users-form-submit-button"
        @click="submitForm"
      >
        {{ inviteUsersButtonText }}
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>
