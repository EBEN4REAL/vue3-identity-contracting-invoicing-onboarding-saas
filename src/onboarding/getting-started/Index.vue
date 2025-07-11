<script lang="ts" setup>
import { computed, ref, onMounted, Ref, watch, ComputedRef } from "vue";
import { useRouter } from "vue-router";
import { onboardingServiceAuth } from "~/onboarding/onboarding.service";
import {
  WelcomeComponentAppEnum,
  WelcomeComponentsRead,
} from "~/onboarding/onboarding.types";
import {
  TypeGettingStartedComponentButton,
  TypeGettingStartedStep,
} from "~/mm_ui_kit/src/types/getting-started.types";
import { welcomeComponentsMap } from "./constants";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { useGettingStartedStore } from "~/stores/gettingStarted";
import { convertToKebabCase } from "~/mm_ui_kit/src/helpers/convertToKebabCase";
import { useFlag } from "@unleash/proxy-client-vue";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";
import { useTranslation } from "i18next-vue";

const router = useRouter();
const isSubscriptionsEnabled = useFlag("org_subscriptions");
const accessLicensesEnabled = useFlag("org_licenses");
const welcomeComponents: Ref<WelcomeComponentsRead | null> = ref(null);
const steps: Ref<TypeGettingStartedStep[]> = ref([]);
const userProfile: Ref<UserProfileMM | null> = ref(null);
const isFirstRender: Ref<boolean> = ref(true);
const isStepsLoading: Ref<boolean> = ref(false);
const productBannerEnabled = useFlag("product_banners");
const gettingStartedStore = useGettingStartedStore();
const { t } = useTranslation();

const title: ComputedRef<string> = computed(() =>
  t(
    "getting_started.title",
    escapeObjectValuesForHtml({
      userName: userProfile.value?.given_name || "",
    }),
  ),
);

const mapWelcomeComponentsToSteps = () => {
  if (!welcomeComponents.value) return;

  let foundIncompleteStep = false;

  const componentToFilterOut = isSubscriptionsEnabled.value
    ? "ViewLicensesAndPolicies"
    : "ViewAccessToProviders";

  steps.value = welcomeComponents.value.components
    .map((component, index) => {
      const componentDetails = welcomeComponentsMap[component.component];

      if (!componentDetails) {
        return null;
      }

      const isCompleted = component.completed;

      const isCollapsed = isCompleted || foundIncompleteStep;

      if (!isCompleted && !foundIncompleteStep) {
        foundIncompleteStep = true;
      }

      const filteredButtons = componentDetails.buttons.filter((button) => {
        if (!accessLicensesEnabled.value) {
          return button.label !== "View access licenses";
        }
        return true;
      });

      return {
        id: index + 1,
        componentName: component.component,
        component: componentDetails.component,
        icon: isCompleted ? "check-mark" : componentDetails.icon,
        title: componentDetails.title,
        completed: isCompleted,
        collapsed: isCollapsed,
        isLocked: false,
        buttons: filteredButtons,
        badge: componentDetails.badge,
      };
    })
    .filter((step): step is NonNullable<typeof step> => step !== null)
    .filter((step) => step.componentName !== componentToFilterOut);

  isFirstRender.value = false;
};

const toggleStepCollapse = (id: number) => {
  let foundNextStep = false;

  steps.value = steps.value.map((step) => {
    if (step.id === id) {
      if (step.completed && !step.collapsed) {
        foundNextStep = true;
        return { ...step, collapsed: true };
      }
      return { ...step, collapsed: !step.collapsed };
    }

    if (foundNextStep && !step.completed) {
      foundNextStep = false;
      return { ...step, collapsed: false };
    }

    return step;
  });
};

const deleteWelcomeComponent = async (stepId: number) => {
  const component = steps.value.find(
    (step: TypeGettingStartedStep) => step.id === stepId,
  );
  if (component?.componentName) {
    const payload = {
      app: WelcomeComponentAppEnum.SC,
      component: component?.componentName,
    };
    try {
      await onboardingServiceAuth.deleteWelcomeComponent(payload);
      await getWelcomeComponents();
    } catch (error: unknown) {
      eventBus.$emit("onShowToast", {
        text: "Error deleting Welcome Component",
        status: "error",
      });
    }
  }
};

