<script setup lang="ts">
import { ref, Ref, onMounted, computed, ComputedRef } from "vue";
import { organizationsService } from "~/organizations/organizations.service";
import { authService } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";
import { TableRequestParams } from "~/mm_ui_kit/src/types/table.types";
import LogoSVG from "~/assets/images/LandingLogo.svg";
import {
  OrganizationRead,
  PaginationSchema_OrganizationRead_,
} from "~/iam/iam.types";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

const isLoading: Ref<boolean> = ref(false);
const selectOrganizationModel: Ref<string | null> = ref<string | null>(null);
const loginOrganizations: Ref<PaginationSchema_OrganizationRead_ | null> =
  ref(null);
const userProfile: Ref<UserProfileMM | null> = ref(null);

const fetchOrganizations = async (params?: TableRequestParams) => {
  try {
    isLoading.value = true;
    loginOrganizations.value = await organizationsService.getOrganizations({
      ...params,
      sort: "name:desc",
    });
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching organizations",
      status: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const filteredOrganizations: ComputedRef<OrganizationRead[]> = computed(() => {
  return loginOrganizations?.value?.results.filter(
    (org) => org.id !== userProfile.value?.org,
  );
});

const loginAsOrganization = async () => {
  if (!selectOrganizationModel.value) {
    eventBus.$emit("onShowToast", {
      text: "Please select an organization",
      status: "error",
    });
    return;
  }

  try {
    await authService.loginAsOrganization(selectOrganizationModel.value);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Failed to login as organization",
      status: "error",
    });
  } finally {
  }
};

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  fetchOrganizations();
});
</script>

<template>
  <div class="auth-card">
    <div>
      <div class="support-login-logo-container">
        <LogoSVG class="support-login-logo" />
      </div>
      <div
        v-sanitize-html="$t('provide_support.title')"
        data-cy="select-organization-header"
        class="mm-auth-view-content-title mm-mb-6"
      ></div>
      <div
        v-sanitize-html="$t('provide_support.subtitle')"
        class="mm-auth-view-content-subtitle mm-mb-16"
      ></div>
      <form
        v-mm-focus-first
        data-cy="login-support-select-organization-form"
        @submit.prevent="loginAsOrganization"
      >
        <m-m-autocomplete
          v-model="selectOrganizationModel"
          :items="filteredOrganizations"
          :total-items="loginOrganizations?.total || 0"
          item-title="name"
          item-value="id"
          label="Organization"
          data-cy="select-support-organization"
          class="mm-mb-8"
          placeholder="Select organization"
          :loading="isLoading"
          @update-params="fetchOrganizations"
        >
          <template #option="{ item }">
            <span>{{ item.name }}</span>
          </template>
        </m-m-autocomplete>

        <m-m-button
          cy="continue"
          variant="elevated"
          type="submit"
          :is-full-width="true"
          class="mm-auth-view-button-submit mm-mb-8"
        >
          Continue
        </m-m-button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-card {
  padding-top: 56px;
  padding-bottom: 64px;
}
.support-login-logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 30px 0;

  .support-login-logo {
    max-width: 190px;
    max-height: 55px;
  }
}
</style>
