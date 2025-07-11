export type DropdownItem = {
  key: string;
  action?: () => void;
};

export type Button = {
  key: string;
  action?: () => void;
  isDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  isOnlyIcon?: boolean;
  isVisible?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  minWidth?: string;
  tooltipText?: string;
};
