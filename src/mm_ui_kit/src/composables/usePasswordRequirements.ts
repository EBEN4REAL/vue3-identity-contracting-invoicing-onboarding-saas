import { onMounted, Ref, ref } from "vue";
import { fieldRequirementsService } from "~/common/services/field-requirements.service";
import { helpers } from "@vuelidate/validators";
import {
  PasswordRequirementExtended,
  PasswordRequirementsMap,
} from "~/iam/iam.types";
import { TypePasswordRules } from "~/users/users.types";
import zxcvbn from "zxcvbn-typescript";

const getNumberParam = (param: number | string): number => {
  return typeof param === "number" ? param : parseInt(param);
};

const getStringParam = (param: number | string): string => {
  return typeof param === "number" ? `${param}` : param;
};

const PASSWORD_REQUIREMENTS_MAP: PasswordRequirementsMap = {
  // SOFT_LOCK_DURATION: {}, // TODO: need to describe the rule
  // PASSWORDS_PREVIOUS: {}, // TODO: need to describe the rule
  MIN_PASSWORD_SCORE: {
    message: (): string => "Cannot be a common password",
    validator: (
      value: string,
      param: number | string,
      username: string,
    ): boolean => {
      return zxcvbn(value, [username]).score >= getNumberParam(param);
    },
  },
  MIN_PASSWORD_LENGTH: {
    message: (param: number | string): string =>
      `Password must be at least ${getNumberParam(param)} characters`,
    validator: (value: string, param: number | string): boolean => {
      return value.length >= getNumberParam(param);
    },
  },
  MAX_PASSWORD_LENGTH: {
    message: (param: number | string): string =>
      `Password must be at most ${getNumberParam(param)} characters`,
    validator: (value: string, param: number | string): boolean => {
      return value.length <= getNumberParam(param);
    },
  },
  MIN_MAX_PASSWORD_LENGTH: {
    message: (param: string): string =>
      `Must be between ${param.split("-")[0]} and ${param.split("-")[1]} characters in length`,
    validator: (value: string, param: string): boolean => {
      return (
        value.length >= getNumberParam(param.split("-")[0]) &&
        value.length <= getNumberParam(param.split("-")[1])
      );
    },
  },
  REQUIRED_CHARACTER_TYPES: {
    message: (param: number | string): string => {
      const charMap: { [key: string]: string } = {
        U: "one uppercase letter",
        N: "one number",
        L: "one lowercase letter",
        S: "one special character",
      };
      const charArr = getStringParam(param).split("");
      let message: string = "Must contain at least ";

      charArr.forEach((char, index): void => {
        message += charMap[char];
        if (index === charArr.length - 1) {
          message += ".";
        } else {
          message += ", ";
        }
      });

      return message;
    },
    validator: (value: string, param: number | string) => {
      const charArr: string[] = getStringParam(param).split("");
      const charRegex: { [key: string]: RegExp } = {
        U: /[A-Z]/,
        N: /[0-9]/,
        L: /[a-z]/,
        S: /[^a-zA-Z0-9]/,
      };

      return charArr.every((char: string) => {
        return charRegex[char].test(value);
      }) as boolean;
    },
  },
};

export function usePasswordRequirements(username: string) {
  const passwordRequirements: Ref<PasswordRequirementExtended[]> = ref([]);
  const passwordRules: Ref<TypePasswordRules> = ref({
    required: helpers.withMessage(
      "Password required",
      (value: string): boolean => value.length > 0,
    ),
  });

  onMounted(async (): Promise<void> => {
    let requirements = await fieldRequirementsService.getPasswordRequirements();

    const minRequirement = requirements.find(
      (requirement) => requirement.name === "MIN_PASSWORD_LENGTH",
    );
    const maxRequirement = requirements.find(
      (requirement) => requirement.name === "MAX_PASSWORD_LENGTH",
    );

    if (minRequirement && maxRequirement) {
      requirements = requirements.filter(
        (requirement) =>
          requirement.name !== "MIN_PASSWORD_LENGTH" &&
          requirement.name !== "MAX_PASSWORD_LENGTH",
      );

      requirements.push({
        name: "MIN_MAX_PASSWORD_LENGTH",
        value: `${minRequirement.value}-${maxRequirement.value}`,
      });
    }

    requirements.forEach((requirement) => {
      if (!PASSWORD_REQUIREMENTS_MAP[requirement.name]) {
        return;
      }

      if (
        requirement.name === "REQUIRED_CHARACTER_TYPES" &&
        !requirement.value
      ) {
        return;
      }

      passwordRequirements.value.push({
        ...requirement,
        message: PASSWORD_REQUIREMENTS_MAP[requirement.name].message(
          requirement.value,
        ),
      });

      passwordRules.value[requirement.name] = helpers.withMessage(
        PASSWORD_REQUIREMENTS_MAP[requirement.name].message(requirement.value),
        (fieldVal: string) => {
          return PASSWORD_REQUIREMENTS_MAP[requirement.name].validator(
            fieldVal,
            requirement.value,
            username,
          );
        },
      );
    });
  });

  return {
    passwordRequirements,
    passwordRules,
  };
}
