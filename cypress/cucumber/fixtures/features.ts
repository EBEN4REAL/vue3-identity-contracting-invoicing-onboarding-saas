type Feature = {
  name: string;
  enabled: boolean;
  variant: {
    name: string;
    enabled: boolean;
    feature_enabled: boolean;
    featureEnabled: boolean;
  };
};

const FEATURES: Feature[] = [
  {
    name: "login_history",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "account_security",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "activate_license",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "organization_selection",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "organization_selection_dashboard",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "sso",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "totp",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "org_access_licenses",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "org_subscriptions",
    enabled: true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
];

export default FEATURES;
