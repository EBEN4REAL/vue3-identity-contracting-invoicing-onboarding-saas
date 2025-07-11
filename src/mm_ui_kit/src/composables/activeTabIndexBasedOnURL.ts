import { ref, Ref, onMounted } from "vue";

export default function useActiveTab(defaultValue: string) {
  const activeTab: Ref<string> = ref(defaultValue);

  onMounted(() => {
    const { hash } = window.location;
    const isHashValid = hash.split("#")[1];
    activeTab.value = isHashValid
      ? isHashValid.replaceAll("-", " ")
      : defaultValue;
  });

  return activeTab;
}
