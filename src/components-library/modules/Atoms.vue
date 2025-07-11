<script setup lang="ts">
import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
</script>

<template>
  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Badges:</h3>
    <m-m-badge :status="BadgeTypes['Active']"></m-m-badge>
    <m-m-badge :status="BadgeTypes['Inactive']"></m-m-badge>
    <m-m-badge :status="BadgeTypes['Invited']"></m-m-badge>
    <m-m-badge :status="BadgeTypes['Cancelled']"></m-m-badge>
    <m-m-badge :status="BadgeTypes['Warning']"></m-m-badge>
    <br />
    <m-m-badge :status="BadgeTypes['Active']" indicator></m-m-badge>
    <m-m-badge :status="BadgeTypes['Inactive']" indicator></m-m-badge>
    <m-m-badge :status="BadgeTypes['Invited']" indicator></m-m-badge>
    <m-m-badge :status="BadgeTypes['Cancelled']" indicator></m-m-badge>
    <m-m-badge :status="BadgeTypes['Warning']" indicator></m-m-badge>
    <br />
    <m-m-badge :status="BadgeTypes['Active']" text="custom text"></m-m-badge>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Alerts:</h3>
    <div class="mm-flex mm-flex-column mm-flex-gap-4">
      <m-m-alert :status="AlertTypes['Error']">Error Message</m-m-alert>
      <m-m-alert :status="AlertTypes['Warning']">Warning Message</m-m-alert>
      <m-m-alert :status="AlertTypes['Info']">Info Message</m-m-alert>
    </div>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Links:</h3>
    <div class="mm-flex mm-flex-gap-6">
      <m-m-link color="primary">Primary Link</m-m-link>
      <m-m-link color="secondary">Secondary Link</m-m-link>
    </div>
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">
      Text Ellipsis:
    </h3>
    <m-m-text-ellipsis max-width="300px"
      >Lorem ipsum dolor sit amet consectetur, adipisicing
      elit.</m-m-text-ellipsis
    >
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Icons:</h3>
    <m-m-icon icon="shield-check"></m-m-icon>
    <m-m-icon icon="shield-check" width="30px" height="30px"></m-m-icon>
    <m-m-icon icon="shield-check" width="40px" height="40px"></m-m-icon>
  </div>
</template>

<style scoped lang="scss"></style>
