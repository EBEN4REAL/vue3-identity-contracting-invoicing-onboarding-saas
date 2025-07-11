import { createRouter, createWebHistory, Router } from "vue-router";
import config from "~/mm.config.json";
import Signup from "~/signup/Signup.vue";
import Home from "~/common/Home.vue";
import PageNotFound from "~/common/PageNotFound.vue";
import Login from "~/auth/Login.vue";
import AppLayout from "~/mm_ui_kit/src/layouts/AppLayout.vue";
import AuthLayout from "~/mm_ui_kit/src/layouts/AuthLayout.vue";
import OnboardingLayout from "~/layouts/OnboardingLayout.vue";
import EmptyLayout from "~/mm_ui_kit/src/layouts/EmptyLayout.vue";
import SplitLayout from "~/layouts/SplitLayout.vue";
import LoginOrganization from "~/auth/LoginOrganization.vue";

import {
  isUserLoggedIn,
  isUserMMAdmin,
  isUserSC,
  PAGE_NOT_FOUND,
  redirectLoggedInUser,
  redirectToPlatform,
  saveBrandingConfigToStore,
} from "./middleware.router";

import { hideMobileNav } from "~/mm_ui_kit/src/helpers/toggleMobileNav";
import { applyBrandingConfigStyling } from "~/mm_ui_kit/src/helpers/applyBrandingConfigStyling";
import LogoutFrontChannel from "~/auth/LogoutFrontChannel.vue";
import Logout from "~/auth/Logout.vue";
import LogoutCallback from "~/auth/LogoutCallback.vue";

// Admin Routes
const adminRoutes = {
  path: "admin",
  meta: { layout: AppLayout },
  children: [
    {
      path: "",
      meta: {
        layoutName: "CommonPageLayout",
      },
      name: "Admin",
      component: () => import("~/admin/Index.vue"),
    },
    {
      path: "agreement-types",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/agreement-types/AgreementTypes.vue"),
    },
    {
      path: "applications",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/applications/Applications.vue"),
    },
    {
      path: "applications/:application_id",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Applications",
          link: "/sc/admin/applications",
        },
      },
      component: () => import("~/admin/applications/Application.vue"),
      props: true,
    },
    {
      path: "attribute-types",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () =>
        import("~/attribute-types/AttributeTypesAdmin/AttributeTypes.vue"),
    },
    {
      path: "configs",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/configs/Configs.vue"),
    },
    {
      path: "configs/:config_id",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Configs",
          link: "/sc/admin/configs",
        },
      },
      component: () => import("~/admin/configs/Config.vue"),
      props: true,
    },
    {
      path: "legal-document-types",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () =>
        import("~/admin/legal-document-types/LegalDocumentTypes.vue"),
    },
    {
      path: "login-attempts",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/login-attempts/LoginAttempts.vue"),
    },
    {
      path: "logs",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/logs/Index.vue"),
    },
    {
      name: "AdminAccessLogDetails",
      path: "access-logs/:id",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Logs",
          link: "/sc/admin/logs",
        },
      },
      component: () => import("~/admin/logs/AccessLogsDetails.vue"),
    },
    {
      path: "organizations",
      name: "Organizations",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/organizations/Organizations.vue"),
    },
    {
      path: "policies",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/policies/Policies.vue"),
    },
    {
      path: "policy-types",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/policy-types/PolicyTypes.vue"),
    },
    {
      path: "section-types",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/section-types/SectionTypes.vue"),
    },
    {
      path: "section-types/:section_type_id",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Section Types",
          link: "/sc/admin/section-types",
        },
      },
      component: () => import("~/admin/section-types/SectionType.vue"),
      props: true,
    },
    {
      path: "service-providers",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/service-providers/ServiceProviders.vue"),
    },
    {
      path: "users",
      name: "Admin Users",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/users/UserOverviewAdmin.vue"),
    },
    {
      path: "users/:user_id",
      meta: {
        layoutName: "CommonPageLayout",
        hasIcon: true,
        backTo: {
          label: "Users",
          link: "/sc/admin/users",
        },
      },
      component: () => import("~/users/UserDetailsAdmin/Index.vue"),
      props: true,
    },
    {
      path: "wizard-types",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/wizard-types/WizardTypes.vue"),
    },
    {
      path: "wizard-types/:wizard_type_id",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Wizard Types",
          link: "/sc/admin/wizard-types",
        },
      },
      component: () => import("~/admin/wizard-types/WizardType.vue"),
      props: true,
    },
    {
      path: "wizards",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Admin",
          link: "/sc/admin",
        },
      },
      component: () => import("~/admin/wizards/Wizards.vue"),
    },
    {
      path: "wizards/:wizard_id",
      meta: {
        layoutName: "CommonPageLayout",
        backTo: {
          label: "Wizards",
          link: "/sc/admin/wizards",
        },
      },
      component: () => import("~/admin/wizards/Wizard.vue"),
      props: true,
    },
  ],
  beforeEnter: [isUserMMAdmin],
};

