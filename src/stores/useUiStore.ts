import { defineStore } from "pinia";
import { authService } from "~/auth/auth.service";

type TypeUserRole = {
  isSCViewer: boolean;
  isMMAdmin: boolean;
  isSCEditor: boolean;
};

type TypeUiStore = {
  isScrimmed: boolean;
  userRole: TypeUserRole;
};

export const useUiStore = defineStore("uiStore", {
  state: (): TypeUiStore => ({
    isScrimmed: false,
    userRole: {
      isSCViewer: false,
      isMMAdmin: false,
      isSCEditor: false,
    },
  }),
  getters: {
    isSCViewerOnly: (state): boolean =>
      state.userRole.isSCViewer &&
      !state.userRole.isSCEditor &&
      !state.userRole.isMMAdmin,
  },
  actions: {
    async setUserPermissions() {
      const profile = await authService.getProfile();
      if (!profile) return;
      const [isSCViewer, isSCEditor] = await Promise.all([
        authService.isUserOrgViewer(),
        authService.isUserOrgEditor(),
      ]);
      const isMMAdmin = authService.isUserMMAdmin(profile);
      this.userRole = {
        isMMAdmin,
        isSCViewer,
        isSCEditor,
      };
    },
  },
});
