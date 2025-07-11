import { PolicyReadWithOwnerName } from "../../../../src/policies/policies.types";
import { TableResponse } from "../../../../src/mm_ui_kit/src/types/table.types";
import {
  PolicyCategoryReadLimited,
  UxBehavior,
} from "../../../../src/service-providers/ConfigurationTabs/Policies/policies.types";

export const policies: {
  [key: string]: TableResponse<PolicyReadWithOwnerName>;
} = {
  "001": {
    offset: 0,
    limit: 10,
    size: 2,
    total: 2,
    results: [
      {
        id: "001",
        service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        owner_name: "Org 001",
        category_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        audit_level: "string",
        name: "Policy 1",
        description: "Policy 1 description",
        outcome: "string",
        return_value: "",
        troubleshoot: true,
        troubleshoot_end: "2024-04-04T14:41:33.077Z",
        category: {
          id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
          name: "string",
          ux_behaviour_yaml: "string",
        },
        filters: ["4a6f01d0-f3c6-4923-ad98-112d6d97355b"],
      },
      {
        id: "002",
        service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        category_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        audit_level: "string",
        name: "Policy 2",
        description: "Policy 2 description",
        outcome: "string",
        return_value: "",
        troubleshoot: true,
        troubleshoot_end: "2024-04-04T14:41:33.077Z",
        category: {
          id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
          name: "string",
          ux_behaviour_yaml: "string",
        },
        filters: ["4a6f01d0-f3c6-4923-ad98-112d6d97355b"],
      },
    ],
  },
  "002": {
    offset: 0,
    limit: 10,
    size: 1,
    total: 1,
    results: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
        service_provider_id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
        owner_name: "Org 001",
        category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
        audit_level: "string",
        name: "Policy 2",
        description: "Policy 2 description",
        outcome: "string",
        return_value: "",
        troubleshoot: true,
        troubleshoot_end: "2024-04-04T14:41:33.077Z",
        category: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
          name: "string",
          ux_behaviour_yaml: "string",
        },
        filters: ["4a6f01d0-f3c6-4923-ad98-112d6d97355b"],
      },
    ],
  },
  "003": {
    offset: 0,
    limit: 10,
    size: 1,
    total: 1,
    results: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
        service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        owner_name: "Org 001",
        category_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        audit_level: "string",
        name: "Policy 3",
        description: "Policy 3 description",
        outcome: "string",
        return_value: "",
        troubleshoot: true,
        troubleshoot_end: "2024-04-04T14:41:33.077Z",
        category: {
          id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
          name: "string",
          ux_behaviour_yaml: "string",
        },
        filters: ["4a6f01d0-f3c6-4923-ad98-112d6d97355b"],
      },
    ],
  },
  "004": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "3e8f9b29-8927-4a50-8aee-38701333402e",
        owner_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        owner_name: "Org 001",
        service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        assigned_by_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        resource_owner_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        type_id: "251cfcd5-06ab-4731-abed-21a43655d4d0",
        valid_from: null,
        valid_until: null,
        optional: false,
        agreement_id: null,
        name: "Policy #1",
        description: "",
      },
    ],
    size: 2,
    total: 2,
  },
  "no-results": {
    offset: 0,
    limit: 10,
    results: [],
    size: 0,
    total: 0,
  },
};

export const allPolicies: {
  [key: string]: TableResponse<PolicyReadWithOwnerName>;
} = {
  "001": {
    offset: 0,
    limit: 10,
    size: 1,
    total: 1,
    results: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        owner_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        owner_name: "Org 001",
        assigned_by_id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        resource_owner_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        type_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        valid_from: "2024-04-23T10:42:43.944Z",
        valid_until: "2024-04-23T10:42:43.944Z",
        optional: false,
        agreement_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "Policy name",
        policy_assignment: "O",
        assigned_id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        organization_id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        assigned_on: "2024-04-23T10:42:43.944Z",
      },
    ],
  },
  "002": {
    offset: 0,
    limit: 10,
    size: 1,
    total: 1,
    results: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        owner_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        assigned_by_id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        resource_owner_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        type_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        valid_from: "2024-04-23T10:42:43.944Z",
        valid_until: "2024-04-23T10:42:43.944Z",
        optional: false,
        agreement_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "Policy name 2",
        policy_assignment: "OU",
        assigned_id: "1edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        organization_id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        assigned_on: "2024-04-23T10:42:43.944Z",
      },
    ],
  },
  "003": {
    offset: 0,
    limit: 10,
    size: 1,
    total: 1,
    results: [],
  },
};

export const policyUxCategories: { [key: string]: PolicyCategoryReadLimited } =
  {
    "001": {
      id: "c596a0df-e813-41ab-a735-461d713b9af1",
      name: "Policy",
    },
    "002": {
      id: "a7a82589-c6ae-481d-b87c-16a7009b0d8f",
      name: "Role",
    },
  };

export const policyUx: UxBehavior[] = [
  {
    entity: "policy_name",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "policy_description",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "decision_row",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "audit_level_row",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "return_value",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "troubleshoot_check",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "troubleshoot_end",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "category",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "child_policies_tab",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
  {
    entity: "filters_tab",
    show: true,
    editable: true,
    default_value: null,
    label: null,
  },
];
