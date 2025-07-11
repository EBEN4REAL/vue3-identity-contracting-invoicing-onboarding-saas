export type Organization = {
  id: string;
  name: string;
  industry?: string;
  number_of_employees_range?: string;
  auto_joined_enabled?: boolean;
};

const organizations: { [key: string]: Organization } = {
  "001": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    industry: "SaaS",
    number_of_employees_range: "11-50",
    auto_joined_enabled: true,
  },
  "001Updated": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    industry: "ESG",
    number_of_employees_range: "51-200",
    auto_joined_enabled: true,
  },
  "001-auto_joined_enabled-false": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Org 001",
    industry: "ESG",
    number_of_employees_range: "51-200",
    auto_joined_enabled: false,
  },
  "001-short": {
    id: "1ac3ce81-6132-4145-851d-10450644ce46",
    name: "Org 001",
  },
  "002-short": {
    id: "1ac3ce81-6132-4145-851d-10450644ce45",
    name: "Org 002",
  },
  "003-short": {
    id: "1ac3ce81-6132-4145-851d-10450644ce44",
    name: "Org 003",
  },
};

export default organizations;
