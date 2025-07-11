import { WelcomeComponentsRead } from "../../../../src/onboarding/onboarding.types";

export const onboardingWelcomeSteps: { [key: string]: WelcomeComponentsRead } =
  {
    "001-no-step-completed": {
      components: [
        {
          component: "InviteYourColleagues",
          completed: false,
        },
        {
          component: "SetupOrganizationStructure",
          completed: false,
        },
        {
          component: "ViewLicensesAndPolicies",
          completed: false,
        },
      ],
      completed: false,
      completed_percentage: 0,
    },
    "002-first-step-completed": {
      components: [
        {
          component: "InviteYourColleagues",
          completed: true,
        },
        {
          component: "SetupOrganizationStructure",
          completed: false,
        },
        {
          component: "ViewLicensesAndPolicies",
          completed: false,
        },
      ],
      completed: false,
      completed_percentage: 33,
    },
    "003-second-step-completed": {
      components: [
        {
          component: "InviteYourColleagues",
          completed: true,
        },
        {
          component: "SetupOrganizationStructure",
          completed: true,
        },
        {
          component: "ViewLicensesAndPolicies",
          completed: false,
        },
      ],
      completed: false,
      completed_percentage: 66,
    },
    "004-third-step-completed": {
      components: [
        {
          component: "InviteYourColleagues",
          completed: true,
        },
        {
          component: "SetupOrganizationStructure",
          completed: true,
        },
        {
          component: "ViewLicensesAndPolicies",
          completed: true,
        },
      ],
      completed: true,
      completed_percentage: 100,
    },
  };

export const userWelcomeComponents = {
  "001-welcome-component": {
    name: "ConnectYourApplication",
  },
  "002-welcome-component": {
    name: "ConfigureAccessRequirements",
  },
  "003-welcome-component": {
    name: "IntegrateAndGoLive",
  },
  "004-welcome-component": {
    name: "AddYourCustomers",
  },
  "005-welcome-component": {
    name: "SetupYourOrganization",
  },
  "006-welcome-component": {
    name: "InviteYourColleagues",
  },
  "007-welcome-component": {
    name: "SetupOrganizationStructure",
  },
  "008-welcome-component": {
    name: "ViewLicensesAndPolicies",
  },
};
