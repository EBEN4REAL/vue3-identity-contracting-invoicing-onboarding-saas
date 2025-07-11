import { TableResponse } from "../../../../src/mm_ui_kit/src/types/table.types";
import {
  AttributeTypeCreate,
  AttributeTypeRead,
} from "../../../../src/onboarding/onboarding.types";

export const attributeTypes: Record<
  string,
  TableResponse<AttributeTypeRead>
> = {
  all: {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "23940674-81bd-4a7e-ac56-c16405a69529",
        attribute_of: "USER",
        data_type: "enum",
        name: "AttrType ENUM Name",
        enabled: false,
        restrictions: {
          options: ["Option 1", "Option 2"],
        },
        organization_attribute: true,
      },
      {
        id: "360b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "ORGANIZATION",
        data_type: "string",
        name: "AttrTypeName",
        enabled: true,
        restrictions: {
          min_length: 10,
          max_length: 25,
        },
      },
      {
        id: "460b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "USER",
        data_type: "string",
        name: "AttrTypeName No restrictions",
        enabled: true,
        restrictions: null,
        organization_attribute: false,
      },
    ],
    size: 3,
    total: 3,
  },
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "560b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "USER",
        data_type: "string",
        name: "AttrTypeName No restrictions 001",
        enabled: true,
        restrictions: null,
        organization_attribute: true,
      },
    ],
    size: 1,
    total: 1,
  },
  "001-Updated": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "560b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "USER",
        data_type: "string",
        name: "AttrTypeName No restrictions 001-Updated",
        enabled: false,
        restrictions: null,
        organization_attribute: false,
      },
    ],
    size: 1,
    total: 1,
  },
  "001-Deleted": {
    offset: 0,
    limit: 10,
    results: [],
    size: 0,
    total: 0,
  },
  "002": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "560b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "USER",
        data_type: "string",
        name: "AttrTypeName Min length 002",
        enabled: true,
        restrictions: { min_length: 10 },
      },
    ],
    size: 1,
    total: 1,
  },
  "003": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "560b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "USER",
        data_type: "string",
        name: "AttrTypeName Max length 003",
        enabled: true,
        restrictions: { max_length: 20 },
      },
    ],
    size: 1,
    total: 1,
  },
  "004": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "560b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "USER",
        data_type: "string",
        name: "AttrTypeName Min Length and Max length 004",
        enabled: true,
        restrictions: { min_length: 10, max_length: 20 },
      },
    ],
    size: 1,
    total: 1,
  },
  "005": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "560b00da-89d4-4653-8079-aed361eab3c3",
        attribute_of: "USER",
        data_type: "string",
        name: "AttrTypeName Options 005",
        enabled: true,
        restrictions: {
          options: ["Option 1", "Option 2", "Option 3"],
        },
      },
    ],
    size: 1,
    total: 1,
  },
};

export const attributeTypeCreate: Record<string, AttributeTypeCreate> = {
  "001": {
    attribute_of: "USER",
    data_type: "string",
    name: "AttrTypeName No restrictions 001",
    enabled: true,
    restrictions: null,
  },
  "002": {
    attribute_of: "USER",
    data_type: "string",
    name: "AttrTypeName Min length 002",
    enabled: true,
    restrictions: { min_length: 10 },
  },
  "003": {
    attribute_of: "USER",
    data_type: "string",
    name: "AttrTypeName Max length 003",
    enabled: true,
    restrictions: { max_length: 20 },
  },
  "004": {
    attribute_of: "USER",
    data_type: "string",
    name: "AttrTypeName Min Length and Max length 004",
    enabled: true,
    restrictions: { min_length: 10, max_length: 20 },
  },
  "005": {
    attribute_of: "USER",
    data_type: "enum",
    name: "AttrTypeName Options 005",
    enabled: true,
    restrictions: {
      options: ["Option 1", "Option 2", "Option 3"],
    },
  },
};
