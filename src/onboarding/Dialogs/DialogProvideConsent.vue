<script setup lang="ts">
import { computed, ComputedRef, PropType, Ref, ref } from "vue";
import {
  Attributes,
  AttributesConsentUpdate,
} from "~/onboarding/onboarding.types";
import { onboardingService } from "~/onboarding/onboarding.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { useRoute } from "vue-router";

type TypeProvideConsentsTo = "users" | "organizations";

const props = defineProps({
  isOpen: {
    default: false,
    type: Boolean,
  },
  id: {
    type: String,
    default: "",
  },
  attributes: {
    type: Array as PropType<Attributes>,
    required: false,
    default: null,
  },
  provideConsentsTo: {
    type: String as PropType<TypeProvideConsentsTo>,
    default: "users",
  },
});

const emit = defineEmits(["close", "submit"]);

const route = useRoute();

const isButtonSubmitDisabled: Ref<boolean> = ref(false);
const isButtonSubmitLoading: Ref<boolean> = ref(false);

const form = ref(
  props.attributes?.reduce((acc, attribute) => {
    if (attribute.value) {
      acc.push({
        id: attribute.id,
        name: attribute.name,
        granted: true,
        required: attribute.consent.required,
      });
    }
    return acc;
  }, []),
);

const serviceProviderName: ComputedRef<string> = computed(() =>
  route.query.sp ? JSON.parse(atob(`${route.query.sp}`)).name : "",
);

const onSubmitForm = async () => {
  try {
    isButtonSubmitDisabled.value = true;
    isButtonSubmitLoading.value = true;
    const formForAPI: AttributesConsentUpdate = {
      attributes: form.value.map((item) => ({
        id: item.id,
        granted: item.granted,
      })),
    };
    if (props.provideConsentsTo === "organizations") {
      await onboardingService.patchOrganizationConsents(props.id, formForAPI);
    } else await onboardingService.patchUserMeConsents(formForAPI);
    emit("submit");
  } catch (error) {
    if (error?.response.status === 400) {
      eventBus.$emit("onShowToast", {
        text: "Required Attributes NOT Granted or Missing Attributes",
        status: "error",
      });
    } else {
      eventBus.$emit("onShowToast", {
        text: "Error in providing consents",
        status: "error",
      });
    }
  } finally {
    isButtonSubmitDisabled.value = false;
    isButtonSubmitLoading.value = false;
  }
};
</script>

<template>
  <m-m-dialog
    :is-open="isOpen"
    title="Provide consent"
    :subtitle="`Following are the attributes that will be shared with ${serviceProviderName}`"
    icon="shield-check-outline"
    @close="emit('close')"
  >
    <div class="mm-page-form-label mm-mb-5">Attributes</div>
    <m-m-checkbox
      v-for="attribute in form"
      :key="attribute.id"
      v-model="attribute.granted"
      :name="attribute.name"
      :disabled="attribute.required"
      class="mm-mb-5"
    >
      {{ attribute.name }}
    </m-m-checkbox>
    <template #footer>
      <m-m-button variant="outlined" @click="emit('close')">
        Dismiss
      </m-m-button>
      <m-m-button
        :is-disabled="isButtonSubmitDisabled"
        :loading="isButtonSubmitLoading"
        variant="elevated"
        data-cy="button-submit"
        @click="onSubmitForm"
      >
        Confirm & Proceed
      </m-m-button>
    </template>
  </m-m-dialog>
</template>
