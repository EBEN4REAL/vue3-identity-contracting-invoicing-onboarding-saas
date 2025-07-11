<script setup lang="ts">
import { ref, Ref, onMounted, ComputedRef, computed, reactive } from "vue";
import { useRoute } from "vue-router";
import {
  Auth,
  LoginOrganization,
  TypeSelectOrganizationForm,
  TypeSelectOrganizationFormRules,
  TypeValidatorOrganizationSelect,
} from "../auth.types";
import config from "~/mm.config.json";
import ClientService from "~/common/services/client.service";
import { AxiosResponse } from "axios";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { ERRORS_LOGIN } from "../constants";
import { getUserEmail } from "~/auth/cookies";

const route = useRoute();

const loginOrganizations: Ref<LoginOrganization[]> = ref([]);

const nextUrl = route.query.next_url;
const stage = route.query.stage?.toString() || Auth.Email;
const csrfToken = route.query.csrf_token;
const loginOrganizationUrl = `${config.idp.url}/login-organization?next_url=${encodeURIComponent(`${nextUrl}`)}&csrf_token=${csrfToken}`;
const backTo = `/login?stage=${Auth.Email}&next_url=${encodeURIComponent(`${nextUrl}`)}&csrf_token=${csrfToken}`;
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);
const username = getUserEmail();

const errorDescription = route.query.error
  ? ERRORS_LOGIN[route.query.error.toString() as keyof typeof ERRORS_LOGIN]
  : "Something went wrong. Please try again.";

const form: TypeSelectOrganizationForm = reactive({
  selectedOrganizationId: "",
});

const formRules: TypeSelectOrganizationFormRules = {
  selectedOrganizationId: {
    required: helpers.withMessage("Organization is required", required),
  },
};

const v$: TypeValidatorOrganizationSelect = useVuelidate(formRules, form);

const fetchLoginOrganizations = async () => {
  try {
    const client = new ClientService(`${config.idp.url}`, true);
    const response: AxiosResponse = await client.get(
      `/login/organizations?username=${encodeURIComponent(username)}`,
    );
    loginOrganizations.value = response.data;
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching login organizations",
      status: "error",
    });
  }
};
const brandingConfigStore = useBrandingConfigStore();
const logoSrc: ComputedRef = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  if (stage === Auth.OrganizationSelection) {
    await fetchLoginOrganizations();
  }
});
</script>

<template>
  <div class="w-100">
    <div
      v-if="logoSrc"
      class="mm-mb-15 mm-mx-auto mm-flex mm-flex-justify-center mm-flex-align-center"
    >
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <div
      v-sanitize-html="$t('select_organization.title')"
      data-cy="select-organization-header"
      class="mm-auth-view-content-title mm-mb-6"
    ></div>
    <div
      v-sanitize-html="$t('select_organization.subtitle')"
      class="mm-auth-view-content-subtitle mm-mb-16"
    ></div>
    <m-m-alert
      v-if="isAlertVisible"
      :status="AlertTypes.Error"
      cy="login-form-alert"
      class="mm-mb-12"
      @close="onAlertClose"
    >
      {{ errorDescription }}
    </m-m-alert>
    <form
      v-mm-focus-first
      data-cy="login-select-organization-form"
      :action="loginOrganizationUrl"
      method="post"
    >
      <m-m-select
        v-model="form.selectedOrganizationId"
        :items="loginOrganizations"
        item-title="name"
        item-value="id"
        label="Organization"
        data-cy="select-organization"
        class="mm-mb-8"
        placeholder="Select organization"
        max-options-width="100%"
      >
        <template #option="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </m-m-select>

      <input type="hidden" name="username" :value="username" />
      <input type="hidden" name="csrf_token" :value="csrfToken" />
      <input
        type="hidden"
        name="organization_id"
        :value="form.selectedOrganizationId"
      />

      <m-m-button
        cy="continue"
        :is-disabled="v$.$invalid"
        variant="elevated"
        type="submit"
        :is-full-width="true"
        class="mm-auth-view-button-submit mm-mb-8"
      >
        Continue
      </m-m-button>
    </form>
    <div>
      <div
        class="mm-auth-view-options mm-auth-view-options-item-center mm-mt-16"
      >
        <m-m-link prepend-icon="arrow-left" :href="backTo" data-cy="back-to">
          <m-m-icon icon="arrow-left" class="mm-mr-4" />
          <span class="font-weight-600">Back to log in</span>
        </m-m-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-auth-view-button-submit {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
</style>
