export type TypeDropdownItem = {
  key?: string;
  label: string;
  hint?: string | null;
  type: "button" | "link";
  onClick?: () => void;
  to?: string;
  href?: string;
  target?: string;
  icon?: string;
  iconColor?: string;
  color?: "primary" | "secondary" | "gray" | "error";
  isDisabled?: boolean;
  isHidden?: boolean;
  action?: () => void;
};

export type TypeIconDropdownItem = {
  key?: string;
  label: string;
  icon: string;
  hint?: string | null;
  onClick?: () => void;
  to?: string;
  href?: string;
  target?: string;
  color?: "primary" | "secondary" | "gray" | "error";
  isSelected?: boolean;
  isDisabled?: boolean;
};
