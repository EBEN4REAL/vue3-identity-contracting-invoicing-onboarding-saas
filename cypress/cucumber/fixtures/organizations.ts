import { OrganizationRead } from "~/iam/iam.types";

const organizations: { [key: string]: OrganizationRead } = {
  "000": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    number_of_employees_range: "1-10",
    industry: "SAA",
  },
  "001": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    number_of_employees_range: "1-10",
    industry: "SAA",
    domains: [
      {
        auto_join_enabled: true,
        name: "example.com",
      },
    ],
    created_date: "2024-03-05T14:20:42.337798",
  },
  "001-with-domains": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    number_of_employees_range: "1-10",
    industry: "SAA",
    domains: [
      {
        auto_join_enabled: true,
        name: "example.com",
      },
    ],
  },
  "001-updated-name": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "New organization name",
    number_of_employees_range: "1-10",
    industry: "SAA",
  },
  "001-updated-industry": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    number_of_employees_range: "1-10",
    industry: "HEA",
  },
  "001-updated-number_of_employees_range": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    number_of_employees_range: "201-999",
    industry: "COM",
  },
  "001-no-users": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001 No users",
    number_of_employees_range: "1-10",
    industry: "FIN",
  },
  "005": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 005",
    number_of_employees_range: "1-10",
    industry: "FIN",
  },
  "005-non-deletable": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 005 non deletable",
    number_of_employees_range: "1-10",
    industry: "FIN",
  },
  "006-deletable": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 006 deletable",
    number_of_employees_range: "1-10",
    industry: "FIN",
  },
  "011-no-parent": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001 No users",
    number_of_employees_range: "1-10",
    industry: "DIG",
  },
  "011": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 011",
    number_of_employees_range: "1-10",
    industry: "OTH",
  },
  "011-no-users": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 011 No users",
    number_of_employees_range: "1-10",
    industry: "SAA",
  },
  "111": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 111",
    number_of_employees_range: "1-10",
    industry: "SAA",
  },
  "002": {
    id: "8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591",
    name: "Org 002",
    number_of_employees_range: "1-10",
    industry: "SAA",
    domains: [
      {
        auto_join_enabled: true,
        name: "example.com",
      },
    ],
    created_date: "2024-03-06T14:20:42.337798",
  },
  UpdatedOrganization001: {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    number_of_employees_range: "201-999",
    industry: "COM",
  },
  "004": {
    name: "Org 004",
    users: [
      {
        user_id: "d7fe7362-1d10-4bef-9b8e-0ac891cce7e1",
        job_role: "SAL",
      },
    ],
    domains: [],
    industry: "SAA",
    number_of_employees_range: "1000+",
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    created_date: "2024-03-08T14:36:47.427570",
  },
  "004-no-parent": {
    name: "Org 004 No Parent",
    users: [
      {
        user_id: "d7fe7362-1d10-4bef-9b8e-0ac891cce7e1",
        job_role: "SAL",
      },
    ],
    domains: [],
    industry: "SAA",
    number_of_employees_range: "1000+",
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    created_date: "2024-03-08T14:36:47.427570",
  },
  "001Onboarding": {
    id: "1ac3ce81-6132-4145-851d-10450644ce46",
    name: "Organization 001 for Onboarding",
  },
  enums: {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Organization enums",
  },
};

export default organizations;
