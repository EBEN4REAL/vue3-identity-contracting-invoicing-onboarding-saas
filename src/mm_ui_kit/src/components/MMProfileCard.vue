<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import { UserProfileMM } from "~/auth/auth.types";
import { authService } from "~/auth/auth.service";
import { useRouter } from "vue-router";
import config from "~/mm.config.json";
import MMAvatar from "~/mm_ui_kit/src/components/MMAvatar.vue";

const router = useRouter();

const props = defineProps({
  userProfile: {
    type: Object as () => UserProfileMM | null,
    default: null,
  },
  initials: {
    type: String,
    default: null,
  },
});

const profileCardActive = ref(false);

const toggleProfileCard = () => {
  profileCardActive.value = !profileCardActive.value;
};

const hideProfileCard = () => {
  profileCardActive.value = false;
};

const showUsernameTooltip: ComputedRef<boolean> = computed(
  () => (props.userProfile?.name?.length ?? 0) >= 20,
);

const showEmailTooltip: ComputedRef<boolean> = computed(
  () => (props.userProfile?.email?.length ?? 0) >= 20,
);

const openUserProfile = () => {
  if (config?.scApp) {
    window.open(`${config?.scApp?.url}/user/profile`, "_blank");
  } else {
    router.push("/user/profile");
  }
  hideProfileCard();
};
</script>

<template>
  <div v-click-outside="hideProfileCard" class="mm-profile-card">
    <m-m-avatar
      v-if="userProfile"
      :url="userProfile.picture"
      :initials="initials"
      initials-font-size="14px"
      size="32px"
      class="mm-cursor-pointer"
      @click="toggleProfileCard"
    />

    <div
      :class="[
        'mm-profile-card--dropdown',
        {
          active: profileCardActive,
        },
      ]"
    >
      <div class="mm-profile-card--dropdown--user-info">
        <m-m-avatar
          v-if="userProfile"
          :url="userProfile.picture"
          :initials="initials"
          @click="toggleProfileCard"
        />
        <div class="mm-profile-card--dropdown--user-name">
          <m-m-text-ellipsis max-width="180px">
            {{ userProfile?.name }}
          </m-m-text-ellipsis>
          <m-m-tooltip v-if="showUsernameTooltip" display-position="toLeft">
            {{ userProfile?.name }}
          </m-m-tooltip>
        </div>
        <div class="mm-profile-card--dropdown--user-email">
          <m-m-text-ellipsis max-width="180px">
            {{ userProfile?.email }}
          </m-m-text-ellipsis>
          <m-m-tooltip v-if="showEmailTooltip" display-position="toLeft">
            {{ userProfile?.email }}
          </m-m-tooltip>
        </div>
      </div>
      <div class="mm-profile-card--dropdown--user-links">
        <div
          class="mm-profile-card--dropdown--user-link"
          data-cy="profile-card-profile-link"
          @click="openUserProfile"
        >
          <m-m-icon
            icon="user-outline-basic"
            stroke="#384250"
            width="22px"
          ></m-m-icon>
          <div class="mm-profile-card--dropdown--label">Profile</div>
        </div>
        <div
          class="mm-profile-card--dropdown--user-link"
          data-cy="profile-card-logout-link"
          @click="() => authService.logout()"
        >
          <m-m-icon
            icon="logout-outline"
            stroke="#384250"
            width="22px"
          ></m-m-icon>
          <div class="mm-profile-card--dropdown--label">Logout</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-profile-card {
  position: relative;

  &--link {
    padding: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &--dropdown {
    position: absolute;
    top: calc(100% + 11px);
    right: 0;
    width: 235px;
    display: none;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #eaecf0;
    box-shadow: 0px 12px 16px -4px #1018283d;
    padding: 8px;

    &.active {
      display: block;
    }

    &--user-info {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 8px 8px 12px 8px;
      border-bottom: 1px solid #e6e8ec;
      gap: 4px;
    }

    &--user-name {
      font-size: 18px;
      line-height: 28px;
      font-weight: 600;
      color: #384250;
      text-align: center;
    }

    &--user-email {
      font-size: 12px;
      line-height: 18px;
      color: #6d7480;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &--user-links {
      display: flex;
      flex-direction: column;
      padding-top: 12px;
    }

    &--user-link {
      padding: 10px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.3s;
      gap: 12px;
      font-size: 14px;

      &:hover {
        background: #f7f8f9;
      }

      &--icon-label {
      }

      &--label {
      }
    }
  }
}
</style>
