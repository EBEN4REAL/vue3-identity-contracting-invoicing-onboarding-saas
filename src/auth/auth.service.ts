import {
  SigninRedirectArgs,
  SignoutRedirectArgs,
  User,
  UserManager,
  WebStorageStateStore,
} from "oidc-client-ts";
import { reactive } from "vue";
import config from "../mm.config.json";
import { AuthStorageKeys, ScreenHint, UserProfileMM } from "./auth.types";

const settings = {
  // Where the tokens will be stored
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // URL to the authentication server (including realm)
  authority: config.idp.url,
  // The name of the client the Authorization Server
  client_id: config.idp.clientId,
  // Where to redirect the user to after successful authentication
  redirect_uri: `${config.app.url}/authorized`,
  // Where to redirect the user to after logging the user out
  post_logout_redirect_uri: `${config.app.url}/login`,
  // Indicate that the authorization code flow should be used
  response_type: "code",
  // "openid" tells the server that this client uses oidc for authentication
  scope: "openid email profile",
  // Enable automatic (silent) renewal of the access token
  automaticSilentRenew: true,
  // Age of state entries in storage for authorize requests that are considered abandoned and thus can be cleaned up
  staleStateAgeInSeconds: 3600,
};

export const userManager: UserManager = new UserManager(settings);

class AuthService {
  state: {
    ownOrg: string | null;
  };

  constructor() {
    this.state = reactive({
      ownOrg: null,
    });
    this.loadState();
  }

  saveState(): void {
    localStorage.setItem(
      AuthStorageKeys.AUTH_STATE,
      JSON.stringify(this.state),
    );
  }

  loadState(): void {
    const savedState: string | null = localStorage.getItem(
      AuthStorageKeys.AUTH_STATE,
    );
    if (savedState) {
      this.state = reactive(JSON.parse(savedState));
    }
  }

  setOwnOrg(org: string | null): void {
    this.state.ownOrg = org;
    this.saveState();
  }

  login(args?: SigninRedirectArgs): void {
    userManager.signinRedirect(args).then();
  }

  loginWithParams(
    urlState?: string,
    username?: string,
    organizationId?: string,
    invitationToken?: string,
    asOrganizationId?: string,
  ): void {
    const args: SigninRedirectArgs = {};
    const extraQueryParams: Record<string, string | number | boolean> = {};
    if (urlState && urlState !== "") {
      args.url_state = urlState;
    }
    if (username && username !== "") {
      extraQueryParams.username = username;
    }
    if (organizationId && organizationId !== "") {
      this.setOwnOrg(organizationId);
      extraQueryParams.organization_id = organizationId;
    }
    if (invitationToken && invitationToken !== "") {
      extraQueryParams.invitation_token = invitationToken;
    }
    if (asOrganizationId && asOrganizationId !== "") {
      extraQueryParams.as_organization_id = asOrganizationId;
    }
    if (Object.keys(extraQueryParams).length > 0) {
      args.extraQueryParams = extraQueryParams;
    }
    this.login(args);
  }

  loginToUrlState(urlState: string): void {
    this.loginWithParams(urlState, undefined, undefined, undefined, undefined);
  }

  loginToOrganization(organizationId: string): void {
    this.loginWithParams(
      undefined,
      undefined,
      organizationId,
      undefined,
      undefined,
    );
  }

  loginToOrganizationSilent(organizationId: string): void {
    userManager
      .signinSilent({
        extraQueryParams: {
          organization_id: organizationId,
        },
      })
      .then();
  }

  loginAsOrganization(organizationId: string): void {
    this.loginWithParams(
      undefined,
      undefined,
      undefined,
      undefined,
      organizationId,
    );
  }

  signup(): void {
    this.login({
      extraQueryParams: {
        screen_hint: ScreenHint.SIGNUP,
      },
    });
  }

  removeUser(): Promise<void> {
    return userManager.removeUser();
  }

  clearState(): void {
    userManager.stopSilentRenew();
    localStorage.removeItem(AuthStorageKeys.AUTH_STATE);
    localStorage.removeItem(AuthStorageKeys.ONBOARDING);
    localStorage.removeItem(AuthStorageKeys.ACCESS_DENIED);
    localStorage.removeItem(AuthStorageKeys.PLAN_PAGE);
  }

  logout(args?: SignoutRedirectArgs): void {
    this.clearState();
    userManager.signoutRedirect(args).then();
  }

  logoutWithNextUrl(nextUrl: string): void {
    this.logout({
      extraQueryParams: {
        next_url: nextUrl,
      },
    });
  }

