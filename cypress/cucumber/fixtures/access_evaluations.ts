import {
  AccessEvaluationBaseRead,
  AccessEvaluationRead,
} from "../../../src/iam/iam.types";
import { TableResponse } from "../../../src/mm_ui_kit/src/types/table.types";

export const accessEvaluations: {
  [key: string]: TableResponse<AccessEvaluationBaseRead>;
} = {
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "e524b17c-2e34-4dcf-94cf-c201a4bd8945",
        outcome: "D",
        evaluation_date: "2024-08-02T12:39:45.296397Z",
        resource_urn: null,
        service_provider: {
          id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
          name: "Acme Inc. 123",
        },
        oauth_client: {
          id: "4585b483-7e26-4924-bbf5-62739e935390",
          name: "Acme Inc. SP App",
        },
        organization: {
          id: "00000000-0000-0000-0002-000000000001",
          name: "Acme Inc. 123",
        },
        user: {
          email: "user@metricsmatter.com",
          first_name: "FirstNameCOM",
          last_name: "LastNameCOM",
          id: "50930019-3a88-4d23-a33f-40e1dc0ff9d1",
        },
      },
    ],
    size: 1,
    total: 1,
  },
};

export const accessEvaluationDetails: {
  [key: string]: AccessEvaluationRead;
} = {
  "001": {
    id: "e524b17c-2e34-4dcf-94cf-c201a4bd8945",
    outcome: "A",
    evaluation_date: "2024-08-02T12:39:45.296397Z",
    resource_urn: null,
    service_provider: {
      id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
      name: "Acme Inc.",
    },
    oauth_client: {
      id: "4585b483-7e26-4924-bbf5-62739e935390",
      name: "Acme Inc. SP App",
    },
    organization: {
      id: "00000000-0000-0000-0002-000000000001",
      name: "Acme Inc.",
    },
    user: {
      email: "user@metricsmatter.com",
      first_name: "FirstNameCOM",
      last_name: "LastNameCOM",
      id: "50930019-3a88-4d23-a33f-40e1dc0ff9d1",
    },
    lines: [
      {
        id: "8e880201-4b41-40e5-ac5a-8ccbf3efb92c",
        outcome: "A",
        policy: {
          id: "6dd492b5-b7d8-4e9b-b1a9-0746b221082c",
          type: {
            id: "1245f699-732b-4d35-925b-998ff5120c1d",
            name: "Policy #1",
          },
        },
        agreement: null,
      },
    ],
  },
};
