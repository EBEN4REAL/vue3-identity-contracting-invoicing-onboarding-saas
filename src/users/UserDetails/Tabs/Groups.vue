<script setup lang="ts">
import { onMounted, ref, computed, Ref, ComputedRef, PropType } from "vue";
import type { TypeOrganizationGroupReadForTable } from "../types";
import { OrganizationGroupRead, OrganizationUserRead } from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { TypeDialogAddUserToGroupsData } from "~/users/OrganizationUsers/Tabs/Users/types";
import DialogAddUserToGroups from "~/users/OrganizationUsers/Tabs/Users/Dialogs/DialogAddUserToGroups.vue";
import { useRouter } from "vue-router";
import { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
const router = useRouter();
const modalRef = ref(null);
const props = defineProps({
  user: {
    type: Object as PropType<OrganizationUserRead>,
    default: () => ({}),
  },
  organizationId: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    default: "",
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});
const dialogAddUserToGroupsData: Ref<null | TypeDialogAddUserToGroupsData> =
  ref(null);
const isConfirmDeleteDialogOpen: Ref<boolean> = ref(false);
const selectedGroup: Ref<OrganizationGroupRead | null> = ref(null);
const isDialogAddUserToGroupsOpen = ref(false);
const isLoading: Ref<boolean> = ref(true);
const emptyState: EmptyStateType = {
  icon: sectionIcons["users"],
  title: "User not part of any groups",
  description: "Add user to group/s to easily manage access on group level.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/manage-users#add-user-to-group-organizational-unit",
};
const headers = [
  {
    key: "name",
    label: "Group name",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "actions",
    label: "",
  },
];
const toggleConfirmDelete = () => {
  isConfirmDeleteDialogOpen.value = !isConfirmDeleteDialogOpen.value;
};
const groups: Ref<TableResponse<OrganizationGroupRead>> = ref(null);

const actionsInDropdown = computed(
  () =>
    (group: OrganizationGroupRead): TypeDropdownItem[] => [
      {
        label: "View group",
        type: "button",
        isDisabled: props.isSCViewerOnly,
        onClick: () => router.replace(`/sc/groups/${group.id}`),
      },
      {
        label: "Remove user from group",
        type: "button",
        color: "error",
        isDisabled: props.isSCViewerOnly,
        onClick: () => toggleConfirmDelete(),
      },
    ],
);

const rows: ComputedRef<TypeOrganizationGroupReadForTable[]> = computed(
  () =>
    groups.value?.results.map(
      (group: OrganizationGroupRead): TypeOrganizationGroupReadForTable => ({
        name: group.name,
        description: group.description,
        id: group.id,
        users: group.users,
      }),
    ) || [],
);

const fullName: ComputedRef<string> = computed(
  () => `${props.user?.first_name} ${props.user?.last_name}`,
);

const displayName: ComputedRef<string> = computed(() => {
  const name = fullName.value;
  const email = props?.user?.email;
  return name && name !== "null null" ? name : email;
});

const description: ComputedRef<string> = computed(
  () => `All groups ${displayName.value} is added to.`,
);

const handleUpdateParams = (params: TableRequestParams) => {
  getOrganizationUserGroups(params);
};

const removeUserFromGroup = async () => {
  await organizationsService.deleteUserFromOrganizationGroup(
    props.organizationId as string,
    selectedGroup!.value!.id as string,
    props.userId as string,
  );
  await getOrganizationUserGroups();
  toggleConfirmDelete();
  if (modalRef.value) {
    modalRef.value.fetchOrganizationGroups();
  }
};

const getOrganizationUserGroups = async (
  params: TableRequestParams = { limit: ITEMS_PER_PAGE[0], offset: "0" },
) => {
  isLoading.value = true;
  if (props.organizationId && props.userId) {
    groups.value = await organizationsService.getOrganizationUserGroups(
      props.organizationId,
      props.userId,
      params,
    );
  }
  isLoading.value = false;
};

const onCloseDialogAddUserToGroups = () => {
  isDialogAddUserToGroupsOpen.value = false;
};
const onOpenDialogAddUserToGroups = () => {
  isDialogAddUserToGroupsOpen.value = true;
};
const updateSelectedGroup = (groupFromEvent: OrganizationGroupRead) => {
  selectedGroup.value = groupFromEvent;
};
const populateModalData = async () => {
  dialogAddUserToGroupsData.value = {
    first_name: props.user.first_name,
    last_name: props.user.last_name,
    email: props.user.email,
    user_id: props.user.user_id,
    organization: props.user.organization,
  };
};
onMounted(async () => {
  await getOrganizationUserGroups();
  await populateModalData();
});
</script>

<template>
  <m-m-table
    :is-loading="isLoading"
    :headers="headers"
    :rows="rows"
    :total-rows="groups?.total ?? 0"
    :description="description"
    cy="user-groups-table"
    show-search
    :empty-state="emptyState"
    @update-params="handleUpdateParams"
  >
    <template #empty-state-button>
      <m-m-button
        variant="elevated"
        class="mm-ml-auto"
        cy="empty-state-add-to-group-button"
        size="small"
        prepend-icon="plus-white"
        :is-disabled="isSCViewerOnly"
        @click="onOpenDialogAddUserToGroups"
      >
        Add to group
      </m-m-button>
    </template>
    <template #actions="{ row }">
      <m-m-dropdown
        :cy="`dropdown-${row.id}`"
        :items="actionsInDropdown(row)"
        @click="updateSelectedGroup(row)"
      >
        <template #activator>
          <div
            :data-cy="`actions-button-${row.id}`"
            class="action-button mm-flex mm-flex-align-center mm-flex-justify-center"
          >
            <m-m-button prepend-icon="dots-vertical" variant="text" />
          </div>
        </template>
      </m-m-dropdown>
    </template>
    <template #action>
      <m-m-button
        variant="outlined"
        class="mm-ml-auto"
        cy="add-to-group-button"
        size="small"
        prepend-icon="plus"
        :is-disabled="isSCViewerOnly"
        @click="onOpenDialogAddUserToGroups"
      >
        Add to group
      </m-m-button>
    </template>
  </m-m-table>
  <dialog-add-user-to-groups
    v-if="isDialogAddUserToGroupsOpen"
    ref="modalRef"
    :is-open="isDialogAddUserToGroupsOpen"
    :data="dialogAddUserToGroupsData!"
    @remove-from-group="
      async (group: OrganizationGroupRead) => {
        updateSelectedGroup(group);
        toggleConfirmDelete();
      }
    "
    @update="async () => await getOrganizationUserGroups()"
    @close="onCloseDialogAddUserToGroups"
  />
  <m-m-dialog
    :is-open="isConfirmDeleteDialogOpen"
    :title="`Remove User`"
    icon="error"
    icon-color="error"
    :subtitle="`Are you sure you want to remove ${dialogAddUserToGroupsData?.first_name} ${dialogAddUserToGroupsData?.last_name} from ${selectedGroup?.name}?`"
    cy="confirm-delete-user"
    @close="toggleConfirmDelete"
  >
    <template #footer>
      <m-m-button
        variant="outlined"
        data-cy="button-cancel-delete-user"
        size="medium"
        @click="toggleConfirmDelete"
      >
        No
      </m-m-button>
      <m-m-button
        variant="danger"
        data-cy="button-confirm-delete-user"
        @click="
          () => {
            removeUserFromGroup();
          }
        "
      >
        Yes, remove
      </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss">
.icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: #f3f4f6;
}

.action-button {
  width: 20px;
  height: 20px;
}
</style>
