import { Ref } from "vue";

export const showToast = (
  displayToast: Ref<boolean>,
  displayToastTimer: number | null,
) => {
  displayToast.value = true;

  if (displayToastTimer) {
    clearTimeout(displayToastTimer);
  }

  displayToastTimer = setTimeout(() => {
    displayToast.value = false;
  }, 2500);
};
