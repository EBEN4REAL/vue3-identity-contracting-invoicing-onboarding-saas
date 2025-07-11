import { ServiceProvidersAttributesConsentsRead } from "../../../../src/onboarding/onboarding.types";

export const consents: Record<string, ServiceProvidersAttributesConsentsRead> =
  {
    "000": {
      service_providers: [],
    },
    "001": {
      service_providers: [
        {
          attributes: [
            {
              type: {
                id: "e91d8e3c-4988-4b78-946a-6b0969a5db3d",
                name: "attr type #1",
              },
              granted: true,
              consent_date: "2024-09-23T07:58:19.379138",
            },
          ],
          id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
          consent_date: "2024-09-23T07:58:19.379138",
        },
      ],
    },
  };
