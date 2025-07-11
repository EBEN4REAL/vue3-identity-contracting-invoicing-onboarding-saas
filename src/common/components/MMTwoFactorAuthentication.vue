<script setup lang="ts">
import QRCodeVue3 from "qrcode-vue3";
import { computed, ComputedRef, ref, Ref } from "vue";
import { copyToClipboard } from "~/mm_ui_kit/src/helpers/copyToClipboard";
import { showToast } from "~/mm_ui_kit/src/helpers/showToast";

const props = defineProps({
  qrUrl: {
    type: String,
    default: "",
  },
  inputCodeWidth: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["submit"]);

const code: Ref<string> = ref("");
const displayToast = ref(false);
const displayToastTimer: number | null = null;
const toastMessage = "Key has been copied to your clipboard";

const secret: ComputedRef<string> = computed(() => {
  try {
    const type = props.qrUrl.startsWith("otpauth://totp/") ? "totp" : "hotp";

    const prefixRemoved = props.qrUrl.slice(`otpauth://${type}/`.length);

    const params = new URLSearchParams(prefixRemoved.split("?")[1]);

    return params.get("secret") || "Invalid otpauth url";
  } catch (err) {
    return "Invalid otpauth url";
  }
});

const copyKey = () => {
  copyToClipboard(secret.value);
  showToast(displayToast, displayToastTimer);
};

defineExpose({
  code,
});
</script>

<template>
  <div class="mm-flex mm-flex-column">
    <div class="mm-page-item-value mm-mb-2">
      1. Download an authenticator app of your choice
    </div>
    <div class="mm-page-options-hint">
      Install <span class="mm-fw-500">Google authenticator</span>,
      <span class="mm-fw-500">Microsoft authenticator</span> or
      <span class="mm-fw-500">Authy</span> on your phone.
    </div>
    <m-m-divider class="mm-my-12" />
    <div class="mm-page-item-value mm-mb-2">2. Scan QR code</div>
    <div class="mm-page-options-hint mm-mb-10">
      Open the authentication app and scan the QR code using your phone’s
      camera.
    </div>
    <div class="mm-flex mm-align-items-center mm-authentication-code">
      <m-m-card class="mm-pa-15" data-cy="qr-code">
        <QRCodeVue3
          :width="216"
          :height="216"
          :dots-options="{
            type: 'squares',
            color: '#000000',
          }"
          :corners-square-options="{ type: 'square', color: '#000000' }"
          :value="props.qrUrl"
        />
      </m-m-card>
      <div class="mm-page-options-hint mm-pa-8 mm-my-auto">
        Can’t scan the QR?<br />
        Copy and paste the key in your authenticator app.
        <div class="mm-flex mm-flex-align-center mm-flex-gap-2 mm-mt-4">
          <span class="mm-fw-500" data-cy="secret">{{ secret }}</span>
          <m-m-link
            color="blue-dim"
            data-cy="copy-key"
            text-align="left"
            @click.prevent="copyKey"
          >
            <m-m-icon icon="clipboard" width="16" height="16" class="mm-mr-2" />
          </m-m-link>
        </div>
      </div>
    </div>
    <m-m-divider class="mm-my-12" />
    <div class="mm-page-item-value mm-mb-10">3. Login with your code</div>
    <m-m-input
      v-model="code"
      label="Enter 6-digit code"
      placeholder="123456"
      :width="inputCodeWidth"
      cy="input-6-digit-code"
      @keyup.enter="emit('submit')"
    />
    <m-m-alert
      v-if="displayToast"
      status="success"
      class="success-copy-toast mm-mt-12"
      cy="success-copy-toast"
      :is-closable="false"
    >
      {{ toastMessage }}
    </m-m-alert>
  </div>
</template>

<style scoped lang="scss">
.success-copy-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 528px;
}
/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-authentication-code {
    flex-direction: column;
  }
  .mm-card {
    align-self: center;
  }
  .mm-page-options-hint.mm-pa-15 {
    padding: 25px 0 0;
  }
  .success-copy-toast {
    width: calc(100% - 20px);
    right: 10px;
    bottom: 10px;
    background: #e8f1f4;
  }
}
</style>
