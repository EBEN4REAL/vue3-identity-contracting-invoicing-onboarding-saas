import { OrganizationUserImportRead } from "../../../../src/iam/iam.types";

export const importing: {
  [key: string]: OrganizationUserImportRead;
} = {
  "001": {
    id: "fb316012-64d3-49df-a649-66a408938bb9",
    user_id: "8247a44f-12cc-4520-b7e4-e908717cae01",
    file_name: "users_import.csv",
    users_count: 2,
    users_created: null,
    status: "PENDING",
  },
  "001-P": {
    id: "fb316012-64d3-49df-a649-66a408938bb9",
    user_id: "8247a44f-12cc-4520-b7e4-e908717cae01",
    file_name: "users_import.csv",
    users_count: 2,
    users_created: null,
    status: "PENDING",
  },
  "001-S": {
    id: "fb316012-64d3-49df-a649-66a408938bb9",
    user_id: "8247a44f-12cc-4520-b7e4-e908717cae01",
    file_name: "users_import.csv",
    users_count: 2,
    users_created: 2,
    status: "SUCCESS",
  },
  "001-F": {
    id: "fb316012-64d3-49df-a649-66a408938bb9",
    user_id: "8247a44f-12cc-4520-b7e4-e908717cae01",
    file_name: "users_import.csv",
    users_count: 2,
    users_created: null,
    status: "FAILURE",
  },
};
