import { defineStore } from "pinia";

interface GettingStartedStore {
  allStepsCompleted: boolean | null;
}

export const useGettingStartedStore = defineStore("GettingStarted", {
  state: (): GettingStartedStore => ({
    allStepsCompleted: null,
  }),
  getters: {
    isAllStepsCompleted(state): boolean | null {
      return state.allStepsCompleted;
    },
  },
  actions: {
    setAllStepsCompletedStatus(allStepsCompleted: boolean | null): void {
      this.allStepsCompleted = allStepsCompleted;
    },
  },
  persist: true,
});
