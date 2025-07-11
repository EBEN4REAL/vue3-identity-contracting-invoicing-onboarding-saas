import { defineAsyncComponent, Ref, ref } from "vue";
import { TypeComponentMapEntry } from "./types";
import { authService } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";

const userProfile: Ref<UserProfileMM | null> = ref(null);

const getUserProfile = async () => {
  userProfile.value = await authService.getProfile();
};

await getUserProfile();

export const welcomeComponentsMap: Record<string, TypeComponentMapEntry> = {
  InviteYourColleagues: {
    component: defineAsyncComponent(
      () => import("./components/InviteYourColleagues.vue"),
    ),
    icon: "invite-colleagues",
    title: "Invite your colleagues",
    badge: {
      text: "Optional",
      status: "inactive",
    },
    buttons: [
      {
        label: "Invite colleagues",
        icon: "plus",
        path: "/sc/users",
      },
    ],
  },
  SetupOrganizationStructure: {
    component: defineAsyncComponent(
      () => import("./components/SetupOrganizationStructure.vue"),
    ),
    icon: "setup-organization-structure",
    title: "Setup organization structure",
    badge: {
      text: "Optional",
      status: "inactive",
    },
    buttons: [
      {
        label: "Create group",
        icon: "arrow-right-fill",
        path: "/sc/groups",
        props: { "icon-height": "12px" },
      },
      {
        label: "Create organizational unit",
        icon: "arrow-right-fill",
        path: "/sc/units",
        props: { "icon-height": "12px" },
      },
    ],
  },
  ViewLicensesAndPolicies: {
    component: defineAsyncComponent(
      () => import("./components/ViewLicensesAndPolicies.vue"),
    ),
    icon: "clipboard-document",
    title: "View licenses & policies",
    badge: {
      text: "Optional",
      status: "inactive",
    },
    buttons: [
      {
        label: "View licenses",
        icon: "arrow-right-fill",
        path: "/sc/access-licenses",
        props: { "icon-height": "12px" },
      },
      {
        label: "View policies",
        icon: "arrow-right-fill",
        path: `/sc/organizations/${userProfile.value?.org}`,
        hash: "#Policies",
        props: { "icon-height": "12px" },
      },
    ],
  },
  ViewAccessToProviders: {
    component: defineAsyncComponent(
      () => import("./components/ViewAccessToProviders.vue"),
    ),
    icon: "key-fill",
    title: "View access to providers",
    badge: {
      text: "Optional",
      status: "inactive",
    },
    buttons: [
      {
        label: "View policies",
        icon: "arrow-right-fill",
        path: `/sc/organizations/${userProfile.value?.org}`,
        hash: "#Access",
        props: { "icon-height": "12px" },
      },
      {
        label: "View access licenses",
        icon: "arrow-right-fill",
        path: "/sc/access-licenses",
        props: { "icon-height": "12px" },
      },
      {
        label: "View subscriptions",
        icon: "arrow-right-fill",
        path: "/sc/subscriptions",
        props: { "icon-height": "12px" },
      },
    ],
  },
};
