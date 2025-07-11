import { Ref, ref } from "vue";
import { helpers } from "@vuelidate/validators";
import { EmailRequirementExtended } from "~/iam/iam.types";
import { TypePasswordRules } from "~/users/users.types";

export function useEmailRequirements() {
  const emailRequirements: Ref<EmailRequirementExtended[]> = ref([]);
  const emailRules: Ref<TypePasswordRules> = ref({
    required: helpers.withMessage(
      "Email required",
      (value: string): boolean => value.length > 0,
    ),
  });

  return {
    emailRequirements,
    emailRules,
  };
}
