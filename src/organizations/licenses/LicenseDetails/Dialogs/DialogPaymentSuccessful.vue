<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isUserBased: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    :title="`${isUserBased ? 'Card validation was successful' : 'Payment successful'}`"
    :subtitle="`Your ${isUserBased ? 'card validation' : 'payment'} was successful and the subscription is ready to be used`"
    icon="payment"
    icon-size="40px"
    cy="dialog-payment-successful"
    @close="emit('close')"
  >
    <template #footer>
      <div class="mm-flex mm-justify-flex-end mm-flex-gap-6">
        <m-m-button
          cy="button-payment-successful"
          variant="outlined-light"
          @click="emit('close')"
        >
          Okay
        </m-m-button>
      </div>
    </template>
  </m-m-dialog>
</template>

<style scoped lang="scss"></style>
