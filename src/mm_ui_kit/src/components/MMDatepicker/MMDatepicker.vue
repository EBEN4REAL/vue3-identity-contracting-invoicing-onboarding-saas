<script setup lang="ts">
import {
  computed,
  ComputedRef,
  nextTick,
  onUnmounted,
  PropType,
  Ref,
  ref,
  useAttrs,
  watch,
} from "vue";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import shortcuts from "./shortcuts";
import lang from "./lang";
import { TypeDateValue, TypeShortcut } from "./types";
import { TypePosition } from "../../types/types";
import dayjs from "dayjs";

const attrs = useAttrs();
const props = defineProps({
  errorsPosition: {
    type: String as PropType<TypePosition>,
    default: "relative",
  },
  appendToBody: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Array] as PropType<string | string[] | null>,
    default: "",
  },
  hoursCy: {
    type: String,
    default: "hours-cy",
  },
  minutesCy: {
    type: String,
    default: "minutes-cy",
  },
});
const emit = defineEmits(["update:modelValue"]);

const date: Ref<TypeDateValue> = ref(null);
const hours: Ref<string> = ref("");
const minutes: Ref<string> = ref("");
const open = ref(false);

let observer: IntersectionObserver | null = null;

const observeElement = () => {
  const datepickerPopupElement = document.querySelector(".mx-datepicker-main");
  if (datepickerPopupElement && observer) {
    observer.observe(datepickerPopupElement);
  }
};

const alignDatepickerPosition = (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    const { bottom } = entry.boundingClientRect;
    const datepickerBelowViewportOnPX = bottom - window.innerHeight;
    if (datepickerBelowViewportOnPX > 0) {
      document
        .querySelector(".mx-datepicker-main")
        .style.setProperty(
          "top",
          `${-datepickerBelowViewportOnPX + 40}px`,
          "important",
        );
    }
  }
};

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const popupClassList = computed(() => {
  const classList = [`mx-datepicker-popup--${attrs.popupSide || "left"}`];

  return classList.join(" ");
});

const isTypeDate: ComputedRef<boolean> = computed(() => attrs.type === "date");

const isTypeTime: ComputedRef<boolean> = computed(() => attrs.type === "time");

const isTypeDatetime: ComputedRef<boolean> = computed(
  () => attrs.type === "datetime",
);

const isRange = computed(() => attrs.range);

const datepickerRef: Ref<HTMLDivElement | null> = ref(null);

if (isTypeTime.value || !isRange.value) date.value = "";
else date.value = ["", ""];

const popupStyle = {
  width: "max-content",
};

const filteredShortcuts = computed(() => {
  const isShortcutsValidArray =
    Array.isArray(attrs["datepicker-shortcuts"]) &&
    attrs["datepicker-shortcuts"]?.length;
  return isShortcutsValidArray && attrs["range"] > 0
    ? shortcuts.filter((shortcut: TypeShortcut) =>
        attrs["datepicker-shortcuts"].includes(shortcut.text),
      )
    : undefined; // plugin requires this to be either value of undefined
});

const mmDatepickerClassList = computed(() => [
  "mm-datepicker",
  { "mm-datepicker--error": !!attrs.errors?.length },
]);

const mmMxDatepickerClassList = computed(() => [
  { "mx-datepicker--error": !!attrs.errors?.length },
]);

const mmDatepickerErrorsClassList = computed(() => [
  "mm-datepicker-errors bottom",
  `mm-datepicker-errors--position-${props.errorsPosition}`,
]);

const errorsFormatted = computed(() =>
  attrs?.errors
    ? attrs.errors.map((error) => ({
        validator: error.$validator,
        message: error.$message,
      }))
    : [],
);

const isTypeHasTime = computed(() => isTypeTime.value || isTypeDatetime.value);

