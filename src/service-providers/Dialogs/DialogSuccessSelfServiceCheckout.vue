<script setup lang="ts">
import { onMounted } from "vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  orgName: {
    type: String,
    default: "",
  },
  orgId: {
    type: String,
    default: "",
    required: true,
  },
});

const emit = defineEmits(["close", "submit"]);

const onContinue = async () => {
  emit("submit");
};

onMounted(() => {
  setTimeout(() => {
    onContinue();
  }, 5000);
});
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    icon="rocket-launch"
    title="You're done!"
    :subtitle="`You have onboarded successfully to ${orgName}, you will be redirected in 5 seconds.`"
    @close="emit('close')"
  >
    <template #footer>
      <m-m-button variant="outlined" @click="onContinue"> Continue </m-m-button>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>
