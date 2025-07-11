type TypeDynamicLabel = {
  [key: string]: string;
};

export type TypeTreeItem = TypeDynamicLabel & {
  id: string;
  icon: string;
  type: string;
  append?: string;
  notClickable?: boolean;
  children?: TypeTreeItem[];
};
