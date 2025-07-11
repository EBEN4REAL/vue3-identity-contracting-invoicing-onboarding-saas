<script setup lang="ts">
import { ref, reactive, computed, onMounted, Ref, ComputedRef } from "vue";
import { usersService } from "~/users/users.service";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import {
  LoginAttemptRead,
  UserRead,
  UserEmailRead,
  UserSessionRead,
  UserSocialAccountRead,
  UserLoginHistoryAccessRead,
  MFARead,
} from "~/iam/iam.types";
import {
  SOCIAL_ICONS,
  ITEMS_PER_PAGE,
  HISTORY_LOGIN_OUTCOME_MAP,
} from "~/common/constants";
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";

import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import TwoFactorAuthentication from "../TwoFactorAuthentication.vue";
import WebAuthentication from "../WebAuthentication.vue";
import EmailOTP from "../EmailOTP.vue";
import MFAConfig from "../MFAConfig.vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import DialogChangePassword from "~/users/DialogChangePassword.vue";
import DialogSetPassword from "~/users/DialogSetPassword.vue";

const isButtonSubmitLoading: Ref<boolean> = ref(false);
const isUserLoginHistoryLoading: Ref<boolean> = ref(false);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const user: Ref<UserRead | null> = ref(null);
const userSessionsResponse: Ref<TableResponse<UserSessionRead>> = ref(null);
const userLoginHistoriesResponse: Ref<TableResponse<LoginAttemptRead>> =
  ref(null);
const userSocialAccounts: Ref<UserSocialAccountRead[]> = ref([]);
const isConfirmDeleteDialogOpen: Ref<boolean> = ref(false);
const socialAccountTypeToDelete: Ref<string | null> = ref(null);
const pendingEmail: Ref<UserEmailRead | null> = ref(null);
const magicLinkToolTipText: Ref<string> = ref(
  "Get a Magic Link send to your email address for passwordless login",
);
const isDialogChangePasswordOpen: Ref<boolean> = ref(false);
const isDialogSetPasswordOpen: Ref<boolean> = ref(false);
const userMFA: Ref<MFARead | null> = ref(null);

const isMagicLinkToggled: ComputedRef<boolean> = computed(
  () => user.value?.magic_link_enabled ?? false,
);
const showWebauthn: ComputedRef<boolean> = computed(() => !!user.value);
const showTOTP: ComputedRef<boolean> = computed(() => !!user.value);
const showEmailOTP: ComputedRef<boolean> = computed(() => !!user.value);

const SESSIONS_TABLE_HEADERS = [
  { key: "create_date", label: "Date started" },
  { key: "ip_address", label: "IP address" },
  { key: "user_agent", label: "User agent" },
  { key: "valid_till", label: "Session" },
  { key: "actions", label: "Actions" },
];

const LOGIN_HISTORIES_TABLE_HEADERS = [
  {
    key: "date",
    label: "Date & time",
    sortLabel: "Newest first",
    sortable: true,
    defaultSortItem: true,
    order: "desc",
    sortIcon: true,
  },
  { key: "url", label: "Application URL" },
  { key: "login_outcome", label: "Authentication" },
  { key: "login_access", label: "Access" },
  { key: "organization", label: "On behalf of" },
  { key: "ip_address", label: "IP address" },
];

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  getUserMFA();

  await Promise.all([
    getUser(),
    getUserSessions({ limit: ITEMS_PER_PAGE[0], offset: "0" }),
    getUserLoginHistories({ limit: ITEMS_PER_PAGE[0], offset: "0" }),
    getUserSocialAccounts(),
  ]);
});

const localCopyUserData = reactive({
  first_name: "",
  last_name: "",
  email: "",
  pendingEmail: "",
  phone_number: "",
  organization_users: [{}],
});

const resetLocalCopyUserData = () => {
  if (!user.value) return;

  localCopyUserData.first_name = user.value.first_name;
  localCopyUserData.last_name = user.value.last_name;
  localCopyUserData.email = user.value.email;
  localCopyUserData.pendingEmail = pendingEmail.value?.email;
  localCopyUserData.organization_users = user.value.organization_users;
};

const getUser = async () => {
  user.value = await usersService.getUserMe();
  resetLocalCopyUserData();
};

const getUserSocialAccounts = async () => {
  userSocialAccounts.value = await usersService.getUserMeSocialAccounts();
};

const getUserSessions = async (params: TableRequestParams) => {
  userSessionsResponse.value = await usersService.getUserMeSessions(params);
};

