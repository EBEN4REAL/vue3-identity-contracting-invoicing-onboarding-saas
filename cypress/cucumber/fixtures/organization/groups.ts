import { OrganizationGroupRead } from "../../../../src/iam/iam.types";

const organizationGroups: { [key: string]: OrganizationGroupRead } = {
  "001": {
    id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1",
    name: "Group 1",
    description: "Group 1 Description",
    role: null,
    users: null,
  },
  "001-default-group": {
    name: "Admins",
    description: "Organization Admins",
    id: "13766321-15f8-4264-8435-70fcc3fba6bc",
    role: "A",
    users: [],
  },
  "002": {
    id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2",
    name: "Group 2",
    description: "Group 2 Description",
    role: null,
    users: [],
  },
  "002-with-users": {
    id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2",
    name: "Group 2 with users",
    description: "Group 2 with users Description",
    role: null,
    users: [
      {
        id: "01234567-b72a-4c8e-9dca-0bf5d1a1c6a1",
        name: "User Name",
      },
    ],
  },
  "003": {
    id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1",
    name: "Group 003",
    description: "Group 003 Description",
    role: null,
    users: [
      {
        id: "01234567-b72a-4c8e-9dca-0bf5d1a1c6a1",
        name: "User003 Name",
      },
    ],
  },
  "004": {
    id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a4",
    name: "Group 004",
    description: "Group 004 Description",
    role: null,
    users: [
      {
        id: "21234567-b72a-4c8e-9dca-0bf5d1a1c6a1",
        name: "User002 Name",
      },
      {
        id: "31234567-b72a-4c8e-9dca-0bf5d1a1c6a1",
        name: "User003 Name",
      },
    ],
  },
  RegularGroup001: {
    id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1",
    name: "Regular Group 001",
    description: "Regular Group 001 Description",
    role: null,
    users: [],
  },
  RegularGroup002: {
    id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2",
    name: "Regular Group 002",
    description: "Regular Group 002 Description",
    role: null,
    users: [
      {
        id: "01234567-b72a-4c8e-9dca-0bf5d1a1c6a1",
        name: "Name002 Surname002",
      },
    ],
  },
  "005": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Group 005",
    description: "Group 005 Description",
    role: null,
    users: [
      {
        id: "01234567-b72a-4c8e-9dca-0bf5d1a1c6a1",
        name: "Name002 Surname002",
      },
    ],
  },
  asc: {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Asc Group",
    description: "Group 005 Description",
    role: null,
    users: [
      {
        id: "01234567-b72a-4c8e-9dca-0bf5d1a1c6a1",
        name: "Name002 Surname002",
      },
    ],
  },
};

export default organizationGroups;