const dropTimeOnCancel = () => {
  if (isTypeDatetime.value && date.value && typeof date.value === "string") {
    const timeWithoutDate = date.value.split(" ").pop();
    const [hh, mm] = timeWithoutDate
      ? timeWithoutDate.split(":")
      : ["00", "00"];
    hours.value = hh;
    minutes.value = mm;
  }
};

const formattedTime = () => {
  const hourAsInt = hours.value !== "" ? parseInt(hours.value) : 0;
  const minuteAsInt =
    minutes.value && minutes.value !== "" ? parseInt(minutes.value) : 0;

  const maxHours = 23;
  const maxMinutes = 59;
  if (hourAsInt > 23) hours.value = `${maxHours}`;
  if (hourAsInt <= 0) hours.value = "00";
  if (hours.value.length === 1) hours.value = `0${hours.value}`;
  if (hours.value.length > 2) hours.value = `${maxHours}`;
  if (minuteAsInt > 59) minutes.value = `${maxMinutes}`;
  if (minuteAsInt <= 0) minutes.value = "00";
  if (minutes.value.length === 1) minutes.value = `0${minutes.value}`;
  if (minutes.value.length > 2) minutes.value = `${maxMinutes}`;
  return `${hours.value}:${minutes.value}`;
};

const onConfirm = (confirmedDate: string) => {
  date.value = confirmedDate;
  if (isTypeDatetime.value) {
    const dateWithoutTime = confirmedDate.split(" ").slice(0, -1).join(" ");
    date.value = `${dateWithoutTime} ${formattedTime()}`;
  }
  if (isTypeTime.value) date.value = formattedTime();
  emit("update:modelValue", date.value);
};

const onCancel = () => {
  dropTimeOnCancel();
  open.value = false;
};

watch(
  () => date.value,
  (dateValue) => {
    emit("update:modelValue", dateValue);
  },
);

