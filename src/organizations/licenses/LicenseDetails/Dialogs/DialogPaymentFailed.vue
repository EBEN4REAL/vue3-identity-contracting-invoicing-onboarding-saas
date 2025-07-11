<script setup lang="ts">
import router from "~/router/index.router";
import { useRoute } from "vue-router";
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  licenseId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);
const route = useRoute();
const goToCheckout = () => {
  router.push({
    name: "Checkout",
    params: {
      agreement_id: props.licenseId,
    },
    query: {
      entity_type: route.query.entity_type,
    },
  });
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Payment failed"
    subtitle="Something went wrong while trying to process your payment. Please try again."
    icon="warning"
    icon-color="warning"
    cy="dialog-payment-failed"
    @close="emit('close')"
  >
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button
          cy="button-payment-try-again"
          variant="outlined-light"
          @click="goToCheckout"
        >
          Try again
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>