const getUserMFA = async () => {
  try {
    userMFA.value = await usersService.getUserMeMFA();
  } catch (err) {
    if (err.response.status === 404) {
      userMFA.value = null;
    }
  }
};

const getUserLoginHistories = async (params: TableRequestParams) => {
  isUserLoginHistoryLoading.value = true;

  try {
    userLoginHistoriesResponse.value =
      await usersService.getUserMeLoginHistories(params);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to fetch user login history",
      status: "error",
    });
  } finally {
    isUserLoginHistoryLoading.value = false;
  }
};

const deleteSession = async (token: string) => {
  await usersService.deleteUserMeSession(token);
  await getUserSessions({ limit: ITEMS_PER_PAGE[0], offset: "0" });
};

const deleteSocialAccount = async () => {
  const type = socialAccountTypeToDelete.value;

  if (!type) return;
  isButtonSubmitLoading.value = true;

  await usersService.deleteUserMeSocialAccount(type);
  await getUserSocialAccounts();

  toggleConfirmDelete();
  isButtonSubmitLoading.value = false;
};

const checkIsSessionActive = (validTill: string): boolean =>
  new Date(validTill) > new Date();

const getSessionStatus = (validTill: string): BadgeTypes =>
  checkIsSessionActive(validTill) ? BadgeTypes.Active : BadgeTypes.Inactive;

const getAccessStatus = (status: UserLoginHistoryAccessRead) => {
  switch (status) {
    case "A":
    case "ALLOW":
      return {
        badgeType: BadgeTypes.Active,
        text: "Allow",
        toolTipTextContent: "Access was granted to the application",
      };
    default:
      return {
        badgeType: BadgeTypes.Cancelled,
        text: "Denied",
        toolTipTextContent: "Access was denied to the application",
      };
  }
};

const getOutcomeStatus = (status: string | null) => {
  switch (status) {
    case "S":
      return {
        badgeType: BadgeTypes.Active,
        toolTipTextContent: "Authentication was successful",
      };
    case "P":
      return {
        badgeType: BadgeTypes.Warning,
        toolTipTextContent: "Authentication started but not completed",
      };
    default:
      return {
        badgeType: BadgeTypes.Cancelled,
        toolTipTextContent: "Authentication failed",
      };
  }
};

const toggleConfirmDelete = () => {
  isConfirmDeleteDialogOpen.value = !isConfirmDeleteDialogOpen.value;
};

const isButtonDeleteSocialAccountVisible: ComputedRef<boolean> = computed(() =>
  Boolean(
    userSocialAccounts.value.length > 1 ||
      (userSocialAccounts.value.length === 1 && user.value?.has_password),
  ),
);

const handleToggle = async (magicLinkToggled: boolean) => {
  try {
    const payload = { enabled: magicLinkToggled };
    await usersService.updateMagicLink(payload);

    showToast(
      magicLinkToggled
        ? "Magic Link Enabled Successfully"
        : "Magic Link Disabled Successfully",
      "info",
    );
  } catch (error) {
    const errorMessage = "An unexpected error occurred.";
    showToast(errorMessage, "error");
  }
};

const showToast = (message: string, status: "info" | "error") => {
  eventBus.$emit("onShowToast", {
    text: message,
    status: status,
  });
};

const handleUpdateSessionTableParams = async (params: TableRequestParams) => {
  const { limit, offset } = params;
  await getUserSessions({ limit, offset });
};

const handleUpdateLoginHistoryTableParams = async (
  params: TableRequestParams,
) => {
  const { limit, offset, query, sort } = params;
  await getUserLoginHistories({
    limit,
    offset,
    ...(query && { query }),
    ...(sort && { sort }),
  });
};

const onDeleteSocialAccount = (accType: string) => {
  socialAccountTypeToDelete.value = accType;
  toggleConfirmDelete();
};

const onOpenDialogChangePassword = () => {
  isDialogChangePasswordOpen.value = true;
};

const onCloseDialogChangePassword = () => {
  isDialogChangePasswordOpen.value = false;
};

const onOpenDialogSetPassword = () => {
  isDialogSetPasswordOpen.value = true;
};

const onCloseDialogSetPassword = () => {
  isDialogSetPasswordOpen.value = false;
};

const onSubmitDialogSetPassword = () => {
  user.value.has_password = true;
};
</script>

