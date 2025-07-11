import { RouteLocationNormalized } from "vue-router";
import { BrandingConfigType } from "~/auth/auth.types";

export const applyBrandingConfigStyling = (route: RouteLocationNormalized) => {
  const sp = route.query.sp as string;
  let customSettings: Partial<BrandingConfigType> = {};

  if (sp) {
    try {
      customSettings = JSON.parse(
        atob(sp.replace(/-/g, "+").replace(/_/g, "/")),
      );
    } catch (error) {
      console.error("Failed to parse branding config:", error);
    }
  }

  const buttonBackgroundColor = `#${customSettings.button_background_color ?? "072E51"}`;

  const buttonTextColor = customSettings.button_text_color || "#ffffff";
  const borderStyling = `1px solid ${buttonBackgroundColor}`;
  document.documentElement.style.setProperty(
    "--branding-button-background-color",
    buttonBackgroundColor,
  );
  document.documentElement.style.setProperty(
    "--branding-button-text-color",
    buttonTextColor,
  );
  document.documentElement.style.setProperty(
    "--branding-border",
    borderStyling,
  );
};
