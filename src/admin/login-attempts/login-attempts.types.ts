export enum LoginSource {
  E = "EMAIL",
  G = "GOOGLE",
  M = "MICROSOFT",
  S = "SSO",
}

export enum LoginOutcome {
  S = "SUCCESS",
  F = "FAILURE",
  P = "PENDING",
  M = "PENDING_MFA",
  O = "ORGANIZATION_SELECTION",
  FM = "FAILURE_MFA",
  ML = "PENDING_MAGIC_LINK",
  SU = "SIGNUP",
}
