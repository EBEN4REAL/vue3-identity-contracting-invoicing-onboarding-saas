<script setup lang="ts">
import { computed, PropType, Ref, ref } from "vue";
import { PasswordRequirementExtended } from "~/iam/iam.types";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  requirements: {
    type: Array as PropType<PasswordRequirementExtended[]>,
    default: () => [],
  },
  id: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array,
    default: () => [],
  },
  hideAsterisk: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "password",
  },
});

const emit = defineEmits(["focus", "update:modelValue", "submit"]);

const fieldPasswordType: Ref<string> = ref("password");
const inputRef: Ref<HTMLInputElement | null> = ref(null);

const isDirty: Ref<boolean> = ref(false);
//const isFocused: Ref<boolean> = ref(false);
const fieldPasswordIcon = computed(() =>
  fieldPasswordType.value === "password" ? "eye" : "eye-slash",
);

const classList = computed(() => [
  "mm-password",
  {
    "mm-password-error": props.errors?.length,
  },
]);
// const controlClassList = computed(() => [
//   "mm-password-control",
//   {
//     "mm-password-control-focus": isFocused.value,
//   },
// ]);

const focusInput = () => {
  inputRef.value?.focus();
};

const isRequirementMet = (requirement: PasswordRequirementExtended) => {
  return !props.errors?.some((error) => error.$validator === requirement.name);
};

const onClickAppend = () => {
  fieldPasswordType.value =
    fieldPasswordType.value === "password" ? "text" : "password";
};

const onFocus = () => {
  emit("focus");
};

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};

const setIsDirty = () => {
  isDirty.value = true;
};

// const toggleFocus = () => {
//   isFocused.value = true;
// };

// const disableFocus = () => {
//   isFocused.value = false;
// };

defineExpose({ focusInput });
</script>

<template>
  <div :class="classList" :data-cy="cy">
    <div
      :class="[
        'mm-password-label',
        { 'mm-password-label--required': required && !hideAsterisk },
      ]"
    >
      {{ label }}
    </div>
    <div class="mm-password-wrapper mm-mb-4">
      <input
        :id="id"
        ref="inputRef"
        :value="props.modelValue"
        :type="fieldPasswordType"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        data-cy="input"
        class="mm-password-control"
        @input="onInput"
        @input.once="setIsDirty"
        @focus="onFocus"
        @keyup.enter="emit('submit')"
      />
      <m-m-icon
        :icon="fieldPasswordIcon"
        width="16px"
        height="16px"
        data-cy="appended-icon"
        class="mm-password-icon-appended"
        @click="onClickAppend"
      />
    </div>
    <ul class="mm-password-requirements mm-flex mm-flex-column mm-flex-gap-3">
      <li
        v-for="req in requirements"
        :key="req.name"
        class="mm-password-requirements-item"
        :data-cy="`mm-password-requirement-${req.name}-text`"
      >
        <div
          class="icon-wrapper mm-flex mm-flex-justify-center mm-flex-align-center mm-mr-4"
        >
          <template v-if="isDirty">
            <m-m-icon
              v-if="isRequirementMet(req)"
              icon="check-circle-outline-green"
              width="20px"
              height="20px"
              class="icon"
            />
            <m-m-icon
              v-else
              icon="x-circle-outline-red"
              width="20px"
              height="20px"
              class="icon"
            />
          </template>
          <div v-else class="initial-mark" />
        </div>
        <div class="text">{{ req.message }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.mm-password {
  // &:focus {
  //   outline: none;
  // }
  &-control {
    width: 100%;
    padding: 8px 14px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    color: #101828;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
    outline: none;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    &::placeholder {
      color: #667085;
    }

    &:focus {
      border-color: #384250;
      box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
    }
  }

  &-wrapper {
    position: relative;
  }

  &-label {
    text-align: left;
    color: #384250;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 6px;

    &--required {
      &::after {
        content: "*";
        margin-left: 2px;
        color: #f04438;
      }
    }
  }

  &-icon-appended {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 14px;
    margin: auto;
    cursor: pointer;
  }

  &-button-appended {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 14px;
    margin: auto;
    cursor: pointer;
  }

  &-icon-prepended {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 14px;
    margin: auto;
    cursor: pointer;

    & + .mm-password-control {
      padding-left: 40px;
    }
  }

  &-error {
    .mm-password-control,
    .mm-password-control:focus {
      box-shadow: none;
      border-color: #d92d20;
    }
  }

  &-requirements {
    list-style: none;

    &-item {
      display: flex;
      position: relative;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px; /* 150% */
      transition: color 0.3s;
      will-change: color;

      .initial-mark {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #000;
      }

      .icon-wrapper {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .text {
        padding-top: 1px;
      }
    }
  }
}
</style>
