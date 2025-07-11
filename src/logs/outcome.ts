import { PolicyOutcome } from "~/logs/OrganizationLogs/Tabs/AccessLog/types";

export default (outcome: PolicyOutcome): string => {
  switch (outcome) {
    case "A":
      return "Allow";
    case "ALLOW":
      return "Allow";
    case "D":
      return "Deny";
    case "DENY":
      return "Deny";
    default:
      return "-";
  }
};