watch(
  () => open.value,
  async () => {
    if (open.value) {
      await nextTick(); // Wait until the DOM updates
      observer = new IntersectionObserver(alignDatepickerPosition, {
        root: null,
        threshold: 1.0,
      });
      observeElement(); // Start observing the newly rendered element
    } else observer.disconnect(); // Stop observing
  },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (typeof newValue === "string") {
      let hh, mm;
      if (isTypeDatetime.value) {
        newValue = dayjs(newValue).format("MMMM DD, YYYY HH:mm");
        const pattern = /^(\w+\s\d{1,2},\s\d{4})\s(\d{2}:\d{2})$/;
        const match = pattern.exec(newValue);
        if (match) {
          [hh, mm] = match[2] ? match[2].split(":") : ["00", "00"];
        }
      } else if (isTypeTime.value) {
        [hh, mm] = newValue.split(":");
      }

      if (hh && mm) {
        hours.value = hh;
        minutes.value = mm;
      }
      date.value = newValue;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div :class="mmDatepickerClassList">
    <date-picker
      v-bind="attrs"
      ref="datepickerRef"
      v-model:value="date"
      v-model:open="open"
      :lang="lang"
      :shortcuts="filteredShortcuts"
      :disabled="isDisabled"
      value-type="format"
      :popup-class="popupClassList"
      :popup-style="popupStyle"
      :class="mmMxDatepickerClassList"
      :show-second="false"
      :append-to-body="appendToBody"
      @confirm="onConfirm"
    >
      <template v-if="!isTypeDate" #footer>
        <div v-if="isTypeHasTime" class="timepicker d-flex align-end mm-mb-8">
          <m-m-input
            v-model="hours"
            label="Hours"
            placeholder="00"
            width="86px"
            inputmode="numeric"
            type="number"
            text-align="center"
            :data-cy="props.hoursCy"
          />
          <div class="time-separator mm-mx-5 mm-mb-4">:</div>
          <m-m-input
            v-model="minutes"
            label="Minutes"
            placeholder="00"
            width="86px"
            inputmode="numeric"
            type="number"
            text-align="center"
            :data-cy="props.minutesCy"
          />
          <div class="time-format mm-flex align-center mm-ml-6 mm-mb-5">
            <m-m-icon icon="clock" width="18px" height="18px" />
            24 H
          </div>
        </div>
        <div class="mm-flex mm-flex-align-center">
          <div
            v-if="Array.isArray(date)"
            class="footer-inputs mm-flex mm-flex-align-center mm-flex-gap-6 mm-mr-8"
          >
            <m-m-input v-model="date[0]" />
            <div>–</div>
            <m-m-input v-model="date[1]" />
          </div>
          <m-m-button
            variant="outlined"
            size="small"
            class="mm-mr-6 mm-ml-auto mm-w-10"
            @click="onCancel"
          >
            Cancel
          </m-m-button>
        </div>
      </template>
    </date-picker>
    <ul :class="mmDatepickerErrorsClassList">
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-datepicker-errors-item"
        :data-cy="`mm-datepicker-error-${error.validator}-text`"
      >
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.footer-inputs {
  width: 288px;
}
</style>

<style lang="scss">
.mm-datepicker {
  position: relative;

  &--error {
    .mm-input-control,
    .mm-input-control:focus {
      box-shadow: none;
      border-color: #d92d20;
    }
  }

  &-errors {
    list-style: none;
    &.bottom {
      bottom: 0;
    }

    &--position {
      &-static {
        position: static;
      }
      &-relative {
        position: relative;
      }
      &-absolute {
        position: absolute;
      }
      &-fixed {
        position: fixed;
      }
    }

    &-item {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 6px;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px; /* 150% */
      color: #d92d20;
    }
  }

  .mx-zoom-in-down-enter-active,
  .mx-zoom-in-down-leave-active,
  .mx-zoom-in-down-enter-to,
  .mx-zoom-in-down-leave-to {
    transition: 0s !important;
    transform-origin: unset !important;
  }
}

.mx-datepicker--error {
  .mx-input-wrapper .mx-input {
    box-shadow: none;
    border-color: #d92d20;
  }
}

.mx-datepicker,
.mx-date-time {
  width: 100%;
  height: auto;

  &.disabled {
    cursor: not-allowed;

    input {
      background: #f9fafb;
      color: #6c737f;

      &::placeholder {
        color: #d2d6db;
      }
    }
  }
}

.mx-table {
  thead tr {
    margin-bottom: 4px;
  }
  tbody tr {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.mx-datepicker-popup {
  transform: scale(1) translateY(0) !important;
  top: 50px !important;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -2px rgba(16, 24, 40, 0.03),
    0px 12px 16px -4px rgba(16, 24, 40, 0.08);

  &--left {
    left: auto !important;
    right: 0 !important;
  }

  &--right {
    left: 0 !important;
    right: auto !important;
  }
}

.mx-input-wrapper {
  .mx-input {
    display: block;
    width: 100%;
    height: auto;
    padding: 7px 14px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    color: #101828;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
    outline: none;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
  }
}

.mx-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.mx-datepicker-sidebar {
  padding: 12px 16px;
  float: none;
  width: auto;
}

.mx-btn-shortcut {
  width: 100%;
  min-width: 150px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #344054;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 4px;

  &:hover {
    background-color: #f3f4f6;
    color: #344054;
  }
}

.mx-btn-icon-left,
.mx-btn-icon-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;

  .mx-icon-left,
  .mx-icon-right {
    display: block;
    position: relative;
    width: 10px;
    height: 10px;
  }

  .mx-icon-left:before,
  .mx-icon-right:before {
    position: absolute;
    display: block;
    width: 12px;
    height: 12px;
    border-color: #667085;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }

  &:hover {
    .mx-icon-left:before,
    .mx-icon-right:before {
      border-color: #072e51;
    }
  }
}

.mx-btn-icon-left {
  order: 1;
}

.mx-calendar-header-label {
  order: 2;
  display: block;
  width: 100%;

  .mx-btn-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #344054;
  }
}

.mx-btn-icon-right {
  order: 3;
}

.mx-datepicker-sidebar + .mx-datepicker-content {
  margin-left: 0;
}

.mx-datepicker-main {
  display: flex;
  color: #344054;

  * {
    font-family: Haffer, sans-serif;
    font-size: 14px;
  }

  .mx-calendar-panel-date {
    .mx-btn-icon-double-left,
    .mx-btn-icon-double-right {
      display: none;
    }
  }

  .mx-calendar-panel-month,
  .mx-calendar-panel-year {
    .mx-btn-icon-double-left,
    .mx-btn-icon-double-right {
      &:hover {
        &:before,
        &:after {
          border-color: red;
          //border-color: #072e51;
        }
      }
    }
  }

  .mx-calendar-panel-month,
  .mx-calendar-panel-year {
    .mx-calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .mx-btn-icon-double-left {
      order: 1;
    }

    .mx-calendar-header-label {
      order: 2;
    }

    .mx-btn-icon-double-right {
      order: 3;
    }
  }

  .mx-table {
    table-layout: auto;
  }

  .mx-calendar {
    width: auto;
    padding: 18px 22px;
  }

  .mx-calendar-content {
    height: auto;

    .mx-table-date {
      td,
      th {
        width: 38px;
        height: 38px;
      }

      th {
        font-size: 14px;
        font-weight: 500;
        line-height: 18.89px;
        text-align: center;
      }

      .today {
        color: #344054;
      }
    }

    .cell {
      position: relative;
      border-radius: 50%;
      font-size: 14px;

      &.hover-in-range,
      &.in-range {
        background-color: #f9fafb;
        font-weight: 500;
        border-radius: 0;
        color: #344054;

        &:first-child {
          border-radius: 50% 0 0 50%;
        }
        &:last-child {
          border-radius: 0 50% 50% 0;
        }

        & + .active {
          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 19px;
            height: 38px;
            background: radial-gradient(
              circle at right,
              rgba(0, 0, 0, 0) 70%,
              #f9fafb 72%
            );
          }
        }
      }

      &.not-current-month {
        color: #667085;
      }

      &.active {
        background-color: #072e51;
        color: #ffffff;

        &:has(+ .in-range),
        &:has(+ .hover-in-range) {
          &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 19px;
            height: 38px;
            background: radial-gradient(
              circle at left,
              rgba(0, 0, 0, 0) 70%,
              #f9fafb 72%
            );
          }
        }
      }

      &:hover:not(.cell.active) {
        background-color: #f9fafb;
        font-weight: 500;
        color: #344054;
      }

      &.hover-in-range + .cell:not(.cell.hover-in-range) {
        border-radius: 0 50% 50% 0;
      }
    }

    .mx-table-month,
    .mx-table-year {
      tr {
        display: flex;
        flex-direction: column;

        .cell {
          border-radius: 8px;
          padding: 8px 12px;

          &:hover {
            background-color: #f3f4f6;
            color: #344054;
          }
        }
      }
    }
  }

  .mx-datepicker-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 16px;
  }

  .mx-datepicker-btn-confirm {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #ffffff;
    padding: 6px 32px;
    border: none;
    border-radius: 36px;
    background-color: #072e51;
    transition: background-color 0.3s;
    will-change: background-color;

    &:hover {
      background-color: rgba(7, 46, 81, 0.9);
    }
  }
}

.mx-scrollbar-wrap {
  &::-webkit-scrollbar {
    display: none;
  }
}

.mx-time {
  display: none;

  & + .mx-datepicker-footer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .timepicker {
      grid-area: 1 / 1 / 2 / 3;
    }
  }
}

.mx-date-time {
  & + .mx-datepicker-footer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .timepicker {
      grid-area: 1 / 1 / 2 / 3;
    }
  }
}

.time-separator {
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
}

.time-format {
  font-size: 14px;
  font-weight: 500;
  color: #6d7480;
}
</style>
