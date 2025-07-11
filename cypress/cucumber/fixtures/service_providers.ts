import { AttributeSetRead } from "../../../src/onboarding/onboarding.types";
export type ServiceProvider = {
  id: string;
  name: string;
};

const serviceProviders: { [key: string]: ServiceProvider } = {
  "001": {
    id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Service Provider 001",
  },
  "002": {
    id: "00000000-0000-0000-0002-000000000001",
    name: "Service Provider 001",
  },
};

export const registeredServiceProvider: { [key: string]: AttributeSetRead } = {
  "001": {
    id: "8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591",
    name: "string",
    faq_url: "string",
    from_email: "string",
    logo_url: "string",
    button_background_color: "string",
    button_text_color: "string",
  },
};

export default serviceProviders;
