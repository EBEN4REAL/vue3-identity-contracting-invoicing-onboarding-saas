<script setup lang="ts">
import { onboardingService } from "~/onboarding/onboarding.service";
import UserDetails from "~/onboarding/UserDetails.vue";
import { computed, ComputedRef, onMounted, Ref, ref, watch } from "vue";
import { FlowSchema } from "~/onboarding/onboarding.types";
import CreateAccount from "~/onboarding/CreateAccount.vue";
import CreateOrganization from "~/onboarding/CreateOrganization.vue";
import JoinedOrganization from "~/onboarding/JoinedOrganization.vue";
import RequestOrganizationAccess from "~/onboarding/RequestOrganizationAccess.vue";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { clearIntervalAsync, setIntervalAsync } from "set-interval-async";
import { serviceProviderUsersService } from "~/service-providers/service-provider-users.service";
import { authService, userManager } from "~/auth/auth.service";
import { useRoute } from "vue-router";
import { OAuthManager } from "~/common/services/oauth.client.service";
import { iamClientService } from "~/iam/iam.client.service";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { AxiosError, isAxiosError } from "axios";
import ChoosePlan from "~/onboarding/ChoosePlan.vue";
import UpdateOrganization from "~/onboarding/UpdateOrganization.vue";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { AuthStorageKeys } from "~/auth/auth.types";
import InviteColleagues from "~/onboarding/InviteColleagues.vue";

const flow: Ref<FlowSchema | null> = ref(null);
const stageIndex: Ref<number> = ref(0);
const isUserOnboarded: Ref<boolean> = ref(false);
const onboardingCompleted: Ref<boolean> = ref(false);
const userOnboardingCompleted: Ref<boolean> = ref(false);
const isError: Ref<boolean> = ref(false);
const errorText: Ref<string> = ref("");
const brandingConfigStore = useBrandingConfigStore();
const route = useRoute();
const syncCode: string | undefined = route.query.sync_code?.toString();

const isFlowLoading: ComputedRef<boolean> = computed(
  () => onboardingCompleted.value || userOnboardingCompleted.value,
);

const getFlowContinued = async () => {
  onboardingService.state.stageActive =
    flow.value?.stages?.find((stage) => stage.active) || null;
  if (onboardingService.state.stageActive !== null) {
    stageIndex.value = onboardingService.state.stageActive.index;
  }
};

const getFlow = async () => {
  return await onboardingService.getFlow({
    sync_code: syncCode,
  });
};

const getFlowSafe = async () => {
  try {
    flow.value = await getFlow();
    await getFlowContinued();
  } catch (error: unknown) {
    if (isAxiosError(error) && (error as AxiosError).response?.status === 404) {
      return;
    }
    throw error;
  }
};

const getFlowError = () => {
  isError.value = true;
  eventBus.$emit("onShowToast", {
    text: "Failed to load onboarding flow",
    status: "error",
  });
};

const handleOnboardingCompletedOnLoad = async () => {
  if (flow.value?.completed) {
    onboardingCompleted.value = flow.value.completed;
    await waitForUserOnboardingCompleted();
  }
};

const onLoad = async () => {
  try {
    await getFlowSafe();
    if (flow.value) {
      await handleOnboardingCompletedOnLoad();
      return;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const status = (error as AxiosError).response?.status;
      if (status == 403 && onboardingService.oAuthManager) {
        authService.logoutWithoutRedirect();
        onboardingService.oAuthManager.authorize();
        return;
      }
    }
    getFlowError();
    return;
  }

  const getFlowUntilUserIsSynced = setIntervalAsync(async () => {
    try {
      await getFlowSafe();
      if (flow.value) {
        await handleOnboardingCompletedOnLoad();
        await clearIntervalAsync(getFlowUntilUserIsSynced);
      }
    } catch (error) {
      getFlowError();
      await clearIntervalAsync(getFlowUntilUserIsSynced);
    }
  }, 250);
};

const waitForUserOnboardingCompleted = async () => {
  const getFlowTimeout = setTimeout(getFlow, 5000);
  const getUserUntilOnboardingCompleted = setIntervalAsync(async () => {
    const { onboarding_completed } =
      await serviceProviderUsersService.getServiceProviderUserMe();
    isUserOnboarded.value = onboarding_completed;
    if (isUserOnboarded.value) {
      clearTimeout(getFlowTimeout);
      await clearIntervalAsync(getUserUntilOnboardingCompleted);
    }
  }, 250);
};

watch(isUserOnboarded, async () => {
  if (!isUserOnboarded.value) {
    return;
  }
  authService.clearState();
  await userManager.removeUser();
  onboardingService.oAuthManager?.authorize(flow.value?.organization_id);
});

onMounted(async () => {
  const oAuthManager = new OAuthManager(
    route.query.code?.toString() || "",
    route.query.next_url?.toString() || "",
    AuthStorageKeys.ONBOARDING,
  );
  await oAuthManager.init();
  onboardingService.setOAuthManager(oAuthManager);
  iamClientService.setOAuthManager(oAuthManager);
  serviceProviderUsersService.setOAuthManager(oAuthManager);
  await onLoad();
  if (brandingConfigStore.brandingConfig)
    brandingConfigStore.setBrandingConfig(brandingConfigStore.brandingConfig);
});

const previous = () => {
  stageIndex.value -= 1;
  const stages = flow.value?.stages || [];
  if (stageIndex.value >= 0 && stages.length > 0) {
    onboardingService.state.stageActive = stages[stageIndex.value];
  }
};

const next = async () => {
  stageIndex.value += 1;
  const stages = flow.value?.stages || [];
  const completedOrganizationOld = flow.value?.completed_organization || false;
  flow.value = await onboardingService.getFlow({
    stage_index: stageIndex.value,
  });
  const completedOrganizationNew = flow.value?.completed_organization || false;
  onboardingCompleted.value = stageIndex.value >= stages.length;
  userOnboardingCompleted.value =
    !completedOrganizationOld && completedOrganizationNew;
  if (onboardingCompleted.value || userOnboardingCompleted.value) {
    await waitForUserOnboardingCompleted();
    return;
  }
  onboardingService.state.stageActive = stages[stageIndex.value];
};

const stageComponents: { [id: string]: unknown } = {
  CreateAccount,
  UserDetails,
  JoinedOrganization,
  CreateOrganization,
  InviteColleagues,
  UpdateOrganization,
  RequestOrganizationAccess,
  ChoosePlan,
};
</script>

<template>
  <div v-if="isError" class="mm-flex mm-flex-column">
    <m-m-alert :status="AlertTypes.Error" :is-closable="false">
      Error while onboarding: {{ errorText }}
    </m-m-alert>
  </div>
  <template v-else>
    <template v-if="flow">
      <m-m-progress-circular
        v-if="isFlowLoading"
        indeterminate
        :size="64"
        :width="6"
      />
      <component
        :is="stageComponents[onboardingService.state.stageActive.component]"
        v-if="
          !onboardingCompleted &&
          !userOnboardingCompleted &&
          onboardingService.state.stageActive
        "
        v-bind="{
          ...onboardingService.state.stageActive.data,
          previous_callable: previous,
          next_callable: next,
          organization_id: flow?.organization_id,
          isStageRequired: onboardingService.state.stageActive.required,
        }"
      />
    </template>
    <m-m-progress-circular v-else indeterminate :size="64" :width="6" />
  </template>
</template>

<style scoped lang="scss">
/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .loader-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%) !important;
    width: 100%;
  }
}
</style>
