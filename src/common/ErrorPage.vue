<script setup lang="ts">
import { Ref, computed, ref } from "vue";
import { SVG_DIMENSIONS } from "../mm_ui_kit/src/helpers/utils";
import MMSquareSVG from "../assets/images/mm-square.svg";
import { useRoute } from "vue-router";
import { isValidUUID } from "~/mm_ui_kit/src/helpers/errorIDValidator";

const route = useRoute();
const svgWidth: Ref<string> = ref(SVG_DIMENSIONS.WIDTH);
const svgHeight: Ref<string> = ref(SVG_DIMENSIONS.HEIGHT);
const errorId = route.query.error_id?.toString();

const contactUsRedirect = () => {
  window.open("https://getveriam.com/contact", "_blank");
};
const scheduleCallRedirect = () => {
  window.open("https://getveriam.com/meet/support-call", "_blank");
};

const validErrorId = computed(() => {
  return errorId && isValidUUID(errorId) ? errorId : null;
});
</script>

<template>
  <div class="error-page">
    <PageNotFound
      error-type="Oops... looks like something went wrong on our end!"
      ><template #message>
        <div>
          If you could share a little about what you were doing when this
          happened, you'd be our hero!
        </div>
        <div class="mm-flex mm-flex-gap-6 mm-mt-14">
          <m-m-button
            data-cy="button-contact-us"
            variant="outlined"
            size="small"
            min-width="130px"
            @click="contactUsRedirect"
          >
            Contact us
          </m-m-button>
          <m-m-button
            data-cy="button-schedule-call"
            variant="outlined"
            size="small"
            @click="scheduleCallRedirect"
          >
            Schedule a call
          </m-m-button>
        </div>
        <div
          v-if="validErrorId"
          class="mm-mt-10 mm-page-title--h5"
          data-cy="reference"
        >
          Reference: {{ errorId }}
        </div>
      </template></PageNotFound
    >
  </div>

  <component
    :is="MMSquareSVG"
    :width="svgWidth"
    :height="svgHeight"
    data-cy="left-square-element"
    class="mm-auth-view-left-square-element"
  />
  <component
    :is="MMSquareSVG"
    :width="svgWidth"
    :height="svgHeight"
    data-cy="right-square-element"
    class="mm-auth-view-right-square-element"
  />
</template>

<style scoped lang="scss">
.error-page {
  :deep(.page-not-found-title) {
    font-size: 38px;
  }
}
</style>
