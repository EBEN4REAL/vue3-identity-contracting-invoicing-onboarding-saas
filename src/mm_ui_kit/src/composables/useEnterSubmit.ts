import { Ref, onMounted, onUnmounted } from "vue";
import { Validation } from "@vuelidate/core";

export function useEnterSubmit(
  v$: Ref<Validation>,
  submitFn: () => Promise<void> | void,
  key: string = "Enter",
) {
  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === key && !v$.value.$invalid) {
      e.preventDefault();
      await submitFn();
    }
  };

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
}
