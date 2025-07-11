import { RouteLocationNormalized } from "vue-router";
import { authService, userManager } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";
import router from "./index.router";
import { User } from "oidc-client-ts";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { useGettingStartedStore } from "~/stores/gettingStarted";
import { getSpBranding } from "~/auth/cookies";

export const PAGE_NOT_FOUND: string = "Page Not Found";

export const isUserLoggedIn = async (
  to: RouteLocationNormalized,
): Promise<boolean> => {
  const user: User | null = await authService.getUser();
  if (user === null) {
    authService.loginToUrlState(to.fullPath);
    return false;
  }
  if (user.expired) {
    authService.logout();
    return false;
  }
  return true;
};

export const isUserMMAdmin = async (to: RouteLocationNormalized) => {
  if (await isUserLoggedIn(to)) {
    const profile: UserProfileMM | null = await authService.getProfile();

    if (profile && !authService.isUserMMAdmin(profile)) {
      return {
        name: PAGE_NOT_FOUND,
      };
    }
  }
};

export const isUserSC = async (to: RouteLocationNormalized) => {
  if (await isUserLoggedIn(to)) {
    if (!(await authService.isUserOrgViewer())) {
      return {
        name: PAGE_NOT_FOUND,
      };
    }
  }
};

export const redirectLoggedInUser = async (
  to: RouteLocationNormalized,
): Promise<void> => {
  const userProfile: UserProfileMM | null = await authService.getProfile();
  if (userProfile) {
    const { next_url, organization_id } = to.query;
    const organizationId: string | undefined = organization_id?.toString();
    if (organizationId && organizationId !== userProfile.org) {
      authService.loginToOrganization(organizationId);
    } else {
      const redirectTo: string = next_url?.toString() || "/";
      if (!redirectTo.startsWith(userManager.settings.authority)) {
        await router.push(redirectTo.toString());
      }
    }
  }
};

export const redirectToPlatform = async () => {
  const userProfile: UserProfileMM | null = await authService.getProfile();
  const gettingStartedStore = useGettingStartedStore();
  const isRedirectToGettingStarted =
    !gettingStartedStore.isAllStepsCompleted &&
    (await authService.isUserOrgViewer());
  if (userProfile) {
    const urlParams: URLSearchParams = new URLSearchParams(
      window.location.search,
    );
    const organizationId: string | null = urlParams.get("organization_id");
    if (organizationId && organizationId !== userProfile.org) {
      authService.loginToOrganization(organizationId);
    } else if (isRedirectToGettingStarted) {
      return "/sc/getting-started";
    } else {
      return "/user/profile";
    }
  } else {
    authService.login();
  }
};

export const saveBrandingConfigToStore = () => {
  const sp = getSpBranding();
  if (sp) {
    const brandingConfigStore = useBrandingConfigStore();
    brandingConfigStore.setBrandingConfig(sp);
  }
};
