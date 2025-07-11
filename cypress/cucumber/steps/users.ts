import { Given, Then } from "cypress-cucumber-preprocessor/steps";
import users, { User } from "../fixtures/users";
import config from "../../../src/mm.config.json";
import JWT from "expo-jwt";
import { UserProfileMM } from "../../../src/auth/auth.types";

const SESSION_ID: string = `oidc.user:${config.idp.url}:${config.idp.clientId}`;

export const getUserIdTokenPayload = (userId: string): UserProfileMM => {
  const user: User = users[userId];
  const iat: number = Math.round(new Date().getTime() / 1000);
  const exp: number = iat + 300;
  return {
    aao: user.aao || "None",
    iss: config.idp.url,
    sub: user.id,
    exp,
    aud: config.idp.clientId,
    iat,
    sp: user.service_provider_id,
    org: user.organization?.id,
    sp_org: user.service_provider_id,
    org_name: user.organization?.name,
    groups: user.groups,
    roles: user.roles,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    given_name: user.first_name,
    family_name: user.last_name,
    onboarding_completed: user.onboarding_completed,
  };
};

Given("the User {string} is Signed In", (userId: string): void => {
  const idTokenPayload: UserProfileMM = getUserIdTokenPayload(userId);
  const idToken: string = JWT.encode(idTokenPayload, "secret");
  const session = {
    id_token: idToken,
    session_state: null,
    access_token: "X",
    refresh_token: "X",
    token_type: "Bearer",
    scope: "openid email profile",
    profile: idTokenPayload,
    expires_at: idTokenPayload.exp,
    userState: null,
  };
  window.localStorage.setItem(SESSION_ID, JSON.stringify(session));
  if (idTokenPayload.org) {
    cy.intercept("POST", `${config.idp.url}/oauth2/token`, {
      statusCode: 200,
      body: {
        expires_in: 1800,
        refresh_token_expires_in: 86400,
        scope: "profile email openid",
        token_type: "Bearer",
        id_token: idToken,
        access_token: idToken,
      },
    });
  }
});

Given("no User is Signed In", (): void => {
  window.localStorage.clear();
});

Then("no User should be Signed In", (): void => {
  console.assert(window.localStorage.getItem(SESSION_ID) == null);
});