<template>
  <m-m-overview-page resource-id="security" :show-config-banner="false" />
  <div>
    <div class="mm-flex mm-flex-column">
      <h2 class="mm-page-title mm-page-title--h2">Password</h2>
      <div class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8">
        Manage the accounts you can use to login to your Veriam account
      </div>

      <m-m-button
        v-if="user?.has_password"
        size="small"
        variant="outlined"
        class="mm-mr-auto"
        cy="button-change-password"
        @click="onOpenDialogChangePassword"
      >
        Change password
      </m-m-button>

      <m-m-button
        v-else
        size="small"
        variant="outlined"
        class="mm-mr-auto"
        cy="button-set-password"
        @click="onOpenDialogSetPassword"
      >
        Set password
      </m-m-button>

      <m-m-divider class="mm-my-12" />
    </div>

    <div>
      <div :class="userSocialAccounts.length ? 'mm-mb-12' : 'mm-mb-8'">
        <h2 class="mm-page-title mm-page-title--h2">Connected accounts</h2>
        <div class="mm-page-subtitle mm-page-subtitle--h2 mm-mb-8">
          Manage the accounts you can use to login to your Veriam account
        </div>
      </div>
      <div v-if="userSocialAccounts.length" class="mm-mb-8">
        <div
          v-for="acc of userSocialAccounts"
          :key="acc.id"
          class="mm-flex mm-flex-gap-8 mm-flex-align-center"
          data-cy="user-social-accounts"
        >
          <m-m-icon
            v-if="SOCIAL_ICONS[acc.account_type]"
            :icon="SOCIAL_ICONS[acc.account_type]"
            width="32px"
            height="32px"
          />
          <div>{{ acc.username }}</div>
          <m-m-button
            v-if="isButtonDeleteSocialAccountVisible"
            variant="text"
            class="remove-connection-button"
            size="small"
            :cy="`remove-social-${acc.account_type}`"
            @click="onDeleteSocialAccount(acc.account_type)"
          >
            Remove
          </m-m-button>
        </div>
      </div>
      <div v-else class="users-profile-no-accounts mm-mb-8">
        You don’t have any connected accounts.
      </div>
    </div>

    <div>
      <m-m-divider class="mm-my-12" />
      <div class="mm-mb-20">
        <h2 class="mm-page-title mm-page-title--h2">
          Multi-factor authentication
        </h2>
        <div class="mm-page-subtitle mm-page-subtitle--h2">
          Provide an additional layer of security with a variety of
          authentication options every time when your user log in
        </div>
      </div>
      <web-authentication
        v-if="showWebauthn"
        :user="user"
        @get-user-mfa="getUserMFA"
      />
      <two-factor-authentication v-if="showTOTP" @get-user-mfa="getUserMFA" />
      <email-o-t-p
        v-if="showEmailOTP"
        :user="user"
        class="mm-mb-15"
        @get-user-mfa="getUserMFA"
      />
    </div>

    <div
      class="mm-flex mm-flex-justify-between mm-flex-align-center mm-mb-15"
      data-cy="magic-link-setting"
    >
      <div class="mm-flex mm-flex-gap-5 mm-flex-align-center">
        <m-m-icon icon="magic-link" width="19.5px" height="19.5px" />
        <span>Magic link</span>
        <div>
          <m-m-icon icon="info" width="18px" height="18px" />
          <m-m-tooltip display-position="toRight">
            {{ magicLinkToolTipText }}
          </m-m-tooltip>
        </div>
      </div>
      <div>
        <m-m-toggle-button
          v-model="isMagicLinkToggled"
          cy="mm-toggle-button-magic-link"
          @toggled="handleToggle"
        />
      </div>
    </div>
    <m-f-a-config :user="user" />
    <m-m-divider class="mm-my-12" />
    <div>
      <div class="mm-mb-8">
        <h2 class="mm-page-title mm-page-title--h2">Recent Sessions</h2>
        <div class="mm-page-subtitle mm-page-subtitle--h2">
          List of sessions where you used your Veriam account in the last month
        </div>
      </div>

      <m-m-table
        :headers="SESSIONS_TABLE_HEADERS"
        :rows="userSessionsResponse?.results ?? []"
        :total-rows="userSessionsResponse?.total ?? 0"
        cy="user-sessions"
        @update-params="handleUpdateSessionTableParams"
      >
        <template #create_date="{ row }">
          <m-m-formatted-date
            :raw-date="row.create_date"
            format="D MMM YYYY, HH:mm"
          />
        </template>
        <template #user_agent="{ row }">
          <m-m-text-ellipsis max-width="200px"
            >{{ row.user_agent }}
          </m-m-text-ellipsis>
        </template>
        <template #valid_till="{ row }">
          <m-m-badge :status="getSessionStatus(row.valid_till)" indicator />
        </template>
        <template #actions="{ row }">
          <m-m-button
            v-if="checkIsSessionActive(row.valid_till)"
            variant="text"
            size="small"
            :cy="`delete-session-${row.session_token}`"
            @click="deleteSession(row.session_token)"
          >
            End session
          </m-m-button>
        </template>
      </m-m-table>
    </div>

    <m-m-divider class="mm-my-12" />

    <div class="mm-mb-8">
      <h2 class="mm-page-title mm-page-title--h2">Login history</h2>
      <div class="mm-page-subtitle mm-page-subtitle--h2">
        A history of all your past logins and login attempts
      </div>
    </div>

    <m-m-table
      :headers="LOGIN_HISTORIES_TABLE_HEADERS"
      :is-loading="isUserLoginHistoryLoading"
      :rows="userLoginHistoriesResponse?.results ?? []"
      :total-rows="userLoginHistoriesResponse?.total ?? 0"
      show-search
      cy="user-login-histories"
      @update-params="handleUpdateLoginHistoryTableParams"
    >
      <template #date="{ row }">
        <m-m-text-ellipsis max-width="200px">
          <m-m-formatted-date :raw-date="row.date" format="D MMM YYYY, HH:mm" />
        </m-m-text-ellipsis>
      </template>
      <template #url="{ row }">
        <m-m-text-ellipsis max-width="200px"
          >{{ row.oauth_client?.url }}
        </m-m-text-ellipsis>
      </template>
      <template #login_outcome="{ row }">
        <m-m-text-ellipsis max-width="200px"
          ><m-m-badge
            :text="HISTORY_LOGIN_OUTCOME_MAP[row.login_outcome ?? 'F']"
            :status="getOutcomeStatus(row.login_outcome as string).badgeType"
            indicator
          >
            <m-m-tooltip max-width="212px" display-position="toRight">
              {{
                getOutcomeStatus(row.login_outcome as string).toolTipTextContent
              }}
            </m-m-tooltip>
          </m-m-badge>
        </m-m-text-ellipsis>
      </template>
      <template #login_access="{ row }">
        <m-m-text-ellipsis max-width="200px"
          ><m-m-badge
            :text="getAccessStatus(row.login_access).text"
            :status="getAccessStatus(row.login_access).badgeType"
            indicator
          >
            <m-m-tooltip max-width="212px" display-position="toRight">
              {{
                getAccessStatus(row.login_access as string).toolTipTextContent
              }}
            </m-m-tooltip>
          </m-m-badge>
        </m-m-text-ellipsis>
      </template>
      <template #organization="{ row }">
        <m-m-text-ellipsis max-width="200px"
          >{{ row.organization?.name }}
        </m-m-text-ellipsis>
      </template>
      <template #ip_address="{ row }">
        <m-m-text-ellipsis max-width="200px"
          >{{ row.ip_address }}
        </m-m-text-ellipsis>
      </template>
    </m-m-table>
    <m-m-dialog
      :is-open="isConfirmDeleteDialogOpen"
      title="Delete social account"
      icon="trash"
      subtitle="Are you sure you want to delete this social account?"
      @close="toggleConfirmDelete"
    >
      <template #footer>
        <m-m-button
          variant="outlined"
          data-cy="button-cancel-delete-sub-organization"
          @click="toggleConfirmDelete"
        >
          Cancel
        </m-m-button>
        <m-m-button
          variant="danger"
          :loading="isButtonSubmitLoading"
          data-cy="button-confirm-delete-sub-organization"
          @click="deleteSocialAccount"
        >
          Delete
        </m-m-button>
      </template>
    </m-m-dialog>
  </div>

  <dialog-change-password
    v-if="userProfile?.email"
    :is-open="isDialogChangePasswordOpen"
    :username="userProfile?.email"
    @close="onCloseDialogChangePassword"
  />

  <dialog-set-password
    v-if="userProfile?.email"
    :is-open="isDialogSetPasswordOpen"
    :username="userProfile?.email"
    @close="onCloseDialogSetPassword"
    @submit="onSubmitDialogSetPassword"
  />
</template>

<style scoped lang="scss">
.remove-connection-button {
  line-height: 20px;
  color: #b42318;
}
.users-profile {
  &-no-accounts {
    color: #6c737f;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
