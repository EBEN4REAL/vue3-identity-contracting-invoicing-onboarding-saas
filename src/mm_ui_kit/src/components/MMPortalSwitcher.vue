<script setup lang="ts">
import { ref } from "vue";
import LogoAdmin from "../assets/images/logoAdmin.svg";
import LogoCustomer from "../assets/images/logoCustomer.svg";

defineProps({
  cy: {
    type: String,
    default: "portal-switcher",
  },
  scPortal: {
    type: String,
    default: null,
  },
  spPortal: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isSpOrg: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["startUsingAdmin"]);
const switcherActive = ref(false);

const toggleSwitcher = () => {
  switcherActive.value = !switcherActive.value;
};

const hideSwitcher = () => {
  switcherActive.value = false;
};
</script>

<template>
  <div v-click-outside="hideSwitcher" class="mm-portal-switcher" :data-cy="cy">
    <div
      :class="['mm-portal-switcher--activator', { disabled: disabled }]"
      @click="toggleSwitcher"
    >
      <logo-customer v-if="spPortal" class="mm-portal-logo"></logo-customer>
      <logo-admin v-else class="mm-portal-logo"></logo-admin>

      <m-m-icon
        v-if="!disabled"
        icon="chevron-up-down"
        class="mm-portal-switcher--icon"
        stroke="#9EA5AF"
      ></m-m-icon>
    </div>

    <div
      :class="[
        'mm-portal-switcher--list',
        {
          active: switcherActive,
          reverse: scPortal,
        },
      ]"
    >
      <m-m-link
        :href="scPortal"
        :disabled="!scPortal"
        class="mm-portal-switcher--link"
      >
        <div class="mm-portal-switcher--link-label">Customer Portal</div>
        <m-m-icon
          v-if="!scPortal"
          icon="circle-check-outline"
          stroke="#072E51"
        ></m-m-icon>
      </m-m-link>
      <m-m-link
        :href="spPortal"
        :disabled="!spPortal"
        class="mm-portal-switcher--link"
      >
        <div class="mm-portal-switcher--section mm-flex mm-flex-column">
          <div class="mm-portal-switcher--link-label">Admin Portal</div>
          <div v-if="!isSpOrg">
            <div
              class="mm-portal-switcher--list-message"
              data-cy="sc-org-message"
            >
              Want to set up access and subscription management for your
              organization?
            </div>
            <m-m-button
              cy="go-admin-portal"
              variant="outlined"
              :is-full-width="true"
              class="mm-mt-6"
              @click.prevent="emit('startUsingAdmin')"
            >
              Start Using Admin Portal
            </m-m-button>
          </div>
        </div>
        <m-m-icon
          v-if="!spPortal"
          icon="circle-check-outline"
          stroke="#072E51"
        ></m-m-icon>
      </m-m-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-portal-switcher {
  width: 100%;
  border: 1px solid #d3d7dc;
  border-radius: 6px;
  padding: 8px 12px;
  position: relative;

  &--activator {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.disabled {
      pointer-events: none;
    }

    .mm-portal-logo {
      height: 46px;
      margin-bottom: 8px;
    }
  }

  &--list {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    width: 100%;
    align-items: flex-start;
    left: 0;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #eaecf0;
    box-shadow: 0px 12px 16px -4px #1018283d;
    padding: 8px;
    z-index: 10;

    &.reverse {
      flex-direction: column-reverse;
    }

    &.active {
      display: flex;
    }

    .mm-portal-switcher--link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 20px 12px;

      &:hover {
        background: #f7f8f9;
      }

      &-label {
        text-transform: uppercase;
        font-weight: 500;
        font-size: 15px;
      }
    }

    &-message {
      font-weight: 400;
      font-size: 12px;
      color: #4d5761;
      line-height: 17px;
    }
  }

  &--section {
    max-width: 100%;
    @media (max-width: $breakpoint-md) {
      button.mm-button--size-medium {
        font-size: 14px;
      }
    }
  }
}
</style>
