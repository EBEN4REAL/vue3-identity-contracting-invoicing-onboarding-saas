<script setup lang="ts">
import { computed } from "vue";

const message = computed(() => {
  return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500";
});

const messageLength = computed(() => {
  return message.value.length > 97;
});
</script>

<template>
  <div class="mm-flex mm-flex-column mm-flex-gap-4 pricing-card">
    <div
      class="pricing-card-container mm-flex mm-flex-gap-10 mm-flex-justify-center"
    >
      <m-m-pricing-card
        product-name="Starter"
        pricing-type="free for 3 months"
        button-text="Get Started"
      >
        <template #princing-card-message>
          <div ref="message">
            <m-m-tooltip v-if="messageLength">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500</m-m-tooltip
            >
            {{ message }}
          </div>
        </template>
        <template #included-products>
          <div class="mm-page-subtitle--h2 font-weight-700 mm-mb-6">
            What's Included
          </div>
          <ul class="pricing-card-list mm-page-subtitle--h2">
            <li>Marketing feature 1</li>
            <li>Marketing feature 2</li>
            <li>Marketing feature 3</li>
          </ul>
        </template>
      </m-m-pricing-card>
      <m-m-pricing-card
        product-name="Professional"
        price="20"
        pricing-type="flat-free"
        button-text="Get Started"
      >
        <template #princing-card-message>
          <div ref="message">For small companies who are gaining momentum.</div>
        </template>
      </m-m-pricing-card>
      <m-m-pricing-card
        product-name="Scale"
        price="20"
        pricing-type="once-off"
        button-text="Get Started"
      >
        <template #included-products>
          <div class="mm-page-subtitle--h2 font-weight-700 mm-mb-6">
            What's Included
          </div>
          <ul class="pricing-card-list mm-page-subtitle--h2">
            <li>Marketing feature 1</li>
            <li>Marketing feature 2</li>
            <li>Marketing feature 3</li>
          </ul>
        </template>
      </m-m-pricing-card>
    </div>
  </div>
</template>

<style lang="scss">
.pricing-card {
  &-list {
    list-style: disc;
    margin-left: 16px;
    color: #6d7480;

    li:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &-container {
    flex-wrap: wrap;
  }

  .max-items {
    .mm-dialog-body-container {
      max-height: 50vh;
      overflow-y: scroll;
    }
  }
}

/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .pricing-card-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
