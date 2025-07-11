import { BrandingConfigType, CookieType, EmailCookie } from "~/auth/auth.types";
import { getCookie } from "typescript-cookie";
import { jwtDecode } from "jwt-decode";

export const getUserEmail = (): string => {
  try {
    const cookie: string | undefined = getCookie(CookieType.USER_EMAIL);
    if (!cookie) {
      return "";
    }
    const userEmailCookie: EmailCookie = jwtDecode(cookie);
    return userEmailCookie.email;
  } catch (error) {
    return "";
  }
};

export const getSpBranding = (): BrandingConfigType | null => {
  try {
    const cookie: string | undefined = getCookie(CookieType.SP_BRANDING);
    if (!cookie) {
      return null;
    }
    return jwtDecode(cookie);
  } catch (error) {
    return null;
  }
};
