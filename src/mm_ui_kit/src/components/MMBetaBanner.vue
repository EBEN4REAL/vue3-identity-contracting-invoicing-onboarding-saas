<template>
  <div class="beta-banner">
    <m-m-icon width="20px" height="20px" stroke="red" icon="banner-info" />
    <div class="beta-banner-feedback">
      Help us improve, we’d love your feedback
      <m-m-link
        target="_blank"
        href="https://getveriam.com/feedback"
        color="warning"
        underline
        >here</m-m-link
      >
    </div>
  </div>
</template>
<style lang="scss">
.beta-banner {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  background-color: #fffcf5;
  color: #b54708;
  gap: 4px;
  border-bottom: 1px solid #fec84b;
  line-height: 12px;
  font-size: 14px;

  &-message,
  &-feedback {
    color: #b54708;
  }

  &-message {
    font-weight: 500;
  }

  &-feedback {
    gap: 6px;
  }

  @media (max-width: $breakpoint-md) {
    top: 8px;
    gap: 2px;
    font-size: 13px;

    &-message {
      font-weight: 500;
    }

    &-feedback {
      font-size: 13px;
    }
  }
}
</style>
