import {
  AgreementTypeRead,
  ServiceProviderAgreementsRead,
} from "../../../../src/service-providers/Licenses/licenses.types";

export const licenses: {
  [key: string]: ServiceProviderAgreementsRead;
} = {
  "001": {
    offset: 0,
    limit: 0,
    results: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        service_consumer_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        agreement_name: "ABC Group",
        effective_from_date: "2024-03-28T14:08:34.698Z",
        cancelled: false,
        description: "This is a test license",
      },
    ],
    size: 1,
    total: 1,
  },
  "002": {
    offset: 0,
    limit: 0,
    results: [
      {
        id: "2fa85f64-5717-4562-b3fc-2c963f66afa6",
        service_consumer_id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        agreement_name: "License 2",
        effective_from_date: "2024-03-28T14:08:34.698Z",
        cancelled: true,
        description: "This is a test license",
      },
    ],
    size: 1,
    total: 1,
  },
  "003": {
    offset: 0,
    limit: 0,
    results: [
      {
        service_consumer_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
        agreement_name: "License 3",
        effective_from_date: "2024-03-28T14:08:34.698Z",
        cancelled: false,
        description: "This is a test license",
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
      },
    ],
    size: 1,
    total: 1,
  },
};

export const agreementTypes: {
  [key: string]: AgreementTypeRead;
} = {
  "001": {
    name: "License 1",
    description: "string",
    distribution_allowed_organization: true,
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    service_provider_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    agreement_count: null,
  },
  "002": {
    name: "License 2",
    description: "License 2 Description",
    distribution_allowed_organization: true,
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    agreement_count: null,
  },
};
