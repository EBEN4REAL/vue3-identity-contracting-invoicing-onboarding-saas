<script setup lang="ts">
import { computed, ComputedRef, ref, Ref } from "vue";

const props = defineProps({
  url: {
    type: String,
    default: null,
  },
  initials: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: "40px",
  },
  initialsFontSize: {
    type: String,
    default: "18px",
  },
});

const isImgReady: Ref<boolean> = ref(false);
const isImgLoadedSuccessfully: Ref<boolean> = ref(false);

const onImageErrorLoad = () => {
  isImgReady.value = true;
};

const onImageSuccessLoad = () => {
  isImgReady.value = true;
  isImgLoadedSuccessfully.value = true;
};

const isImgReadyAndLoadedSuccessfully: ComputedRef<boolean> = computed(
  () => Boolean(props.url) && isImgReady.value && isImgLoadedSuccessfully.value,
);

const isImgReadyAndLoadedNotSuccessfully: ComputedRef<boolean> = computed(
  () =>
    Boolean(props.url) && isImgReady.value && !isImgLoadedSuccessfully.value,
);

const isAvatarLoading: ComputedRef<boolean> = computed(
  () => Boolean(props.url) && !isImgReady.value,
);
</script>

<template>
  <div class="mm-avatar">
    <img
      v-show="isImgReadyAndLoadedSuccessfully"
      :src="url"
      alt="Avatar"
      loading="lazy"
      @error="onImageErrorLoad"
      @load="onImageSuccessLoad"
    />
    <div v-if="isImgReadyAndLoadedNotSuccessfully || !url">
      <m-m-icon
        v-if="initials"
        :icon="`initials-${initials}`"
        :initials-font-size="initialsFontSize"
      />
      <m-m-icon v-else icon="user-circle" />
    </div>
    <m-m-spinner v-else-if="isAvatarLoading" />
  </div>
</template>

<style scoped lang="scss">
.mm-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(size);
  height: v-bind(size);
  overflow: hidden;
  border-radius: 50%;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  user-select: none;
  font-size: 14px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
