<template>
  <div class="getting-started-steps-skeleton-loader mm-flex mm-flex-gap-10">
    <div class="getting-started-steps-skeleton-loader--icon"></div>
    <div class="getting-started-steps-content">
      <div class="skeleton skeleton--heading"></div>
      <div class="skeleton skeleton--description"></div>
      <div class="skeleton skeleton--button">
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--icon"></div>
      </div>
      <div class="skeleton skeleton--checkbox">
        <div class="skeleton skeleton--box"></div>
        <div class="skeleton skeleton--label"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.getting-started-steps-skeleton-loader {
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e6e8ec;
  border-radius: 8px;
  min-height: 91px;

  &--icon {
    width: 40px;
    height: 40px;
    padding: 20px;
    border-radius: 50%;
    background-size: 200% 100%;
    background: rgba(230, 230, 230, 0.5);
  }

  .getting-started-steps-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    .skeleton {
      animation: loading 1.5s infinite;

      &--heading {
        width: 60%;
        height: 20px;
        border-radius: 4px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(230, 230, 230, 0.5) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 200% 100%;
      }

      &--description {
        width: 90%;
        height: 15px;
        border-radius: 4px;
        margin-top: 8px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(230, 230, 230, 0.5) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 200% 100%;
      }

      &--button {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 140px;
        height: 36px;
        margin-top: 12px;
        padding: 10px;
        border-radius: 67px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(230, 230, 230, 0.5) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 200% 100%;

        .skeleton--icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(230, 230, 230, 0.5);
        }

        .skeleton--text {
          width: 70%;
          height: 16px;
          border-radius: 4px;
        }
      }

      &--checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;

        .skeleton--box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          background: rgba(230, 230, 230, 0.5);
        }

        .skeleton--label {
          width: 100px;
          height: 12px;
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(230, 230, 230, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
        }
      }
      @keyframes loading {
        0% {
          background-position: 200% 0;
        }

        100% {
          background-position: -200% 0;
        }
      }
    }
  }
}
</style>
