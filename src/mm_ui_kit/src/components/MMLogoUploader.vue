<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  cy: {
    type: String,
    default: "logo-uploader",
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  logoUrl: {
    type: String,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["logo-uploaded", "imgFullyLoaded"]);
const errorMsg = ref("");
const logoFile = ref<null | File | Blob>(null);
const brandLogo = ref(props.logoUrl);
const fileInput = ref<HTMLInputElement | null>(null);

const uploadLogo = () => {
  if (fileInput.value) fileInput.value.click();
};

const handleFileChange = async (event) => {
  const files = event.target.files || event.dataTransfer.files;
  errorMsg.value = "";
  if (!files.length) {
    return;
  }

  const file = files[0];

  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = "Please upload an image that’s less than 2 MB";
    logoFile.value = null;
    brandLogo.value = "";
    return;
  }

  const img = new Image();
  var objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;

  const imageDimensions: {
    height: number;
    width: number;
  } = await new Promise((resolve) => {
    img.onload = () => {
      const dimensions = {
        height: img.height,
        width: img.width,
      };
      resolve(dimensions);
    };
  });

  if (imageDimensions.width < 90 && imageDimensions.height < 100) {
    errorMsg.value = "Please upload an image that’s bigger than 90px by 100px";
    logoFile.value = null;
    brandLogo.value = "";
    return;
  }

  logoFile.value = file;
  brandLogo.value = URL.createObjectURL(logoFile.value as Blob);
  emit("logo-uploaded", logoFile.value, brandLogo.value);
};

const handleImgLoaded = () => {
  emit("imgFullyLoaded");
};

watch(
  () => props.logoUrl,
  () => {
    brandLogo.value = props.logoUrl;
  },
);
</script>

<template>
  <div class="logo-uploader">
    <div
      v-if="$slots['logo-uploader-title']"
      class="logo-uploader-title"
      data-cy="logo-uploader-title"
    >
      <slot name="logo-uploader-title" />
    </div>
    <div
      v-if="$slots['logo-uploader-subtitle']"
      class="logo-uploader-subtitle"
      data-cy="logo-uploader-subtitle"
    >
      <slot name="logo-uploader-subtitle" />
    </div>
    <div class="mm-flex mm-flex-gap-10">
      <m-m-button
        variant="transparent"
        class="logo-uploader-button"
        :class="{
          'logo-added': brandLogo && !isLoading,
          'logo-uploader-button-error': errorMsg,
          'logo-uploader-button-disabled': !isEditMode,
        }"
        :loading="isLoading"
        @click="uploadLogo"
      >
        <span
          v-if="!logoFile && !brandLogo"
          class="mm-flex mm-flex-column mm-flex-align-center"
        >
          <m-m-icon icon="arrow-up-tray" />
          Upload Logo
        </span>
        <img
          v-if="brandLogo"
          id="your-image-id"
          :src="brandLogo"
          alt="Uploaded Logo"
          @load="handleImgLoaded"
        />
      </m-m-button>
      <input
        ref="fileInput"
        :data-cy="cy"
        type="file"
        accept="image/*"
        :disabled="!isEditMode"
        @change="handleFileChange"
      />
      <m-m-button
        v-if="brandLogo && isEditMode"
        variant="outlined"
        prepend-icon="arrow-path"
        size="small"
        class="logo-uploader-select"
        cy="replace-logo"
        @click="uploadLogo"
      >
        Replace Logo
      </m-m-button>
    </div>
    <div
      v-if="errorMsg"
      class="logo-uploader-error mm-mt-6"
      data-cy="error-message"
    >
      <m-m-icon icon="warning" width="16" height="16" />
      <div>{{ errorMsg }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo-uploader {
  display: flex;
  flex-direction: column;
  max-width: 50%;

  &-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    color: #111927;
  }

  &-subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #6d7480;
    margin-bottom: 24px;
  }

  &-button {
    border: 2px dashed #d3d7dc;
    border-radius: 28px;
    width: 140px;
    height: 140px;
    background-color: #fafbfc;
    color: #6d7480;
    font-size: 14px;
    font-weight: 500;

    &.logo-added {
      background-color: white;
      box-shadow: 0px 0px 8px 0px #00000026;
      border: 1px solid #d3d7dc;
    }

    &-error {
      border: 1px dashed #f04438;
      background: #fffbfa;
    }

    &-disabled {
      cursor: not-allowed;
    }

    & img {
      max-width: 130px;
      max-height: 115px;
    }
  }

  &-select {
    align-self: center;
  }

  &-error {
    color: #d92d20;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    gap: 5px;
    align-items: center;
  }

  input[type="file"] {
    display: none;
  }
}
</style>
