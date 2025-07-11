import { defineStore } from "pinia";
import { BrandingConfigType } from "~/auth/auth.types";

interface BrandingConfigStoreState {
  brandingConfig: BrandingConfigType | null;
}
export const useBrandingConfigStore = defineStore("brandingConfig", {
  state: (): BrandingConfigStoreState => ({
    brandingConfig: {},
  }),
  getters: {
    brandingConfigGetter(state): BrandingConfigType | null {
      return state.brandingConfig;
    },
  },
  actions: {
    setBrandingConfig(
      brandingConfigFromRouter: BrandingConfigType | null,
    ): void {
      this.brandingConfig = brandingConfigFromRouter;
    },
  },
  persist: true,
});
