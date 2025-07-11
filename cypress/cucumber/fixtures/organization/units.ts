import { OrganizationUnitRead } from "../../../../src/iam/iam.types";

const organizationUnits: { [organization: string]: OrganizationUnitRead[] } = {
  "000": [],
  "001": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
          job_role: "DEV",
        },
      ],
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 2",
      description: "unit 2 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
        },
      ],
    },
  ],
  "001-no-users": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [],
    },
  ],
  "011": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "Unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
        },
      ],
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 11",
      description: "Unit 11 Description",
      parent_organization_unit_id: "01234567-89ab-cdef-0123-456789abcdef",
      users: [],
      deletable: true,
    },
  ],
  "011-no-users": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "Unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [],
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 11",
      description: "Unit 11 Description",
      parent_organization_unit_id: "01234567-89ab-cdef-0123-456789abcdef",
      users: [],
    },
  ],
  "011-no-parent": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "Unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [],
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 2",
      description: "Unit 2 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [],
      deletable: true,
    },
  ],
  "111": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "Unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
        },
      ],
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 11",
      description: "Unit 11 Description",
      parent_organization_unit_id: "01234567-89ab-cdef-0123-456789abcdef",
      users: [],
    },
    {
      id: "21234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 111",
      description: "Unit 111 Description",
      parent_organization_unit_id: "11234567-89ab-cdef-0123-456789abcdef",
      users: [],
    },
  ],
  "004": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: null,
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 2",
      description: "unit 2 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: null,
    },
  ],
  "004-no-parent": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 1",
      description: "unit 1 Description",
      parent_organization_unit_id: null,
      users: null,
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 2",
      description: "unit 2 Description",
      parent_organization_unit_id: null,
      users: null,
    },
  ],
  "005": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdeg",
      name: "Unit 5",
      description: "unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      deletable: false,
    },
  ],
  "005-non-deletable": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 5 non deletable",
      description: "unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      deletable: false,
    },
  ],
  "006-deletable": [
    {
      id: "01234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 6 deletable",
      description: "unit 6 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      deletable: true,
    },
  ],
  enums: [
    {
      id: "01334567-89ab-cdef-0123-456789abcdff",
      name: "Unit enums",
      description: "Unit 1 Description",
      parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      users: [
        /* options below can be deleted after enums being handled this is to keep coverage */
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a1",
          user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
          job_role: "CUS",
        },
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a2",
          user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
          job_role: "MAR",
        },
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a3",
          user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
          job_role: "FIN",
        },
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a4",
          user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
          job_role: "EXE",
        },
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a5",
          user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
          job_role: "SAL",
        },
        {
          id: "ded35af8-c60c-4f98-b35b-64db59deb4a6",
          user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
          name: "User",
          job_role: "PRO",
        },
      ],
    },
    {
      id: "11234567-89ab-cdef-0123-456789abcdef",
      name: "Unit 11",
      description: "Unit 11 Description",
      parent_organization_unit_id: "01234567-89ab-cdef-0123-456789abcdef",
      users: [],
    },
  ],
};

export default organizationUnits;
