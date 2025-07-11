export type User = {
  id: string;
  first_name: string;
  last_name: string;
  job_role?: string;
};

export type UserAfterRequestToJoinOrganization = {
  first_name: string;
  last_name: string;
  email: string;
  job_role: string | null;
  user_id: string;
  organization: {
    id: string;
    name: string;
  } | null;
  status: "P";
  created_date: string;
  updated_date: string;
  is_active: boolean;
  unit: null;
};

const users: { [key: string]: User | UserAfterRequestToJoinOrganization } = {
  "001WithUpdatedJobRole": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    first_name: "User",
    last_name: "001",
    job_role: "Sales",
  },
  "001": {
    first_name: "User",
    last_name: "001",
    email: "user001@email.com",
    job_role: null,
    user_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    organization: null,
    status: "P",
    created_date: "2024-02-23T09:22:05.916948",
    updated_date: "2024-02-23T09:22:05.917134",
    is_active: true,
    unit: null,
  },
};

export default users;
