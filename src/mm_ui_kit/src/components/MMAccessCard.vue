<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

const props = defineProps({
  serviceProviderName: {
    type: String,
    default: "",
  },
  detailName: {
    type: String,
    default: "",
  },
  detailIcon: {
    type: String,
    default: "",
  },
  detailLogo: {
    type: String,
    default: "",
  },
  detailDescription: {
    type: String,
    default: "",
  },
  noResultsMessage: {
    type: String,
    default: "",
  },
  organizationName: {
    type: String,
    default: "",
  },
});

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const showExpandButton = computed(() => {
  return props.detailDescription.length > 37;
});
</script>

<template>
  <div v-if="detailName">
    <div class="access" :class="isExpanded ? 'expanded' : ''">
      <div class="mm-flex mm-flex-gap-4 mm-mb-8 mm-flex-align-center">
        <div v-if="detailLogo" class="access-logo--container">
          <img :src="detailLogo" class="access-logo" />
        </div>
        <div
          v-else
          class="mm-flex mm-flex-align-center mm-flex-justify-center mm-app-bar--initials"
        >
          <m-m-icon
            icon="users-outline"
            width="20px"
            height="20px"
            stroke="#072E51"
          />
        </div>
        <div class="access--ellipsis" :title="serviceProviderName">
          {{ serviceProviderName }}
        </div>
        <m-m-badge status="active" size="small" class="mm-ml-auto" />
      </div>
      <div class="access-text access--ellipsis" :title="detailName">
        {{ detailName }}
      </div>
      <div
        :class="[
          'access-text',
          'access-text--small',
          { 'access--ellipsis': !isExpanded },
        ]"
        :title="detailDescription"
      >
        {{ detailDescription }}
      </div>
      <button
        v-if="showExpandButton"
        class="see-more-button"
        variant="text"
        @click="toggleExpand"
      >
        {{ isExpanded ? "See less" : "See more" }}
      </button>
      <div class="access-text access-text--small access--container mm-mt-6">
        {{ organizationName }}
      </div>
    </div>
  </div>
  <div v-else class="access access--no-results mm-flex mm-flex-align-center">
    <m-m-icon :icon="detailIcon" width="20px" height="20px" stroke="#072E51" />
    {{ noResultsMessage }}
  </div>
</template>
<style scoped lang="scss">
:deep(.mm-page-subtitle--h2) {
  font-size: 16px;
}
.access {
  padding: 16px;
  border: 1px solid #e6e8ec;
  border-radius: 12px;
  margin-bottom: 8px;
  width: 250px;
  height: 170px;
  display: flex;
  flex-direction: column;

  &-logo--container {
    display: flex;
    align-items: center;
    width: auto;
    height: 30px;
    max-width: 50px;
  }

  &.expanded {
    height: fit-content;
    opacity: 1;
  }

  &-logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  &--no-results {
    min-width: 210px;
    width: fit-content;
    min-height: fit-content;
    font-size: 14px;
    color: #4d5761;
    justify-content: center;
  }

  &-text {
    font-size: 14px;
    color: #4d5761;
    line-height: 18px;
    text-transform: capitalize;

    &--small {
      font-size: 12px;
    }

    &.expanded {
      max-width: none;
      white-space: normal;
    }
  }

  &--container {
    background-color: #e0e0e0;
    color: #333;
    padding: 2px 6px;
    border-radius: 16px;
    font-size: 12px;
    width: fit-content;
    margin-top: auto;
  }

  &--ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 1;
  }

  .see-more-button {
    color: #072e51;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    margin-bottom: 10px;
    width: fit-content;
  }
}
</style>
