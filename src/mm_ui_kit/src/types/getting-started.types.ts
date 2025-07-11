import { defineAsyncComponent } from "vue";

export type TypeGettingStartedStep = {
  id: number;
  componentName: string;
  component: ReturnType<typeof defineAsyncComponent>;
  icon: string;
  title: string;
  completed: boolean;
  collapsed: boolean;
  isLocked: boolean;
  buttons: TypeGettingStartedComponentButton[];
  badge?: { text: string; status: string };
};

export type TypeGettingStartedComponentButton = {
  label: string;
  icon: string;
  path: string;
  props?: Record<string, string>;
  hash?: string;
  opensInNewTab?: boolean;
};