const createWelcomeComponent = async (stepId: number) => {
  const component = steps.value.find(
    (step: TypeGettingStartedStep) => step.id === stepId,
  );
  if (component?.componentName) {
    const payload = {
      app: WelcomeComponentAppEnum.SC,
      component: component?.componentName,
    };
    try {
      await onboardingServiceAuth.createWelcomeComponent(payload);
      await getWelcomeComponents();
    } catch (error: unknown) {
      eventBus.$emit("onShowToast", {
        text: "Error Creating Welcome Component",
        status: "error",
      });
    }
  }
};
const updateStepCompleted = async ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  if (completed) {
    await createWelcomeComponent(id);
  } else {
    await deleteWelcomeComponent(id);
  }
};

const getWelcomeComponents = async () => {
  isStepsLoading.value = true;
  try {
    welcomeComponents.value = await onboardingServiceAuth.getWelcomeComponents({
      app: WelcomeComponentAppEnum.SC,
    });
    gettingStartedStore.setAllStepsCompletedStatus(
      welcomeComponents.value.completed,
    );
    mapWelcomeComponentsToSteps();
    gettingStartedStore.setAllStepsCompletedStatus(
      welcomeComponents.value.completed,
    );
    if (welcomeComponents.value.completed) await redirectAfterFinish();
  } catch (error: unknown) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching Welcome Components",
      status: "error",
    });
  } finally {
    isStepsLoading.value = false;
  }
};

const redirectAfterFinish = async () => {
  const redirectTo =
    userProfile.value && (await authService.isUserOrgViewer())
      ? `/sc/organizations/${userProfile.value?.org}`
      : "/user/profile";

  await router.push(redirectTo);
};

const redirectToPath = (button: TypeGettingStartedComponentButton) => {
  router.push({
    path: button.path,
    hash: button.hash,
  });
};

watch(
  () => steps.value.map((step) => step.completed),
  (completedSteps) => {
    if (completedSteps.length && completedSteps.every(Boolean)) {
      gettingStartedStore.setAllStepsCompletedStatus(true);
      redirectAfterFinish();
    }
  },
);

onMounted(async () => {
  userProfile.value = await authService.getProfile();
  await getWelcomeComponents();
});
</script>

<template>
  <m-m-beta-banner v-if="productBannerEnabled" />
  <section class="mm-page">
    <section class="getting-started-container">
      <div class="getting-started__header mm-fw-600">
        <h2
          v-sanitize-html="title"
          class="getting-started__header--title"
          data-cy="getting-started-title"
        />
        <p
          v-sanitize-html="$t('getting_started.subtitle')"
          class="getting-started__header--subtitle mm-fw-400"
          data-cy="getting-started-subtitle"
        />
      </div>

      <div class="steps-container">
        <m-m-progress-bar
          :progress="welcomeComponents?.completed_percentage || 0"
          show-label
        />

        <div v-if="!isStepsLoading">
          <m-m-getting-started-step
            v-for="step in steps"
            :key="step.id"
            class="mm-mt-9 cursor-pointer"
            :step="step"
            :cy="step.componentName"
            @click="toggleStepCollapse(step.id)"
            @toggle-step="toggleStepCollapse(step.id)"
            @toggle-completed="updateStepCompleted"
          >
            <template #welcome-component>
              <component :is="step.component" :data="step" />
            </template>
            <template #buttons>
              <div v-if="!step.collapsed" class="mm-flex mm-flex-column">
                <m-m-button
                  v-for="button in step.buttons"
                  :key="`button-${button.label}`"
                  variant="outlined"
                  :append-icon="button?.icon"
                  stroke="#0F172A"
                  size="small"
                  class="mm-mr-auto mm-mt-8"
                  :cy="`getting-started-step-button-${convertToKebabCase(button.label)}`"
                  v-bind="button.props"
                  @click.stop="() => redirectToPath(button)"
                >
                  {{ button.label }}
                </m-m-button>
              </div>
            </template>
          </m-m-getting-started-step>
        </div>
        <div v-else class="mm-mt-9">
          <m-m-getting-started-steps-loader
            v-for="(step, i) in 3"
            :key="i"
            class="mm-mt-10"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<style lang="scss">
.getting-started {
  &-container {
    width: 60%;
    margin: 0 auto;
  }

  &__header {
    max-width: 67%;
    display: flex;
    gap: 5px;
    flex-direction: column;
    margin-bottom: 10px;

    &--title {
      color: #384250;
      font-size: 24px;
    }

    &--subtitle {
      color: #6d7480;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
.welcome-component {
  &__description {
    font-size: 14px;
    line-height: 20px;
    color: #6d7480;
  }
}

/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-page {
    padding: 20px;
  }
  .getting-started-container {
    width: 100%;
    .steps-container {
      width: 100%;
    }
  }
}
</style>
