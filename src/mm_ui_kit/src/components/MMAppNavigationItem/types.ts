export type TypeNavigationItem = {
  to: string;
  label: string;
  icon: string;
  isHidden?: boolean;
  isComingSoon?: boolean;
};

export type TypeNavigationItemsInCategory = {
  categoryLabel: string | null;
  items: TypeNavigationItem[];
};
