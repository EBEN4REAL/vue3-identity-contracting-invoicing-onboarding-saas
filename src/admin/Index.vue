<script setup lang="ts">
import { sectionIcons } from "~/mm_ui_kit/src/helpers/iconsMap";
</script>

<template>
  <m-m-overview-page resource-id="admin" :show-config-banner="false">
    <m-m-card class="mm_admin">
      <m-m-app-navigation-item
        id="admin-agreement-types"
        to="/sc/admin/agreement-types"
        :icon-prepend="sectionIcons['plans']"
        icon-prepend-size="24px"
        :label="$t('admin_agreement_types.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-applications"
        to="/sc/admin/applications"
        :icon-prepend="sectionIcons['applications']"
        icon-prepend-size="24px"
        :label="$t('admin_applications.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-attribute-types"
        to="/sc/admin/attribute-types"
        :icon-prepend="sectionIcons['attributeTypes']"
        icon-prepend-size="24px"
        :label="$t('admin_attribute_types.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-configs"
        to="/sc/admin/configs"
        :icon-prepend="sectionIcons['configuration']"
        icon-prepend-size="24px"
        :label="$t('admin_configs.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-legal-document-types"
        to="/sc/admin/legal-document-types"
        :icon-prepend="sectionIcons['legalDocs']"
        icon-prepend-size="24px"
        :label="$t('admin_legal_document_types.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-login-attempts"
        to="/sc/admin/login-attempts"
        :icon-prepend="sectionIcons['security']"
        icon-prepend-size="24px"
        :label="$t('admin_login_attempts.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-logs"
        to="/sc/admin/logs"
        :icon-prepend="sectionIcons['logs']"
        icon-prepend-size="24px"
        :label="$t('admin_logs.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-organizations"
        to="/sc/admin/organizations"
        :icon-prepend="sectionIcons['allOrganizations']"
        icon-prepend-size="24px"
        :label="$t('admin_organizations.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-policies"
        to="/sc/admin/policies"
        :icon-prepend="sectionIcons['accessLicense']"
        icon-prepend-size="24px"
        :label="$t('admin_policies.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-policy-types"
        to="/sc/admin/policy-types"
        :icon-prepend="sectionIcons['policies']"
        icon-prepend-size="24px"
        :label="$t('admin_policy_types.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-section-types"
        to="/sc/admin/section-types"
        :icon-prepend="sectionIcons['settings']"
        icon-prepend-size="24px"
        :label="$t('admin_section_types.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-service-providers"
        to="/sc/admin/service-providers"
        :icon-prepend="sectionIcons['allServiceProviders']"
        icon-prepend-size="24px"
        :label="$t('admin_service_providers.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-users"
        to="/sc/admin/users"
        :icon-prepend="sectionIcons['allUsers']"
        icon-prepend-size="24px"
        :label="$t('admin_users.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-wizard-types"
        to="/sc/admin/wizard-types"
        :icon-prepend="sectionIcons['settings']"
        icon-prepend-size="24px"
        :label="$t('admin_wizard_types.nav_label')"
      />
      <m-m-app-navigation-item
        id="admin-wizards"
        to="/sc/admin/wizards"
        :icon-prepend="sectionIcons['configuration']"
        icon-prepend-size="24px"
        :label="$t('admin_wizards.nav_label')"
      />
    </m-m-card>
  </m-m-overview-page>
</template>

<style scoped lang="scss">
.mm_admin {
  display: grid;
  padding: 24px;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 16px;
  column-gap: 24px;
}
</style>
