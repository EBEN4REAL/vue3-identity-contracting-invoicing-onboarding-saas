<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, Ref } from "vue";
import { authService } from "~/auth/auth.service";
import { useFlag } from "@unleash/proxy-client-vue";
import { toggleMobileNav } from "~/mm_ui_kit/src/helpers/toggleMobileNav";
import { useGettingStartedStore } from "~/stores/gettingStarted";
import config from "~/mm.config.json";
import router from "~/router/index.router";
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
import { useUiStore } from "~/stores/useUiStore";

const organizationId: Ref<string | null> = ref(null);
const isMMAdmin: Ref<boolean> = ref(false);
const isSPViewer: Ref<boolean> = ref(false);
const isSCViewer: Ref<boolean> = ref(false);
const isSupportViewer: Ref<boolean> = ref(false);
const isSPOrg: Ref<boolean> = ref(false);
const isSubscriptionsEnabled = useFlag("org_subscriptions");
const accessLicensesEnabled = useFlag("org_licenses");
const isMobile: Ref<boolean> = ref(window.innerWidth < 1025);
const handleResize = () => {
  isMobile.value = window.innerWidth < 1025;
};

const portalSwitchDisabled = computed(() => {
  return !isSCViewer.value && !isSupportViewer.value;
});
const gettingStartedStore = useGettingStartedStore();
const uiStore = useUiStore();

const isAllStepsCompleted = computed(
  () => gettingStartedStore.isAllStepsCompleted,
);

const handleAdminMode = () => {
  router.push(`/login/sc-to-sp/${organizationId.value}`);
};

const spPortalUrl = computed(() => {
  if (organizationId.value) {
    return `${config.spApp.url}?organization_id=${organizationId.value}`;
  }
  return config.app.url;
});

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  const profile = await authService.getProfile();
  if (profile) {
    if (profile.onboarding_completed) {
      organizationId.value = profile.org || null;
      isMMAdmin.value = authService.isUserMMAdmin(profile);
      isSPViewer.value = await authService.isUserSPViewer();
      isSCViewer.value = await authService.isUserOrgViewer();
      isSupportViewer.value = authService.isUserMMSupport(profile);
      isSPOrg.value = authService.isSPOrg(profile);
    }
  }
  uiStore.setUserPermissions();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div :permanent="true" class="mm-app-navigation" data-cy="mm-app-navigation">
    <div class="mm-app-navigation--logo">
      <m-m-portal-switcher
        cy="portal-switch-app-nav"
        :sp-portal="spPortalUrl"
        :disabled="portalSwitchDisabled"
        :is-sp-org="isSPOrg"
        @start-using-admin="handleAdminMode"
      ></m-m-portal-switcher>

      <m-m-link
        class="mobile-close"
        cy="close-mobile-nav"
        @click.prevent="toggleMobileNav"
      >
        <m-m-icon icon="close"></m-m-icon>
      </m-m-link>
    </div>

    <!--    .mm-app-navigation--wrapper is needed to maintain correct layout-->
    <div class="mm-app-navigation--wrapper">
      <div class="mm-app-navigation--main mm-app-navigation--active">
        <div v-if="isMobile" class="org-switcher-container">
          <m-m-org-switcher is-mobile />
        </div>
        <template v-if="isSCViewer">
          <m-m-app-navigation-item
            v-if="!isAllStepsCompleted"
            id="app-navigation-access-getting-started"
            to="/sc/getting-started"
            :icon-prepend="sectionIcons['gettingStarted']"
            :label="$t('getting_started.nav_label')"
            cy="getting-started"
          />
        </template>
        <div class="mm-app-navigation--group">
          <div class="mm-app-navigation--title">My Account</div>

          <m-m-app-navigation-item
            to="/user/profile"
            :icon-prepend="sectionIcons['profile']"
            :label="$t('profile.nav_label')"
          />

          <m-m-app-navigation-item
            id="app-navigation-access-security"
            to="/user/security"
            :icon-prepend="sectionIcons['security']"
            :label="$t('security.nav_label')"
            cy="security"
          />

          <m-m-app-navigation-item
            id="app-navigation-my-access"
            to="/user/my-access"
            :icon-prepend="sectionIcons['key']"
            :label="$t('my_access.nav_label')"
            cy="my-access"
          />
        </div>
        <template v-if="isSCViewer">
          <div class="mm-app-navigation--group">
            <div class="mm-app-navigation--title">My Organization</div>
            <m-m-app-navigation-item
              id="app-navigation-access-organization"
              :to="`/sc/organizations/${organizationId}`"
              :icon-prepend="sectionIcons['organizationDetails']"
              :label="$t('organization.nav_label')"
              cy="organization-details"
            />

            <m-m-app-navigation-item
              id="app-navigation-access-users"
              to="/sc/users"
              :icon-prepend="sectionIcons['users']"
              :label="$t('users.nav_label')"
              cy="users"
            />

            <m-m-app-navigation-item
              id="app-navigation-access-groups"
              to="/sc/groups"
              :icon-prepend="sectionIcons['groups']"
              :label="$t('groups.nav_label')"
              cy="groups"
            />

            <m-m-app-navigation-item
              id="app-navigation-access-units"
              to="/sc/units"
              :icon-prepend="sectionIcons['units']"
              :label="$t('org_units.nav_label')"
              cy="units"
            />

            <m-m-app-navigation-item
              v-if="accessLicensesEnabled"
              id="navigation-drawer-organization-access-licenses"
              data-cy="navigation-drawer-organization-access-licenses"
              to="/sc/access-licenses"
              :icon-prepend="sectionIcons['accessLicense']"
              :label="$t('access_licenses.nav_label')"
            />

            <m-m-app-navigation-item
              v-if="isSubscriptionsEnabled"
              id="navigation-drawer-organization-subscriptions"
              data-cy="navigation-drawer-organization-subscriptions"
              to="/sc/subscriptions"
              :icon-prepend="sectionIcons['licenses']"
              :label="$t('subscriptions.nav_label')"
            />

            <m-m-app-navigation-item
              id="navigation-drawer-organization-logs"
              data-cy="navigation-drawer-organization-logs"
              to="/sc/logs"
              :icon-prepend="sectionIcons['logs']"
              :label="$t('logs.nav_label')"
            />
          </div>
        </template>
        <div class="mm-app-navigation--separator" />
        <div
          v-if="isMMAdmin && !isSupportViewer"
          class="mm-app-navigation--group mm-mt-auto mm-mb-6"
        >
          <m-m-app-navigation-item
            id="app-navigation-admin"
            to="/sc/admin"
            :icon-prepend="sectionIcons['settings']"
            :label="$t('admin.nav_label')"
          />

          <m-m-app-navigation-item
            id="app-navigation-provide-support"
            to="/login/support"
            :icon-prepend="sectionIcons['provideSupport']"
            :label="$t('provide_support.nav_label')"
            data-cy="provide-support-nav-link"
            is-reload
          />
        </div>
      </div>
    </div>
  </div>
</template>
