import { BadgeTypes } from "./badge.types";

export type TypeDataIteratorItem = {
  key?: string;
  label: string;
  text: string | null;
  isEmpty?: boolean;
  emptyText?: string;
  to?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | "framename";
  information?: string;
  informationType?: "redirect" | "action" | "text";
  informationRedirect?: string;
  informationAction?: string;
  informationIcon?: string;
  type?: "text" | "hidden";
  labelTooltip?: string;
  multiple?: boolean;
  hasBadge?: boolean;
  badgeStatus?: BadgeTypes;
  badgeText?: string;
};
