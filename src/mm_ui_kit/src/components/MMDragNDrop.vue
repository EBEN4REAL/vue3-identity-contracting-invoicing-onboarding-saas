<script setup lang="ts">
import { computed, ComputedRef, PropType, Ref, ref, watch } from "vue";
import { useDropZone } from "@vueuse/core";

const props = defineProps({
  status: {
    type: String as PropType<"default" | "error">,
    default: "default",
  },
  supportedFormats: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: "Error while uploading file",
  },
  cyDragNDropZone: {
    type: String,
    default: "drag-n-drop-zone",
  },
  cyDragNDropFile: {
    type: String,
    default: "drag-n-drop-file",
  },
});

const emit = defineEmits(["upload", "delete"]);

const uploadedFile: Ref<File | null> = ref(null);
const dropZoneRef = ref<HTMLDivElement>();

const supportedFormatsSubheader: ComputedRef<string> = computed(() =>
  props.supportedFormats.join(", ").toUpperCase(),
);

const supportedFormatsAccept: ComputedRef<string> = computed(() =>
  props.supportedFormats
    .map((fileFormat: string) => `.${fileFormat.toUpperCase()}`)
    .join(", "),
);

const mmDragNDropClassList = computed(() => ({
  [`mm-drag-n-drop--status-${props.status}`]: true,
  "mm-drag-n-drop--dragging-over": isOverDropZone.value,
}));

const isStatusDefault: ComputedRef<boolean> = computed(
  () => props.status === "default",
);

const isStatusError: ComputedRef<boolean> = computed(
  () => props.status === "error",
);

const onClickToUpload = () => {
  document.getElementById("input-file")?.click();
};

const handleUploadedFile = (file: File) => {
  uploadedFile.value = file;
  emit("upload", file);
};

const onUploadFile = (event: Event) => {
  handleUploadedFile(event.target?.files[0]);
};

const onDrop = (files: File[] | null) => {
  if (files) {
    handleUploadedFile(files[0]);
  }
};

const onDeleteUploadedFile = () => {
  uploadedFile.value = null;
  emit("delete", null);
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
});

watch(
  () => props.status,
  () => {
    if (isStatusError.value) {
      onDeleteUploadedFile();
    }
  },
);
</script>

<template>
  <div
    v-if="uploadedFile"
    class="mm-drag-n-drop--uploaded-file"
    :data-cy="cyDragNDropFile"
  >
    <div class="uploaded-file mm-flex mm-flex-align-center">
      <div class="mm-drag-n-drop--icon mm-mr-4">
        <m-m-icon icon="document-text" />
      </div>
      <div class="uploaded-file--name">
        {{ uploadedFile.name }}
      </div>
      <m-m-button
        prepend-icon="trash-primary"
        variant="tertiary"
        class="mm-ml-auto"
        cy="button-delete-uploaded-file"
        @click="onDeleteUploadedFile"
      />
    </div>
  </div>
  <div
    v-else
    ref="dropZoneRef"
    :class="mmDragNDropClassList"
    class="mm-drag-n-drop mm-flex mm-justify-content-center mm-flex-align-center mm-flex-column mm-pa-14"
    :data-cy="cyDragNDropZone"
  >
    <div v-if="isStatusDefault" class="mm-drag-n-drop--icon mm-mb-4">
      <m-m-icon icon="arrow-up-tray" />
    </div>

    <m-m-icon v-if="isStatusError" icon="error" class="mm-mb-4" />

    <input
      id="input-file"
      type="file"
      :accept="supportedFormatsAccept"
      class="input-file-hidden"
      data-cy="input-file-hidden"
      @input="onUploadFile"
    />

    <template v-if="isStatusDefault">
      <div class="mm-drag-n-drop--header">
        <span
          data-cy="button-click-to-upload"
          tabindex="0"
          @click="onClickToUpload"
          @keydown.enter="onClickToUpload"
        >
          Click to Upload
        </span>
        or drag and drop
      </div>
      <div class="mm-drag-n-drop--subheader">
        Supported formats: {{ supportedFormatsSubheader }}
      </div>
    </template>
    <template v-if="isStatusError">
      <div class="mm-drag-n-drop--subheader mm-mb-8">
        {{ errorMessage }}
      </div>
      <div class="mm-drag-n-drop--header">
        <span @click="onClickToUpload">Click to Re-upload</span> or drag and
        drop
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
.input-file-hidden {
  display: none;
}

.mm-drag-n-drop {
  border-width: 2px;
  border-style: dashed;
  border-radius: 8px;
  transition:
    border-color 0.3s,
    background-color 0.3s;
  user-select: none;

  &--dragging-over {
    * {
      pointer-events: none;
    }
  }

  &--status {
    &-default {
      background: #fafbfc;
      border-color: #d3d7dc;

      &.mm-drag-n-drop--dragging-over {
        border-color: #072e51;
        background-color: color.adjust(#072e51, $lightness: 80%);

        * {
          pointer-events: none;
        }
      }
    }

    &-error {
      background: #fffbfa;
      border-color: #f04438;

      .mm-drag-n-drop {
        &--subheader {
          font-size: 14px;
          color: #f04438;
        }
      }
    }
  }

  &--icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #eaecf0;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 #1018280d;
  }

  &--header {
    color: #6d7480;

    span {
      font-weight: 500;
      color: #072e51;
      cursor: pointer;
    }
  }

  &--subheader {
    font-size: 12px;
    color: #6d7480;
  }
}

.uploaded-file {
  padding: 8px;
  border-radius: 8px;
  background-color: #fafbfc;

  &--name {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #072e51;
  }
}
</style>
