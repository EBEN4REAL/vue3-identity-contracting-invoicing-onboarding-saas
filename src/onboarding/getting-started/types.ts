import { defineAsyncComponent } from "vue";

export type TypeComponentMapEntry = {
  component: ReturnType<typeof defineAsyncComponent>;
  icon: string;
  title: string;
  buttons: Array<{
    label: string;
    icon: string;
    path: string;
    props?: Record<string, string>;
    hash?: string;
  }>;
  badge: { text: string; status: string };
};
