import { computed, onMounted } from "vue";
import { useUnpublishedConfigChangesStore } from "~/stores/unpublishedConfig/unpublishedConfig";

export function useConfigBanner() {
  const unpublishedChangesStore = useUnpublishedConfigChangesStore();

  const isConfigBannerVisible = computed(
    () => unpublishedChangesStore.hasUnpublishedChanges,
  );

  onMounted(async () => {
    await unpublishedChangesStore.getUnpublishedConfigChanges();
  });

  return {
    isConfigBannerVisible,
  };
}
