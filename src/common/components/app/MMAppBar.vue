<script setup lang="ts">
import { onMounted, ref, Ref, computed, watch } from "vue";
import { authService } from "~/auth/auth.service";
import { usersService } from "~/users/users.service";
import { UserProfileMM } from "~/auth/auth.types";
import { useRoute } from "vue-router";
import { toggleMobileNav } from "~/mm_ui_kit/src/helpers/toggleMobileNav";
import type { TypeDropdownItem } from "~/mm_ui_kit/src/types/dropdown.types";
import { OrganizationRead, OrganizationUserReadBase } from "~/iam/iam.types";
import config from "~/mm.config.json";
import router from "~/router/index.router";
import MMOrgSwitcher from "~/common/components/app/MMOrgSwitcher.vue";
const route = useRoute();

const isProfilePage = ref(false);
const isSPOrg: Ref<boolean> = ref(false);
const onboardingCompleted = ref(false);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const organizationName: Ref<string | null> = ref(null);
const organizationId: Ref<string | null> = ref(null);
const organizations: Ref<OrganizationRead[]> = ref([]);
const isSCViewer: Ref<boolean> = ref(false);
const isSupportViewer: Ref<boolean> = ref(false);

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  if (userProfile.value) {
    organizationName.value = userProfile.value.org_name || null;
    organizationId.value = userProfile.value.org || null;
    onboardingCompleted.value = userProfile.value.onboarding_completed || false;

    const userInfo = await usersService.getUserMe();
    organizations.value = userInfo.organization_users
      ?.filter(
        (organization_user: OrganizationUserReadBase) =>
          organization_user.is_active,
      )
      .map((organization_user: OrganizationUserReadBase) => ({
        ...organization_user.organization,
        created_date: "",
        domains: null,
        industry: null,
        number_of_employees_range: null,
      }));

    isSCViewer.value = await authService.isUserOrgViewer();
    isSupportViewer.value = authService.isUserMMSupport(userProfile.value);
    isSPOrg.value = authService.isSPOrg(userProfile.value);
  }
});

const profileActions: TypeDropdownItem[] = [
  {
    label: "View profile",
    type: "link",
    icon: "user-outline-basic",
    iconColor: "#384250",
    to: "/user/profile",
  },
  {
    label: "Logout",
    type: "button",
    icon: "logout-outline",
    iconColor: "#384250",
    onClick: () => authService.logout(),
  },
];

const initials = computed(() =>
  userProfile.value?.given_name?.at(0) && userProfile.value?.family_name?.at(0)
    ? `${userProfile.value.given_name.at(0)}${userProfile.value.family_name.at(0)}`
    : null,
);

const spPortalUrl = computed(() => {
  if (organizationId.value) {
    return `${config.spApp.url}?organization_id=${organizationId.value}`;
  }
  return config.app.url;
});

const portalSwitchDisabled = computed(() => {
  return !isSCViewer.value && isSupportViewer.value;
});

const handleAdminMode = () => {
  router.push(`/login/sc-to-sp/${organizationId.value}`);
};

watch(
  () => route.path,
  () => {
    isProfilePage.value = Boolean(
      route.path.includes("/user/profile") || route.path.includes("/security"),
    );
  },
);
</script>

<template>
  <header class="mm-app-bar">
    <div class="mm-app-bar-hamburger">
      <m-m-link cy="mobile-nav-link" @click.prevent="toggleMobileNav">
        <m-m-icon icon="bars" width="24px" stroke="#191919" />
      </m-m-link>
    </div>
    <div class="mm-app-bar--logo">
      <m-m-portal-switcher
        :sp-portal="spPortalUrl"
        :disabled="portalSwitchDisabled"
        :is-sp-org="isSPOrg"
        @start-using-admin="handleAdminMode"
      ></m-m-portal-switcher>
    </div>
    <div class="mm-app-bar--right">
      <m-m-link
        id="help-centre"
        class="mm-app-bar--link"
        text-align="left"
        color="primary"
        font-size="16px"
        target="_blank"
        href="https://docs.myveriam.com/"
      >
        <m-m-icon icon="book-open-outline" stroke="#072E51"></m-m-icon>
        Docs
      </m-m-link>
      <m-m-org-switcher />

      <m-m-profile-card
        v-if="onboardingCompleted"
        :user-profile="userProfile"
        :initials="initials"
      ></m-m-profile-card>

      <m-m-link
        v-if="!userProfile"
        id="signup"
        class="mm-app-bar--link"
        text-align="left"
        color="gray-700"
        font-size="16px"
        @click.prevent="authService.signup()"
      >
        Signup
      </m-m-link>
    </div>

    <div class="mm-app-bar-profile">
      <m-m-dropdown
        v-if="onboardingCompleted"
        list-side="left"
        :items="profileActions"
        cy="profile-actions-dropdown"
      >
        <template #activator>
          <div
            class="mm-app-bar--link-mobile"
            text-align="left"
            color="gray-700"
            font-size="16px"
          >
            <img
              v-if="userProfile?.picture"
              :src="userProfile?.picture"
              class="mm-app-bar--avatar"
            />
            <div v-else class="mm-app-bar--initials">
              <m-m-icon v-if="initials" :icon="`initials-${initials}`" />
              <m-m-icon v-else icon="user-circle" />
            </div>
          </div>
        </template>
      </m-m-dropdown>
    </div>
  </header>
</template>
