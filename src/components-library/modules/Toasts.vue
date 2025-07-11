<script setup lang="ts">
import { TypeToastStatuses } from "~/mm_ui_kit/src/types/toast.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const onShowToast = (status: TypeToastStatuses) => {
  eventBus.$emit("onShowToast", {
    text: "Toast text",
    status,
  });
};
</script>

<template>
  <div class="mm-flex mm-flex-gap-6">
    <m-m-button variant="outlined" @click="onShowToast(TypeToastStatuses.Info)">
      Show info toast
    </m-m-button>
    <m-m-button
      variant="outlined"
      @click="onShowToast(TypeToastStatuses.Warning)"
    >
      Show warning toast
    </m-m-button>
    <m-m-button
      variant="outlined"
      @click="onShowToast(TypeToastStatuses.Error)"
    >
      Show error toast
    </m-m-button>
  </div>
</template>
