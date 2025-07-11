import { ServiceConsumerAgreementPoliciesRead } from "../../../../src/policies/policies.types";

export const assignedPolicies: Record<
  string,
  ServiceConsumerAgreementPoliciesRead
> = {
  "001": {
    default_policy_ids: ["1abd6d97-73bb-430e-a6c5-1c4e814bd4c8"],
    optional_policy_ids: ["86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"],
  },
  "001-Updated": {
    default_policy_ids: ["1abd6d97-73bb-430e-a6c5-1c4e814bd4c8"],
    optional_policy_ids: [
      "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1",
      "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1",
    ],
  },
};
