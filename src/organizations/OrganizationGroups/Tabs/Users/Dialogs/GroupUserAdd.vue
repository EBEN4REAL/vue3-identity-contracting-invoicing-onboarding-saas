<script lang="ts" setup>
import { ref, reactive, Ref, PropType, onMounted, computed, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { organizationsService } from "~/organizations/organizations.service";
import { OrganizationGroupRead, OrganizationUserRead } from "~/iam/iam.types";
import {
  TypeGroupUserAddForm,
  TypeGroupUserAddRules,
  TypeValidatorGroupUserAdd,
} from "~/organizations/OrganizationGroups/types";
import DialogInviteUsersToOrganization from "~/users/OrganizationUsers/Dialogs/DialogInviteUsersToOrganization.vue";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";

const form = reactive<TypeGroupUserAddForm>({
  userIds: [],
});

const formRules: TypeGroupUserAddRules = {
  userIds: {
    required: helpers.withMessage("Users required", required),
  },
};

const v$: TypeValidatorGroupUserAdd = useVuelidate(formRules, form, {
  $scope: "groupUserAdd",
});

const organizationGroupUsers: Ref<TableResponse<OrganizationUserRead> | null> =
  ref(null);
const users: Ref<(OrganizationUserRead & { name: string })[]> = ref([]);
const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const isSaving: Ref<boolean> = ref(false);
const isDialogInviteUsersOpened: Ref<boolean> = ref(false);
const hasMoreUsers: Ref<boolean> = ref(true);
const totalItems: Ref<number> = ref(0);
const currentParams: Ref<TableRequestParams | null> = ref(null);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  group: {
    type: Object as PropType<OrganizationGroupRead>,
    required: true,
  },
  organizationId: {
    type: String,
    default: "",
  },
  groupUsers: {
    type: Array as PropType<OrganizationUserRead[]>,
    default: () => [],
  },
});

const emit = defineEmits(["close", "submit", "removeUser", "invited"]);
const isLoading: Ref<boolean> = ref(false);

watch(
  () => props.isOpen,
  async () => {
    await fetchOrganizationGroupUsers();
    v$.value.$reset();
  },
);

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  try {
    if (!props.organizationId || !props.group.id || !form.userIds.length) {
      return;
    }

    isSaving.value = true;

    await organizationsService.createOrganizationGroupUsers(
      props.organizationId,
      props.group.id,
      form.userIds,
    );

    emit("submit");
    isSaving.value = false;
    closeModal();
  } catch (error) {
    isAlertVisible.value = true;
    alertText.value = error.response.data;
    isSaving.value = false;
  }
};

const resetForm = () => {
  setTimeout(() => {
    form.userIds = [];
    isAlertVisible.value = false;
    alertText.value = "";
  }, 100);
  v$.value.$reset();
};

const closeModal = () => {
  resetForm();
  emit("close");
};

const toggleInviteUsersDialog = () => {
  isDialogInviteUsersOpened.value = !isDialogInviteUsersOpened.value;
};

const selectUserClassList = (isDisabled: boolean) => [
  "mm-flex",
  "mm-flex-grow",
  isDisabled && "mm-opacity-50",
];

const formattedUsers = computed(() => {
  const orgGroupUsers = organizationGroupUsers.value?.results || [];
  const orgGroupUsersIds = new Set(orgGroupUsers.map((user) => user.id));

  const updatedUsers = users.value.map((user) => {
    user.name =
      user.first_name || user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.email;
    if (orgGroupUsersIds.has(user.id)) {
      return { ...user, disabled: true };
    }
    return user;
  });

  return updatedUsers;
});

const fetchUsers = async (params: TableRequestParams) => {
  currentParams.value = params;
  if (!hasMoreUsers.value) return;

  const defaultPagination = {
    offset: "0",
    limit: ITEMS_PER_PAGE[0],
  };

  if (!params) params = defaultPagination;

  isLoading.value = true;

  const usersRes = await organizationsService.getOrganizationUsers(
    props.organizationId,
    params,
  );

  isLoading.value = false;

  users.value = usersRes?.results || [];
  totalItems.value = usersRes?.total || 0;

  await fetchOrganizationGroupUsers(params);
};

const fetchOrganizationGroupUsers = async (params?: TableRequestParams) => {
  organizationGroupUsers.value =
    await organizationsService.getOrganizationGroupUsers(
      props.organizationId,
      props.group.id,
      params ? params : { limit: ITEMS_PER_PAGE[0], offset: "0" },
    );
};

const onUsersScrolledToEnd = async (params: TableRequestParams) => {
  await fetchUsers(params);
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  const params = {
    offset: "0",
    limit: ITEMS_PER_PAGE[0],
  };
  await fetchUsers(params);
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="`Add users to ${group.name}`"
    icon="user"
    cy="add-user-dialog"
    @close="closeModal"
  >
    <template #default>
      <m-m-alert
        v-if="isAlertVisible"
        status="error"
        cy="add-user-alert"
        class="mm-mb-12"
        @close="onAlertClose"
      >
        {{ alertText }}
      </m-m-alert>

      <form v-mm-focus-first class="mm-page-dialog-form">
        <div>
          <m-m-autocomplete
            v-model="form.userIds"
            cy="user-ids-autocomplete"
            :items="formattedUsers"
            :total-items="totalItems"
            :errors="v$.userIds.$errors"
            item-title="name"
            item-value="id"
            multiple
            label="Select users"
            placeholder="Click to select users"
            :loading="isLoading"
            @update-params="onUsersScrolledToEnd"
          >
            <template #option="{ item }">
              <div class="mm-flex mm-flex-justify-between mm-w-10">
                <div :class="selectUserClassList(item.disabled)">
                  <div class="mm-flex mm-flex-column">
                    {{ item.name }}
                    <div class="mm-page-option-secondary">
                      {{ item.email }}
                    </div>
                  </div>
                  <div
                    v-if="item.disabled"
                    class="mm-flex mm-flex-justify-between mm-flex-grow"
                  >
                    <m-m-badge
                      class="mm-ml-3"
                      :status="BadgeTypes.Inactive"
                      text="Already Added"
                      cy="badge-added"
                    />
                    <m-m-icon icon="check-thin-primary" width="12px" />
                  </div>
                </div>
              </div>
            </template>

            <template #options-hint>
              <div class="mm-mb-8">
                Couldn’t find the user you’re looking for?
              </div>
              <m-m-button
                prepend-icon="plus-white"
                cy="button-open-dialog-invite-users"
                @click="
                  closeModal();
                  toggleInviteUsersDialog();
                "
              >
                Invite user
              </m-m-button>
            </template>
          </m-m-autocomplete>
        </div>
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal"> Cancel </m-m-button>
      <m-m-button
        variant="elevated"
        cy="add-user-submit-button"
        :is-disabled="v$.$invalid || isSaving"
        :loading="isSaving"
        prepend-icon="plus-white"
        @click="submitForm"
      >
        Add {{ form.userIds.length ? form.userIds.length : "" }} user{{
          form.userIds.length > 1 ? "s" : ""
        }}
        to group
      </m-m-button>
    </template>
  </m-m-dialog>
  <dialog-invite-users-to-organization
    :is-open="isDialogInviteUsersOpened"
    cy="dialog-invite-organization-users"
    @submit="emit('invited')"
    @close="toggleInviteUsersDialog"
  />
</template>
