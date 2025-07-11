<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from "vue";
import { usersService } from "~/users/users.service";
import {
  OrganizationGroupRead,
  OrganizationRead,
  OrganizationUnitRead,
  OrganizationUserRead,
  UserRead,
} from "~/iam/iam.types";
import { organizationsService } from "~/organizations/organizations.service";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import { ITEMS_PER_PAGE } from "~/common/constants";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";

interface DecisionForm {
  decision: string;
  organizationGroups: string[];
  organizationUnit: string | null;
}

const user: Ref<UserRead | null> = ref(null);
const organizationUser: Ref<OrganizationUserRead | null> = ref(null);
const organization: Ref<OrganizationRead | null> = ref(null);
const organizationUnits: Ref<OrganizationUnitRead[] | null> = ref(null);
const organizationGroups: Ref<TableResponse<OrganizationGroupRead>> = ref(null);
const isUserProcessed = ref(false);
const processedMessage = ref("");

onMounted(async () => {
  organizationUser.value = await organizationsService.getOrganizationUser(
    props.org_id,
    props.org_user_id,
  );
  if (organizationUser.value?.status != "P") {
    isUserProcessed.value = true;
    processedMessage.value =
      organizationUser.value?.status == "A" ? "accepted" : "rejected";
    return;
  }
  user.value = await usersService.getUser(props.org_user_id);
  organization.value = await organizationsService.getOrganization(props.org_id);
  organizationUnits.value = await organizationsService.getOrganizationUnits(
    props.org_id,
  );
  organizationGroups.value = await organizationsService.getOrganizationGroups(
    props.org_id,
    { limit: ITEMS_PER_PAGE[0], offset: "0" },
  );
});

const formData = reactive<DecisionForm>({
  decision: "Yes",
  organizationGroups: [],
  organizationUnit: null,
});

const submitForm = async () => {
  const status = formData.decision == "Yes" ? "A" : "R";
  if (status == "A") {
    for (const groupId of formData.organizationGroups) {
      await organizationsService.addOrganizationUserToGroups(
        organization.value.id,
        groupId,
        [user.value.id],
      );
    }

    if (formData.organizationUnit) {
      await organizationsService.addOrganizationUnitUsers(
        organization.value.id,
        formData.organizationUnit,
        [user.value.id],
      );
    }
  }
  await organizationsService.updateOrganizationUser(
    organization.value.id,
    user.value.id,
    {
      status: status,
    },
  );
  eventBus.$emit("onShowToast", {
    text: "Request has been processed",
    status: "success",
  });
};

const props = defineProps({
  org_id: {
    type: String,
    required: true,
  },
  org_user_id: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h1 v-if="isUserProcessed" id="request-status-message">
    This request has already been {{ processedMessage }}
  </h1>
  <v-container v-else-if="organization && user" class="container"
    ><p id="request-title" class="container-request-title">
      <b>User {{ user?.email }} has requested to join your organization</b>
    </p>
    <v-form class="container-form" @submit.prevent @submit="submitForm">
      <v-container class="container-request-message-container">
        <p id="request-message" class="container-request-message">
          Add {{ user?.email }} to {{ organization?.name }}?
        </p>
        <v-select
          id="add-user"
          v-model="formData.decision"
          class="container-add-user-select"
          placeholder="Yes"
          :items="['Yes', 'No']"
          box
        ></v-select>
      </v-container>

      <v-container
        v-if="organizationUnits && organizationUnits.length > 0"
        id="organization-units"
        class="org-units-container"
      >
        <p class="org-units-container-label">Choose unit</p>
        <v-select
          id="organization-units-select"
          v-model="formData.organizationUnit"
          class="org-units-container-select"
          :items="organizationUnits"
          item-title="name"
          item-value="id"
        ></v-select>
      </v-container>

      <pre>
        !{{ organizationGroups }}!
      </pre>

      <v-container
        v-if="
          organizationGroups?.results && organizationGroups?.results.length > 0
        "
        id="organization-groups"
        class="org-groups-container"
      >
        <p class="org-groups-container-label">Choose group/s</p>
        <v-select
          id="organization-groups-select"
          v-model="formData.organizationGroups"
          :items="organizationGroups?.results"
          item-title="name"
          item-value="id"
          label="Please select"
          variant="outlined"
          multiple
        ></v-select>
      </v-container>
      <v-container class="tip-container">
        <m-m-icon icon="lightbulb-on-10" />
        <p class="tip-container-text-content">
          Tip: By adding users to these structures, they will automatically
          receive all policies allocated to them.
        </p>
      </v-container>
      <v-btn id="submit-button" class="submit-button" type="submit"
        >Submit
      </v-btn>
      <m-m-toast />
    </v-form>
  </v-container>
</template>

<style scoped lang="scss">
.container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  &-request-title {
    text-align: center;
  }
  &-form {
    display: flex;
    flex-direction: column;
  }
  &-add-user-select {
    width: 13%;
    flex: none;
  }
  &-request-message {
    width: 60%;
  }
  &-request-message-container {
    display: flex;
  }
}
.org-units-container {
  display: flex;
  &-label {
    width: 60%;
  }
}
.org-groups-container {
  display: flex;
  &-label {
    width: 60%;
  }
}
.tip-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &-text-content {
    text-align: center;
  }
}
.submit-button {
  width: 50%;
  align-self: center;
}
</style>
