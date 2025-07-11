<script lang="ts" setup>
import { ref, reactive, Ref, PropType, onMounted, computed, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { organizationsService } from "~/organizations/organizations.service";
import { OrganizationUnitRead, OrganizationUserRead } from "~/iam/iam.types";
import {
  TypeGroupUserAddForm,
  TypeGroupUserAddRules,
  TypeValidatorGroupUserAdd,
} from "~/organizations/OrganizationGroups/types";
import DialogInviteUsersToOrganization from "~/users/OrganizationUsers/Dialogs/DialogInviteUsersToOrganization.vue";
import { TableRequestParams } from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";

const form = reactive<TypeGroupUserAddForm>({
  userIds: [],
});

const formRules: TypeGroupUserAddRules = {
  userIds: {
    required: helpers.withMessage("Users required", required),
  },
};

const v$: TypeValidatorGroupUserAdd = useVuelidate(formRules, form, {
  $scope: "unitUserAdd",
});

const users: Ref<OrganizationUserRead[]> = ref([]);
const isAlertVisible: Ref<boolean> = ref(false);
const alertText: Ref<string> = ref("");
const isSaving: Ref<boolean> = ref(false);
const isDialogInviteUsersOpened: Ref<boolean> = ref(false);
const totalItems: Ref<number> = ref(0);
const isAlreadyAddedUnitUser: Ref<boolean> = ref(false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  organizationUnit: {
    type: Object as PropType<OrganizationUnitRead>,
    required: true,
  },
  organizationId: {
    type: String,
    default: "",
  },
  unitUsers: {
    type: Array as PropType<OrganizationUserRead[]>,
    default: () => [],
  },
});

const emit = defineEmits(["close", "submit", "removeUser", "invited"]);
const isLoading: Ref<boolean> = ref(false);

const usersPrepared = computed(() => {
  return users.value.map((user) => {
    return {
      ...user,
      user_id: user.id,
      name:
        user.first_name || user.last_name
          ? `${user.first_name} ${user.last_name}`
          : user.email,
      disabled: props.unitUsers.some(
        (unitUser) => unitUser.user_id === user.id,
      ),
    };
  });
});

watch(
  () => form.userIds,
  () => {
    v$.value.userIds.$touch();
    const duplicateUserId = users.value.findIndex(
      (user) => form.userIds.includes(user.id) && user.unit?.id,
    );
    if (duplicateUserId > -1) isAlreadyAddedUnitUser.value = true;
    else isAlreadyAddedUnitUser.value = false;
  },
);

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen) {
      v$.value.$reset();
    }
  },
);

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  try {
    if (
      !props.organizationId ||
      !props.organizationUnit?.id ||
      !form.userIds.length
    ) {
      return;
    }

    isSaving.value = true;

    await organizationsService.addOrganizationUnitUsers(
      props.organizationId,
      props.organizationUnit.id,
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

const fetchUsers = async (params?: TableRequestParams) => {
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
};

const onUsersScrolledToEnd = async (params: TableRequestParams) => {
  await fetchUsers(params);
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  await fetchUsers();
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="`Add users to ${organizationUnit.name}`"
    icon="user"
    size="large"
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
            :items="usersPrepared"
            :total-items="totalItems"
            :errors="v$.userIds.$errors"
            item-title="name"
            item-value="user_id"
            multiple
            label="Select users"
            placeholder="Click to select users"
            :loading="isLoading"
            @update-params="onUsersScrolledToEnd"
          >
            <template #option="{ item }">
              <div class="mm-flex mm-flex-justify-between mm-w-10">
                <div>
                  <div
                    class="mm-page-option mm-flex mm-flex-align-center mm-flex-gap-3"
                  >
                    {{ item.name }}
                    <m-m-badge
                      v-if="item.disabled"
                      text="Added"
                      cy="badge-added"
                    />
                  </div>
                  <div class="mm-page-option-secondary">
                    {{ item.email }}
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
                Invite User
              </m-m-button>
            </template>
          </m-m-autocomplete>
          <m-m-alert
            v-if="isAlreadyAddedUnitUser"
            status="warning"
            :is-closable="false"
            class="mm-mt-10 bordered"
            cy="duplicate-user-alert"
          >
            <div class="mm-page-title--h4 font-weight-600 mm-mb-2">
              User will be removed from their current organization unit
            </div>
            <div class="mm-page-subtitle--h2">
              Users can only be part of one organizational unit
            </div>
          </m-m-alert>
        </div>
      </form>
    </template>
    <template #footer>
      <m-m-button variant="outlined" @click="closeModal"> Cancel </m-m-button>
      <m-m-button
        variant="elevated"
        cy="add-user-submit-button"
        :is-disabled="v$.$invalid"
        :loading="isSaving"
        prepend-icon="plus-white"
        @click="submitForm"
      >
        Add {{ form.userIds.length ? form.userIds.length : "" }} user{{
          form.userIds.length > 1 ? "s" : ""
        }}
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

<style scoped lang="scss">
.bordered {
  border: 1px solid #fec84b;
  box-shadow: 0px 1px 2px 0px #1018280d;
}

.mm-page-title--h4 {
  color: #384250;
}
</style>
