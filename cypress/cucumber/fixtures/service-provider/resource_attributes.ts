export type TypeResourceAttribute = {
  id?: string;
  name: string;
  service_provider_id?: string;
  format_option: "S" | "I" | "D" | "B";
};

const resourceAttributeTypes: { [key: string]: TypeResourceAttribute } = {
  "001": {
    id: "323ff1a0-50de-4235-b509-6c2afde5078d",
    service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Resource Attribute 001",
    format_option: "S",
  },
  "002": {
    id: "7a1f2c24-33f0-426e-8021-1a203ffb842b",
    service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    name: "Resource Attribute 002",
    format_option: "S",
  },
  Updated001: {
    id: "323ff1a0-50de-4235-b509-6c2afde5078d",
    name: "Resource Attribute 002",
    service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    format_option: "S",
  },
  Updated002: {
    id: "7a1f2c24-33f0-426e-8021-1a203ffb842b",
    name: "Resource Attribute 005",
    format_option: "I",
    service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
  },
};

export default resourceAttributeTypes;

export { resourceAttributeTypes };
