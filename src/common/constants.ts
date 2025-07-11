import {
  OrganizationUserJobRoleMap,
  OrganizationUserStatusMap,
} from "~/iam/iam.types";
import { OrganizationUserStatus } from "~/users/users.types";

export const RANGE_OF_EMPLOYEES = [
  { title: "1-10", value: "1-10" },
  { title: "11-50", value: "11-50" },
  { title: "51-200", value: "51-200" },
  { title: "201-999", value: "201-999" },
  { title: "1000+", value: "1000+" },
];

export const INDUSTRIES = [
  { title: "SaaS", value: "SAAS" },
  { title: "ESG", value: "ESG" },
  { title: "Commerce", value: "COMMERCE" },
  { title: "Healthcare", value: "HEALTHCARE" },
  { title: "Financial Services", value: "FINANCIAL_SERVICES" },
  { title: "Digital Products", value: "DIGITAL_PRODUCTS" },
  { title: "Other", value: "OTHER" },
];

export const JOB_ROLES = [
  { title: "Marketing", value: "MARKETING" },
  { title: "Sales", value: "SALES" },
  { title: "Development", value: "DEVELOPMENT" },
  { title: "Product", value: "PRODUCT" },
  { title: "Customer Support", value: "CUSTOMER_SUPPORT" },
  { title: "Executive Management", value: "EXECUTIVE_MANAGEMENT" },
  { title: "Finance", value: "FINANCE" },
];

export const JOB_ROLES_MAP: OrganizationUserJobRoleMap = JOB_ROLES.reduce(
  (acc, cur) => {
    acc[cur.value] = cur.title;
    return acc;
  },
  {},
);

export const ORGANIZATION_USER_STATUS_MAP: OrganizationUserStatusMap = {
  [OrganizationUserStatus.PENDING]: "invited",
  [OrganizationUserStatus.ACCEPTED]: "active",
  [OrganizationUserStatus.REJECTED]: "inactive",
};

// Items per page in table
export const ITEMS_PER_PAGE: string[] = ["10", "20", "30", "40", "50"];

export const RESOURCE_ATTRIBUTES_FORMAT_OPTIONS = [
  { title: "Text", value: "S" },
  { title: "Number", value: "I" },
  { title: "Decimal", value: "D" },
  { title: "Yes/No", value: "B" },
];

export const SELECT_OPTIONS_MAP = new Map([
  ["S", "Text"],
  ["I", "Number"],
  ["D", "Decimal"],
  ["B", "Yes/No"],
]);

export const SOCIAL_ICONS = {
  G: "google",
  M: "microsoft",
};

export const LAST_LOGIN_ACCESS_MAP = {
  A: "Allowed",
  D: "Denied",
};

export const HISTORY_LOGIN_ACCESS_MAP = {
  A: "Granted",
  F: "Denied",
};

export const HISTORY_LOGIN_OUTCOME_MAP = {
  S: "Success",
  P: "Pending",
  F: "Failed",
};
