<script setup lang="ts">
import { computed, PropType, Ref, ref } from "vue";
import { iamClientService } from "~/iam/iam.client.service";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";

type UserOrganization = {
  id: string;
  name: string;
  joined: boolean;
};

const props = defineProps({
  organizations: {
    type: Array as PropType<UserOrganization[]>,
    required: true,
  },
  previous_callable: { type: Function, required: true },
  next_callable: { type: Function, required: true },
});

const next = async () => {
  await props.next_callable();
};

const requestToJoinError: Ref<boolean> = ref(false);
const organizationUserJoinedTo = ref<UserOrganization | null>(null);

const subtitle = computed(() =>
  organizationUserJoinedTo.value
    ? `Request has been sent to ${organizationUserJoinedTo.value.name}`
    : "We have found the following organizations, please select the organization you would like to join",
);

const subtitleSuccess = computed(
  () =>
    `Your request to join ${organizationUserJoinedTo.value?.name} has been sent. You will receive an email when it has been actioned.`,
);

const handleRequestToJoin = async (id: string, joined: boolean) => {
  requestToJoinError.value = false;
  if (joined) {
    await next();
    return;
  }
  try {
    const { organization } =
      await iamClientService.addCurrentUserToOrganization(id);
    if (organization) {
      organizationUserJoinedTo.value = {
        id: organization.id,
        name: organization.name,
        joined,
      };
    }
  } catch (error) {
    requestToJoinError.value = true;
  }
};
</script>

<template>
  <m-m-teleport to="onboarding-title">Join your organization</m-m-teleport>
  <m-m-teleport to="onboarding-subtitle">
    <span data-cy="join-subtitle">
      {{ subtitle }}
    </span>
  </m-m-teleport>

  <template v-if="requestToJoinError">
    <div class="mm-flex mm-flex-column mb-7">
      <m-m-alert :status="AlertTypes.Error" :is-closable="false">
        Error while joining organization. Please logout and login again.
      </m-m-alert>
    </div>
  </template>

  <template v-if="!organizationUserJoinedTo">
    <m-m-card
      v-for="organization in organizations"
      :key="organization.id"
      class="mm-flex mm-flex-align-center mm-mb-4 mm-py-5 mm-px-7 font-weight-500"
      :data-cy="`organization-${organization.id}`"
    >
      <div class="organization-logo-placeholder" />
      <div data-cy="organization-name">{{ organization.name }}</div>
      <m-m-button
        size="small"
        class="mm-ml-auto"
        data-cy="button-join-organization"
        @click="handleRequestToJoin(organization.id, organization.joined)"
      >
        {{ organization.joined ? "Continue" : "Join" }}
      </m-m-button>
    </m-m-card>

    <m-m-teleport to="onboarding-previous-button">
      <m-m-button
        variant="outlined"
        data-cy="button-previous"
        @click.prevent="previous_callable"
      >
        Previous step
      </m-m-button>
    </m-m-teleport>
  </template>

  <template v-else>
    <m-m-card class="mm-flex mm-flex-column mm-flex-align-center mm-pa-16">
      <div
        class="organization-success-icon mm-flex mm-flex-justify-center mm-flex-align-center mm-mb-8"
      >
        <m-m-icon icon="envelope" />
      </div>
      <div class="organization-success-title mm-mb-2">Request sent</div>
      <div class="organization-success-subtitle" data-cy="success-subtitle">
        {{ subtitleSuccess }}
      </div>
    </m-m-card>
  </template>
</template>

<style scoped lang="scss">
.organization-logo {
  &-image {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }

  &-placeholder {
    width: 32px;
    height: 32px;
    margin-right: 8px;
    border-radius: 8px;
    background-color: #efefef;
  }
}

.organization-success {
  &-icon {
    width: 48px;
    height: 48px;
    border: 1px solid #98a2b3;
    border-radius: 10px;
  }

  &-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #101828;
  }

  &-subtitle {
    font-size: 14px;
    line-height: 20px;
    color: #475467;
    text-align: center;
  }
}
</style>
