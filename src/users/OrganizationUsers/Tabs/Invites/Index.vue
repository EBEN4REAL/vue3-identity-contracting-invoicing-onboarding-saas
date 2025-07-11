<script setup lang="ts">
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import {
  EmptyStateType,
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { OrganizationUserRead } from "~/iam/iam.types";
import tableHeaders from "./TableHeaders";
import { ITEMS_PER_PAGE } from "~/common/constants";
import type { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { organizationsService } from "~/organizations/organizations.service";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { OrganizationUserStatus } from "~/users/users.types";
import { TypeToastStatuses } from "~/mm_ui_kit/src/types/toast.types";
import { showToast } from "~/mm_ui_kit/src/composables/useToast";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { useRouter } from "vue-router";
import {
  TypeDialogAddUserToGroupsData,
  TypeDialogAddUserToUnitData,
} from "../Users/types";
import DialogAddUserToGroups from "../Users/Dialogs/DialogAddUserToGroups.vue";
import DialogAddUserToUnit from "../Users/Dialogs/DialogAddUserToUnit.vue";

const props = defineProps({
  users: {
    type: Object as PropType<TableResponse<OrganizationUserRead>>,
    default: null,
  },
  isLoading: {
    type: Boolean,
    required: true,
    default: false,
  },
  isSCViewerOnly: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const isUserOrgEditor: Ref<boolean> = ref(false);
const isDialogAddUserToGroupsOpen: Ref<boolean> = ref(false);
const isDialogAddUserToUnitOpen: Ref<boolean> = ref(false);
const dialogAddUserToGroupsData: Ref<TypeDialogAddUserToGroupsData | null> =
  ref(null);
const dialogAddUserToUnitData: Ref<TypeDialogAddUserToUnitData | null> =
  ref(null);

const emptyState: EmptyStateType = {
  icon: sectionIcons["users"],
  title: "Invite your colleagues",
  description:
    "Send an invite to your team to join your organization on Veriam.",
  learnMoreHref:
    "https://docs.myveriam.com/manage-your-organization/add-your-users#invite-users",
};

const emit = defineEmits(["update", "invite-users"]);

const initialQueryParams: Ref<TableRequestParams> = ref({
  limit: ITEMS_PER_PAGE[0],
  offset: "0",
  status: OrganizationUserStatus.PENDING,
  sort: "created_date:desc",
});

const onResendInviteToUser = async (user: OrganizationUserRead) => {
  if (user.organization?.id) {
    try {
      await organizationsService.createInvitationEmailForOrganizationUser(
        user.organization.id,
        user.user_id,
      );
      showToast({
        text: "Invite resent successfully",
        status: "success",
        duration: 5000,
      });
    } catch (error) {
      if (error.response?.status === 429) {
        showToast({
          text: "You can only send one invite every two minutes, please try again later",
          status: TypeToastStatuses.Warning,
          duration: 5000,
        });
        return;
      }
      showToast({
        text: "Error resending user invite",
        status: TypeToastStatuses.Error,
      });
    }
    emit("update", initialQueryParams.value);
  }
};

const onCancelInviteToUser = async (user: OrganizationUserRead) => {
  try {
    await organizationsService.updateOrganizationUserStatus(
      user.organization.id,
      user.user_id,
      { status: OrganizationUserStatus.CANCELLED },
    );
    showToast({
      text: "Invite cancelled successfully",
      status: "success",
      duration: 5000,
    });
    emit("update", initialQueryParams.value);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to cancel user invite",
      status: "error",
    });
  }
};

const formattedInvitedUsers: ComputedRef<OrganizationUserRead[]> = computed(
  () => {
    return (
      props.users?.results?.map((user) => {
        const last_status_date =
          user.status === OrganizationUserStatus.ACCEPTED
            ? user.last_status_date
            : "";
        const created_user =
          user.created_user?.first_name && user.created_user?.last_name
            ? `${user.created_user.first_name} ${user.created_user.last_name}`
            : user.created_user?.email || "-";
        return {
          ...user,
          created_user,
          last_status_date,
        };
      }) || []
    );
  },
);

const redirectToUserDetails = (userId: string) => {
  router.push(`/sc/users/${userId}?tab=invites`);
};

const onOpenDialogAddUserToGroups = (user: OrganizationUserRead) => {
  isDialogAddUserToGroupsOpen.value = true;
  dialogAddUserToGroupsData.value = {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    organization: user.organization,
  };
};

const onOpenDialogAddUserToUnit = (user: OrganizationUserRead) => {
  isDialogAddUserToUnitOpen.value = true;
  dialogAddUserToUnitData.value = {
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    unit: user.unit,
    organization: user.organization,
  };
};

const actionsInDropdown: ComputedRef<
  (user: OrganizationUserRead) => TypeDropdownItem[]
> = computed(() => {
  return (user: OrganizationUserRead): TypeDropdownItem[] => {
    const actions: TypeDropdownItem[] = [
      {
        label: "View details",
        type: "button",
        onClick: () => redirectToUserDetails(user.id),
      },
      {
        label: "Add to group",
        type: "button",
        isDisabled: props.isSCViewerOnly,
        onClick: () => onOpenDialogAddUserToGroups(user),
      },
      {
        label: "Add to organization unit",
        type: "button",
        isDisabled: props.isSCViewerOnly,
        onClick: () => onOpenDialogAddUserToUnit(user),
      },
    ];
    if (
      user.status === OrganizationUserStatus.CANCELLED ||
      user.status === OrganizationUserStatus.PENDING
    ) {
      actions.push({
        label: "Resend invite",
        type: "button",
        isDisabled: props.isSCViewerOnly,
        onClick: () => onResendInviteToUser(user),
      });
    }
    if (
      isUserOrgEditor.value &&
      user.status === OrganizationUserStatus.PENDING
    ) {
      actions.push({
        isDisabled: props.isSCViewerOnly,
        label: "Cancel invite",
        type: "button",
        onClick: () => onCancelInviteToUser(user),
      });
    }
    return actions;
  };
});

const handleUpdateParams = (params: TableRequestParams) => {
  emit("update", {
    ...initialQueryParams.value,
    ...params,
  });
};

const getBadgeStatus = (inviteStatus: string) => {
  switch (inviteStatus) {
    case "ACTIVE":
      return BadgeTypes.Inactive;
    case "CANCELLED":
      return BadgeTypes.Cancelled;
    case "EXPIRED":
      return BadgeTypes.Warning;
    default:
      return BadgeTypes.Active;
  }
};

const getInvitedStatus = (inviteStatus: string) => {
  switch (inviteStatus) {
    case "ACTIVE":
      return "Pending";
    case "CANCELLED":
      return "Cancelled";
    case "EXPIRED":
      return "Expired";
    default:
      return "Accepted";
  }
};

const onCloseDialogAddUserToGroups = () => {
  isDialogAddUserToGroupsOpen.value = false;
};

const onCloseDialogAddUserToUnit = () => {
  isDialogAddUserToUnitOpen.value = false;
};

onMounted(async () => {
  isUserOrgEditor.value = await authService.isUserOrgEditor();
});
</script>

<template>
  <m-m-table
    v-if="users"
    :is-loading="isLoading"
    :rows="formattedInvitedUsers"
    :headers="tableHeaders"
    :total-rows="users.total"
    show-search
    :empty-state="emptyState"
    cy="organization-users-table"
    @update-params="handleUpdateParams"
  >
    <template #email="{ row }">
      <m-m-link :to="`/sc/users/${row.id}?tab=invites`" font-weigth="500">
        {{ row.email }}
      </m-m-link>
    </template>
    <template #empty-state-button>
      <m-m-button
        prepend-icon="plus-white"
        cy="empty-state-button-open-dialog-invite-users"
        :is-disabled="isSCViewerOnly"
        @click="emit('invite-users')"
      >
        Invite users
      </m-m-button>
    </template>
    <template #invite_status="{ row }">
      <m-m-badge
        :status="getBadgeStatus(row.invite_status)"
        :text="getInvitedStatus(row.invite_status)"
        cy="organization-user-status"
        indicator
      />
    </template>
    <template #status_date="{ row }">
      <m-m-formatted-date
        :raw-date="row.status_date"
        format="D MMM YYYY, HH:mm"
      />
    </template>
    <template #last_status_date="{ row }">
      <m-m-formatted-date
        :raw-date="row.last_status_date"
        format="D MMM YYYY, HH:mm"
      />
    </template>
    <template #unit="{ row }">
      {{ row.unit?.name || "-" }}
    </template>
    <template #actions="{ row }">
      <div class="mm-flex mm-flex-justify-end">
        <m-m-dropdown
          :items="actionsInDropdown(row)"
          :cy="`dropdown-${row.id}`"
        >
          <template #activator>
            <m-m-button
              prepend-icon="dots-vertical"
              variant="text"
              cy="button-dropdown-activator"
            />
          </template>
        </m-m-dropdown>
      </div>
    </template>
  </m-m-table>
  <dialog-add-user-to-groups
    v-if="dialogAddUserToGroupsData"
    :is-open="isDialogAddUserToGroupsOpen"
    :data="dialogAddUserToGroupsData"
    @update="emit('update')"
    @close="onCloseDialogAddUserToGroups"
  />
  <dialog-add-user-to-unit
    v-if="dialogAddUserToUnitData"
    :is-open="isDialogAddUserToUnitOpen"
    :data="dialogAddUserToUnitData"
    @update="emit('update')"
    @close="onCloseDialogAddUserToUnit"
  />
</template>

<style scoped lang="scss"></style>