  logoutWithoutRedirect(): void {
    this.clearState();
    userManager.signoutSilent().then();
  }

  /**
   * Handles the redirect from the OAuth server after a user logged in.
   */
  handleLoginRedirect(): Promise<User> {
    return userManager.signinRedirectCallback();
  }

  /**
   * Returns the OIDC User which is Logged In
   */
  getUser(): Promise<User | null> {
    return userManager.getUser();
  }

  /**
   * Get the profile data for the currently authenticated user.
   *
   * Returns an empty object if no user is logged in.
   */
  getProfile(): Promise<UserProfileMM | null> {
    return new Promise((resolve, reject): void => {
      userManager
        .getUser()
        .then((user: User | null): void => {
          if (user === null || user.expired) {
            resolve(null);
          } else {
            if (!this.state.ownOrg) {
              this.setOwnOrg(user.profile.org as string);
            }

            const formattedProfile: UserProfileMM = user.profile;
            // if aao value is not 'None', then set the org value to aao and add 'mm:admin' role
            if (formattedProfile.aao !== "None") {
              formattedProfile.own_org = this.state.ownOrg;
              formattedProfile.org = formattedProfile.aao as string;
              formattedProfile.roles = ["mm:admin"];
            }

            resolve(formattedProfile);
          }
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Get the access token.
   *
   * Can be used to make requests to the backend.
   */
  getAccessToken(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user: User | null): void => {
          if (user === null) {
            resolve(null);
          } else {
            resolve(user.access_token);
          }
        })
        .catch((error) => reject(error));
    });
  }

  isUserInOrgGroupRoles(
    profile: UserProfileMM,
    org: string,
    roles: string[],
  ): boolean {
    const groups: string[] = profile.groups || [];
    const groupRole: string | undefined = groups.find((group: string) =>
      roles.find((role: string) => group.startsWith(`${org}:${role}:`)),
    );
    return groupRole !== undefined || this.isUserMMAdmin(profile);
  }

  isUserSPRoles(roles: string[]): Promise<boolean> {
    return new Promise((resolve, reject): void => {
      this.getProfile()
        .then((profile: UserProfileMM | null): void => {
          if (!profile) {
            resolve(false);
          } else if (!profile.sp_org) {
            resolve(false);
          } else {
            resolve(this.isUserInOrgGroupRoles(profile, profile.sp_org, roles));
          }
        })
        .catch((error) => reject(error));
    });
  }

  isUserOrgRoles(roles: string[]): Promise<boolean> {
    return new Promise((resolve, reject): void => {
      this.getProfile()
        .then((profile: UserProfileMM | null): void => {
          if (!profile) {
            resolve(false);
          } else if (!profile.org) {
            resolve(false);
          } else {
            resolve(this.isUserInOrgGroupRoles(profile, profile.org, roles));
          }
        })
        .catch((error) => reject(error));
    });
  }

  isUserSPAdmin(): Promise<boolean> {
    return this.isUserSPRoles(["A"]);
  }

  isUserSPEditor(): Promise<boolean> {
    return this.isUserSPRoles(["A", "E"]);
  }

  isUserSPViewer(): Promise<boolean> {
    return this.isUserSPRoles(["A", "E", "V"]);
  }

  isUserOrgAdmin(): Promise<boolean> {
    return this.isUserOrgRoles(["A"]);
  }

  isUserOrgEditor(): Promise<boolean> {
    return this.isUserOrgRoles(["A", "E"]);
  }

  isUserOrgViewer(): Promise<boolean> {
    return this.isUserOrgRoles(["A", "E", "V"]);
  }

  isUserMMAdmin(userProfile: UserProfileMM): boolean {
    return (
      userProfile.roles !== undefined && userProfile.roles.includes("mm:admin")
    );
  }

  isUserMMSupport(userProfile: UserProfileMM): boolean {
    return userProfile.aao !== "None";
  }

  isUserOnboarded(userProfile: UserProfileMM): boolean {
    return userProfile.onboarding_completed === true;
  }

  isSPOrg(userProfile: UserProfileMM): boolean {
    return (
      userProfile.sp_org !== null && userProfile.sp_org === userProfile.org
    );
  }
}

/**
 * Create and expose an instance of the auth service.
 */
export const authService: AuthService = new AuthService();

/**
 * Event fired once a user logged in successfully or after an access token was refreshed successfully.
 */
userManager.events.addUserLoaded(() => userManager.startSilentRenew());

userManager.events.addSilentRenewError(() => authService.logout());
