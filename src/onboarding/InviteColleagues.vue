<script setup lang="ts">
import { ref, Ref, reactive, computed, ComputedRef } from "vue";
import {
  TypeOnboardingInviteUsersForm,
  TypeOnboardingInviteUsersFormRules,
} from "./onboarding.types";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { helpers } from "@vuelidate/validators";
import { emailValidator } from "~/mm_ui_kit/src/helpers/emailValidator";
import useVuelidate from "@vuelidate/core";
import { onboardingService } from "./onboarding.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { showToast } from "~/mm_ui_kit/src/composables/useToast";

const props = defineProps({
  next_callable: { type: Function, required: true },
  organization_id: {
    type: String,
    required: true,
  },
});

const isButtonSubmitLoading: Ref<boolean> = ref(false);

const isButtonSubmitDisabled: ComputedRef<boolean> = computed(
  () =>
    isButtonSubmitLoading.value ||
    Boolean(form.emails.length && v$.value.emails.$invalid) ||
    !form.emails.length,
);

const brandingConfigStore = useBrandingConfigStore();

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const form = reactive<TypeOnboardingInviteUsersForm>({
  emails: [],
});

const formRules: TypeOnboardingInviteUsersFormRules = {
  emails: {
    emails: helpers.withMessage(
      "Check the format of email address",
      emailValidator,
    ),
  },
};

const v$ = useVuelidate(formRules, form);

const submit = async () => {
  const inviteUserEmails = {
    invited_emails: form.emails.length ? form.emails : null,
  };
  try {
    isButtonSubmitLoading.value = true;
    await onboardingService.inviteUsers(
      props.organization_id,
      inviteUserEmails,
    );
    showToast({
      text: "Invitations sent",
      status: "success",
      duration: 5000,
    });
    await props.next_callable();
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to invite colleagues",
      status: "error",
    });
  } finally {
    isButtonSubmitLoading.value = false;
  }
};

const next = async () => await props.next_callable();
</script>

<template>
  <div data-cy="login-with-sso-form">
    <div class="w-100">
      <m-m-teleport to="onboarding-title">
        <div v-if="logoSrc" class="mm-mx-auto mm-mb-15">
          <img :src="logoSrc" class="mm-auth-view-logo" />
        </div>
        <div v-sanitize-html="$t('onboarding.invite_colleagues.title')"></div>
      </m-m-teleport>
      <m-m-teleport to="onboarding-subtitle">
        <div
          v-sanitize-html="$t('onboarding.invite_colleagues.subtitle')"
        ></div>
      </m-m-teleport>
      <form v-mm-focus-first class="mm-mt-20">
        <m-m-tags-input
          v-model="form.emails"
          label="Add email addresses"
          placeholder="Add email addresses"
          class="mm-mb-16"
          type="email"
          :errors="v$.emails.$errors"
          @input="v$.emails.$touch"
        />
        <m-m-button
          cy="continue"
          variant="elevated"
          type="submit"
          :is-full-width="true"
          class="mm-auth-view-button-submit mm-mb-8"
          :is-disabled="isButtonSubmitDisabled"
          @click.prevent="submit"
        >
          Invite colleagues
        </m-m-button>
        <m-m-button
          cy="continue"
          variant="tertiary"
          type="submit"
          :is-full-width="true"
          class="mm-auth-view-button-submit mm-mb-8"
          @click.prevent="next"
        >
          Skip
        </m-m-button>
      </form>
    </div>
  </div>
</template>
