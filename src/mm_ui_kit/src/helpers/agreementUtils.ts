import { ServiceConsumerAgreementRead } from "~/organizations/licenses/licenses.types";
import { BadgeTypes } from "../types/badge.types";
import { SPAgreementRead } from "~/service-providers/Licenses/licenses.types";

export const statusMap = (cancelled: boolean, active: boolean) => {
  if (cancelled) return BadgeTypes.Cancelled;
  if (active) return BadgeTypes.Active;
  if (!cancelled && !active) return BadgeTypes.Warning;
  return BadgeTypes.Inactive;
};

export const getStatusText = (item: ServiceConsumerAgreementRead) => {
  if (!item) return "";
  if (!item.cancelled && !item.active) return "Pending";
  return "";
};

export const badgeStatus = (item: SPAgreementRead) => {
  if ((item && !item.cancelled && !item.active) || item.cancel_at_period_end) {
    return BadgeTypes.Warning;
  } else {
    return item.cancelled
      ? BadgeTypes.Cancelled
      : item.active
        ? BadgeTypes.Active
        : BadgeTypes.Inactive;
  }
};

export const badgeText = (item: SPAgreementRead) => {
  return item.cancel_at_period_end
    ? "Non Renewing"
    : badgeStatus(item) == "warning"
      ? "Pending"
      : null;
};
