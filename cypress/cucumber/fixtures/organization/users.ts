import { OrganizationUserRead } from "../../../../src/iam/iam.types";

const organizationUsers: { [key: string]: OrganizationUserRead } = {
  "001": {
    email: "tt@tt.com",
    first_name: "test",
    last_name: "test",
    job_role: "DEV",
    user_id: "2e80ddf8-3563-467d-9413-f336640ff591",
    id: "4a5df159-f5c8-4062-bebb-6ba8305ec552",
    status: "P",
    created_date: "2024-07-08T15:10:42.561645",
    updated_date: "2024-07-09T17:41:08.430621",
    is_active: true,
    unit: {
      id: "d3dad8b3-ae33-44d9-90bb-0978b2dff07a",
      name: "tt",
    },
    organization: {
      id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      name: "Org 001",
    },
  },
  "002": {
    email: "tt@tt.com",
    first_name: "test",
    last_name: "test",
    job_role: "MAR",
    user_id: "9f8c5b13-e6a2-4d87-ae3f-71b4d2f8c492",
    id: "4a5df159-f5c8-4062-bebb-6ba8305ec552",
    status: "A",
    created_date: "2024-07-08T15:10:42.561645",
    updated_date: "2024-07-09T17:41:08.430621",
    is_active: false,
    unit: {
      id: "d3dad8b3-ae33-44d9-90bb-0978b2dff07a",
      name: "tt",
    },
    organization: {
      id: "00000000-0000-0000-0002-000000000001",
      name: "Acme Inc.",
    },
  },
  "003": {
    user_id: "ded35af8-c60c-4f98-b35b-64db59deb4a7",
    status: "R",
    job_role: "MAR",
  },
  "004": {
    email: "user004@user.com",
    first_name: "User",
    last_name: "004",
    job_role: "MAR",
    user_id: "9f8c5b13-e6a2-4d87-ae3f-71b4d2f8c492",
    id: "4a5df159-f5c8-4062-bebb-6ba8305ec552",
    status: "A",
    created_date: "2024-07-08T15:10:42.561645",
    updated_date: "2024-07-09T17:41:08.430621",
    is_active: true,
    unit: {
      id: "d3dad8b3-ae33-44d9-90bb-0978b2dff07a",
      name: "tt",
    },
    organization: {
      id: "00000000-0000-0000-0002-000000000001",
      name: "Acme Inc.",
    },
  },
};

export default organizationUsers;
