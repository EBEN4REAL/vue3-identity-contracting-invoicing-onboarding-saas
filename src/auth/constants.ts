export const ERRORS_PASSWORD = {
  MISSING_OR_INVALID_EMAIL: "Missing or invalid email",
  MISSING_OR_INVALID_TOKEN: "Missing or invalid token",
  MISSING_OR_INVALID_PASSWORD: "Missing or invalid password",
  MISSING_OR_INVALID_CSRF_TOKEN: "The request has expired. Please try again.",
  PASSWORD_SAME_AS_PREVIOUS_PASSWORD:
    "Your password cannot be the same as your last passwords. Please try again!",
  PWNED_PASSWORD:
    "The password you are trying to use has been breached/stolen. Please use another one.",
  USER_LOCKED:
    "Your account is locked, please try again in {{soft_lock_duration:number}} minutes!",
};

export const ERRORS_SIGNUP = {
  EXISTING_USER_WITHOUT_PASSWORD:
    "Email is associated with an existing User with a social account",
  EXISTING_USER_DISABLED:
    "Email is associated with an existing User who is disabled",
  EXISTING_USER_LOCKED:
    "Email is associated with an existing User who is locked",
  UNDETERMINED_TARGET: "Unable to determine the target of this signup",
  UNDETERMINED_SOURCE: "Unable to determine the source of this signup",
  DUPLICATE_USER_OR_SIGNUP:
    "Your e-mail address is already associated with an account. Login now.",
  MISSING_OR_INVALID_EMAIL: "Missing or invalid email",
  MISSING_OR_INVALID_TOKEN: "Missing or invalid token",
  MISSING_OR_INVALID_PASSWORD: "Missing or invalid password",
  MISSING_OR_INVALID_CSRF_TOKEN: "The request has expired. Please try again.",
  INVALID_TOTP: "Missing or invalid verification code",
  USED_TOTP: "Already used verification code",
  FEATURE_DISABLED: "This feature is disabled",
  INVALID_WEBAUTHN: "Missing or invalid webAuthn credentials",
  MISSING_OR_INVALID_EMAIL_OTP: "Missing or invalid email OTP",
  MISMATCH_INVITED_AND_AUTHENTICATED_USER:
    "Mismatch between the invited and authenticated user",
  MISSING_OR_INVALID_MFA_METHOD: "Missing or invalid MFA method",
  PWNED_PASSWORD:
    "The password you are trying to use has been breached/stolen. Please use another one.",
  SignupRequired: "You need to signup before",
  external_access_denied: "Access denied by user",
};

export const ERRORS_LOGIN = {
  LOGIN_BAD_REQUEST: "Unable to determine the source of this login",
  LOGIN_SESSION_EXPIRED: "The request has expired. Please try again.",
  LOGIN_USER_WITHOUT_PASSWORD:
    "You have not setup a password for this account, please login using a different method.",
  LOGIN_UNDETERMINED_TARGET: "Unable to determine the target of this login",
  LOGIN_UNDETERMINED_SOURCE: "Unable to determine the source of this login",
  LOGIN_MISSING_OR_INVALID_CSRF_TOKEN:
    "The request has expired. Please try again.",
  LOGIN_INVALID_USERNAME_PASSWORD: "The password you provided is invalid.",
  LOGIN_INVALID_USERNAME:
    "Your e-mail address is not associated with an account. Sign-up now.",
  LOGIN_USER_LOCKED:
    "Your account is locked, please try again in {{soft_lock_duration:number}} minutes!",
  LOGIN_USER_DISABLED: "User is disabled",
  LOGIN_INVALID_TOTP: "Missing or Invalid verification code",
  LOGIN_USED_TOTP: "Already used verification code",
  LOGIN_INVALID_BACKUP_CODE: "Missing or invalid backup code",
  LOGIN_USED_BACKUP_CODE: "Used backup code",
  LOGIN_INVALID_ORGANIZATION: "Invalid organization",
  LOGIN_MISSING_SSO: "Username is not configured for SSO",
  LOGIN_IS_LOCKED_FOR_X_MINUTES: "Your account is blocked for 30 minutes",
  LOGIN_INVALID_PASSWORD_ACCOUNT_WILL_BE_LOCKED:
    "The password you provided is invalid. Your account will be blocked after the next incorrect login attempt",
  LOGIN_INVALID_USERNAME_PASSWORD_ACCOUNT_WILL_BE_LOCKED:
    "The password you provided is invalid. Your account will be blocked after the next incorrect login attempt",
  LOGIN_INVALID_TOTP_ACCOUNT_WILL_BE_LOCKED:
    "Missing or invalid verification code. Your account will be blocked after the next incorrect login attempt",
  LOGIN_INVALID_TOTP_IS_LOCKED_FOR_X_MINUTES:
    "Your account is blocked for 30 minutes",
  LOGIN_USED_TOTP_ACCOUNT_WILL_BE_LOCKED:
    "Already used verification code. Your account will be blocked after the next incorrect login attempt",
  LOGIN_INVALID_BACKUP_CODE_ACCOUNT_WILL_BE_LOCKED:
    "Missing or invalid backup code. Your account will be blocked after the next incorrect login attempt",
  LOGIN_USED_BACKUP_CODE_ACCOUNT_WILL_BE_LOCKED:
    "Used backup Code. your account will be blocked after the next incorrect login attempt",
  LOGIN_INVALID_WEBAUTHN_IS_LOCKED_FOR_X_MINUTES:
    "Your account is blocked for 30 minutes",
  LOGIN_INVALID_WEBAUTHN_ACCOUNT_WILL_BE_LOCKED:
    "Missing or invalid webAuthn credentials. your account will be blocked after the next incorrect login attempt",
  LOGIN_FEATURE_DISABLED: "Login feature is disabled",
  LOGIN_MAGIC_LINK_DISABLED: "Magic link is disabled for your account",
  LOGIN_INVALID_WEBAUTHN: "Missing or invalid webAuthn credentials",
  LOGIN_MISSING_OR_INVALID_TOKEN: "Missing or invalid token",
  LOGIN_MISSING_OR_INVALID_TOKEN_ACCOUNT_WILL_BE_LOCKED:
    "Missing or Invalid Token. Your account will be blocked after the next incorrect login attempt",
  LOGIN_FEATURE_DISABLED_ACCOUNT_WILL_BE_LOCKED:
    "This feature is disabled. Your account will be blocked after the next incorrect login attempt",
  LOGIN_MAGIC_LINK_DISABLED_ACCOUNT_WILL_BE_LOCKED:
    "Magic link is disabled for your account. Your account will be blocked after the next incorrect login attempt",
  LOGIN_INVALID_EMAIL_OTP: "Missing or invalid verification code",
};
