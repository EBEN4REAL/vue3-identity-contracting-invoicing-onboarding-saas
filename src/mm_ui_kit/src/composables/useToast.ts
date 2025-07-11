import { ref, nextTick, Ref } from "vue";
import { TypeToast, TypeToastStatuses } from "../types/toast.types";

export const isOpened: Ref<boolean> = ref(false);
export const text: Ref<string> = ref("");
export const status: Ref<TypeToastStatuses> = ref(TypeToastStatuses.Info);
export const duration: Ref<number> = ref(3000);
let hideTimer: number | null = null;

export function showToast(toast: TypeToast) {
  clearToast();
  text.value = toast.text;
  status.value = toast.status || TypeToastStatuses.Info;
  duration.value = toast.duration ?? 3000;

  nextTick(() => {
    isOpened.value = true;
    hideTimer = window.setTimeout(() => {
      isOpened.value = false;
    }, duration.value);
  });
}

export function clearToast() {
  isOpened.value = false;
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}
