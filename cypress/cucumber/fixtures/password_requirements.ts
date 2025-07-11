import { PasswordRequirementRead } from "../../../src/iam/iam.types";

const passwordRequirements: { [key: string]: PasswordRequirementRead[] } = {
  minLengthOnly: [
    {
      name: "MIN_PASSWORD_LENGTH",
      value: 6,
    },
  ],
  characterTypesOnly: [
    {
      name: "REQUIRED_CHARACTER_TYPES",
      value: "UNLS",
    },
  ],
  all: [
    {
      name: "MIN_PASSWORD_SCORE",
      value: 3,
    },
    {
      name: "MIN_PASSWORD_LENGTH",
      value: 6,
    },
    {
      name: "REQUIRED_CHARACTER_TYPES",
      value: "UNLS",
    },
  ],
};

export default passwordRequirements;
