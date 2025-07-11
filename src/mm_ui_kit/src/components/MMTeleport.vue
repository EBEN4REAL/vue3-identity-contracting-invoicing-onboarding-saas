<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  to: {
    type: String,
    default: "",
  },
});

const isMounted = ref(false);

const teleportTo = computed(() => `[data-teleport="${props.to}"]`);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport v-if="isMounted" :to="teleportTo"><slot /></Teleport>
</template>

<style scoped></style>