const nonAdminRoutes = {
  path: "/",
  meta: { layout: AppLayout },
  children: [
    {
      path: "/user/profile",
      meta: {
        layoutName: "CommonPageLayout",
      },
      component: () => import("~/users/UserProfile.vue"),
      beforeEnter: [isUserLoggedIn],
    },
    {
      name: "AccountSecurity",
      path: "/user/security",
      beforeEnter: [isUserLoggedIn],
      meta: {
        layoutName: "CommonPageLayout",
      },
      component: () => import("~/users/AccountSecurity/AccountSecurity.vue"),
    },
    {
      name: "MyAccess",
      path: "/user/my-access",
      beforeEnter: [isUserLoggedIn],
      meta: {
        layoutName: "CommonPageLayout",
      },
      component: () => import("~/users/Access/MyAccess.vue"),
    },
  ],
};

const routes = [
  // Landing page
  {
    path: "/",
    meta: { layout: AuthLayout },
    component: Home,
    beforeEnter: [redirectToPlatform],
  },
  // Auth routes
  {
    path: "/login",
    meta: { layout: AuthLayout },
    component: Login,
    props: true,
    beforeEnter: [redirectLoggedInUser],
  },
  {
    path: "/login-mfa",
    meta: { layout: AuthLayout },
    component: () => import("../auth/MFA/Login/index.vue"),
    beforeEnter: [redirectLoggedInUser],
  },
  {
    path: "/login/organization",
    meta: { layout: AuthLayout },
    component: LoginOrganization,
    props: true,
  },
  {
    path: "/login/support",
    meta: { layout: AuthLayout },
    component: () => import("../auth/LoginAsSupport.vue"),
    props: true,
  },
  {
    path: "/login/sc-to-sp/:id",
    meta: { layout: AuthLayout },
    component: () => import("../auth/LoginSCToSP.vue"),
    props: true,
  },
  {
    path: "/logout",
    meta: { layout: AuthLayout },
    component: Logout,
  },
  {
    path: "/logout/callback",
    meta: { layout: AuthLayout },
    component: LogoutCallback,
  },
  {
    path: "/logout/frontchannel",
    meta: { layout: AuthLayout },
    component: LogoutFrontChannel,
  },
  {
    path: "/signup",
    meta: { layout: AuthLayout },
    children: [
      {
        path: "",
        component: Signup,
      },
      {
        path: "verification",
        component: () => import("../signup/Verification.vue"),
        beforeEnter: [redirectLoggedInUser],
      },
      {
        path: "confirmation",
        component: () => import("../signup/Confirmation.vue"),
        beforeEnter: [redirectLoggedInUser],
      },
      {
        path: "totp",
        component: () => import("../signup/TOTP.vue"),
        meta: {
          layoutContentAutoWidth: true,
        },
        beforeEnter: [redirectLoggedInUser],
      },
      {
        path: "webauthn",
        component: () => import("../auth/LoginWithWebAuthn.vue"),
        beforeEnter: [redirectLoggedInUser],
      },
      {
        path: "mfa",
        component: () => import("../auth/MFA/Signup/index.vue"),
        beforeEnter: [redirectLoggedInUser],
      },
      {
        path: "email-otp",
        component: () => import("../signup/EmailOTP.vue"),
        beforeEnter: [redirectLoggedInUser],
      },
    ],
  },
  {
    path: "/email/verification",
    meta: { layout: AuthLayout },
    component: () => import("~/users/UserEmailConfirmation.vue"),
  },
  {
    path: "/authorized",
    meta: { layout: AuthLayout },
    component: () => import("../auth/OAuthAuthorizeResponse.vue"),
  },
  {
    path: "/forgotten-password",
    meta: { layout: AuthLayout },
    component: () => import("../auth/ForgottenPassword.vue"),
    beforeEnter: [redirectLoggedInUser],
  },
  {
    path: "/login/sso",
    meta: { layout: AuthLayout },
    component: () => import("../auth/LoginWithSSO.vue"),
    beforeEnter: [redirectLoggedInUser],
  },
  {
    path: "/reset-password",
    meta: { layout: AuthLayout },
    component: () => import("../auth/ResetPassword.vue"),
    beforeEnter: [redirectLoggedInUser],
  },
  // SP Access Denied Page
  {
    path: "/sp-access-denied",
    meta: { layout: EmptyLayout },
    name: "SP Access Denied",
    component: () => import("~/service-providers/SPAccessDenied.vue"),
    props: true,
  },
  // SP Plan Page
  {
    path: "/sp-plan-page",
    meta: { layout: AuthLayout },
    component: () => import("~/service-providers/SPPlanPage.vue"),
  },
  // Checkout
  {
    path: "/checkout/:agreement_id",
    name: "Checkout",
    meta: {
      layout: SplitLayout,
    },
    component: () => import("~/billing_and_invoicing/checkout/Checkout.vue"),
    props: true,
  },
  // Error Page
  {
    path: "/error-page",
    meta: { layout: EmptyLayout },
    name: "Error Page",
    component: () => import("~/common/ErrorPage.vue"),
    props: true,
  },
  // Onboarding
  {
    path: "/onboarding",
    meta: { layout: OnboardingLayout },
    component: () => import("~/onboarding/Onboarding.vue"),
  },
  {
    path: "/stripe-callback",
    meta: { layout: OnboardingLayout },
    component: () =>
      import("~/billing_and_invoicing/checkout/StripeCallback.vue"),
  },
  // Service Consumer
  {
    path: "/sc",
    meta: { platform: "sc", layout: AppLayout },
    children: [
      {
        path: "",
        redirect: "/sc/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("~/organizations/Dashboard.vue"),
      },
      {
        path: "organizations/:org_id",
        meta: {
          layoutName: "CommonPageLayout",
        },
        component: () => import("~/organizations/OrganizationDetail/Index.vue"),
        props: true,
      },
      {
        path: "groups",
        meta: {
          layoutName: "CommonPageLayout",
        },
        component: () => import("~/organizations/OrganizationGroups/Index.vue"),
      },
      {
        path: "groups/:group_id",
        meta: {
          layoutName: "CommonPageLayout",
          hasIcon: true,
          backTo: {
            label: "Groups",
            link: "/sc/groups",
          },
        },
        component: () =>
          import("~/organizations/OrganizationGroups/Details.vue"),
        props: true,
      },
      {
        name: "OrganizationUsers",
        path: "users",
        meta: {
          layoutName: "CommonPageLayout",
        },
        component: () => import("~/users/OrganizationUsers/Index.vue"),
      },
      {
        name: "GettingStarted",
        path: "getting-started",
        component: () => import("~/onboarding/getting-started/Index.vue"),
      },
      {
        name: "OrganizationLogs",
        path: "logs",
        meta: {
          layoutName: "CommonPageLayout",
        },
        component: () => import("~/logs/OrganizationLogs/Index.vue"),
      },
      {
        name: "AccessLogDetails",
        path: "logs/:id",
        meta: {
          layoutName: "CommonPageLayout",
          backTo: {
            label: "Logs",
            link: "/sc/logs",
          },
        },
        component: () =>
          import("~/logs/OrganizationLogs/Tabs/AccessLog/Details.vue"),
      },
      {
        path: "users/:id",
        meta: {
          layoutName: "CommonPageLayout",
          hasIcon: true,
          backTo: {
            label: "Users",
            link: "/sc/users",
          },
        },
        component: () => import("~/users/UserDetails/Index.vue"),
        props: true,
      },
      {
        name: "Subscriptions",
        path: "subscriptions",
        meta: {
          layoutName: "CommonPageLayout",
        },
        component: () => import("~/organizations/Subscriptions/Index.vue"),
      },
      {
        name: "SubscriptionDetails",
        path: "subscriptions/:license_id",
        meta: {
          layoutName: "CommonPageLayout",
          backTo: {
            label: "Subscriptions",
            link: "/sc/subscriptions",
          },
        },
        component: () =>
          import("~/organizations/licenses/LicenseDetails/LicenseDetails.vue"),
      },
      {
        name: "AccessLicenses",
        path: "access-licenses",
        meta: {
          layoutName: "CommonPageLayout",
        },
        component: () => import("~/organizations/AccessLicenses/Index.vue"),
      },
      {
        name: "AccessLicenseDetails",
        path: "access-licenses/:license_id",
        meta: {
          backTo: {
            label: "Access Licenses",
            link: "/sc/access-licenses",
          },
          layoutName: "CommonPageLayout",
        },
        component: () =>
          import("~/organizations/licenses/LicenseDetails/LicenseDetails.vue"),
      },
      {
        path: ":org_id/pending_requests/:org_user_id",
        component: () => import("~/organizations/JoinRequest.vue"),
        props: true,
      },
      {
        path: "units",
        name: "OrganizationUnits",
        meta: { layoutName: "CommonPageWithAsideLayout" },
        children: [
          {
            path: "",
            name: "OrganizationUnit",
            component: () =>
              import("~/organizations/OrganizationUnits/OrganizationUnit.vue"),
          },
          {
            path: "empty",
            name: "OrganizationUnitsEmpty",
            meta: {
              layoutName: "CommonPageEmptyLayout",
            },
            component: () =>
              import(
                "~/organizations/OrganizationUnits/OrganizationUnitsEmpty.vue"
              ),
          },
          {
            path: ":unitId",
            name: "OrganizationUnitDetails",
            component: () =>
              import("~/organizations/OrganizationUnits/Index.vue"),
          },
        ],
      },
      adminRoutes,
    ],
    beforeEnter: [isUserSC],
  },
  nonAdminRoutes,
  // UI Components Library
  {
    path: "/components-library",
    meta: { layout: EmptyLayout },
    name: "ComponentsLibrary",
    component: config.componentsLibEnabled
      ? () => import("~/components-library/MMComponentsLibrary.vue")
      : PageNotFound,
    beforeEnter: [isUserMMAdmin],
  },
  // 404
  {
    path: "/:pathMatch(.*)*",
    meta: { layout: EmptyLayout },
    name: PAGE_NOT_FOUND,
    component: PageNotFound,
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  to.meta.previousRoute = from;
  saveBrandingConfigToStore(to);
  applyBrandingConfigStyling(to);
  hideMobileNav();
  next();
});

// Reload the page if the module fails to load on new build - set maxRetries to avoid infinite loop
const maxRetries = 2;

router.onError((error, to) => {
  if (
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  ) {
    let retryCount = parseInt(sessionStorage.getItem("retryCount") || "0", 10);

    if (retryCount < maxRetries) {
      retryCount++;
      sessionStorage.setItem("retryCount", retryCount.toString());
      window.location.href = to.fullPath;
    } else {
      console.error("Failed to load module after multiple attempts:", error);
      sessionStorage.removeItem("retryCount");
    }
  }
});

export default router;
