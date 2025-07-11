import { DirectiveBinding } from "vue";

type TypeHTMLElementWithClickOutside = HTMLElement & {
  clickOutsideEvent?: EventListener;
};

export default {
  beforeMount(el: TypeHTMLElementWithClickOutside, binding: DirectiveBinding) {
    el.clickOutsideEvent = (event: Event) => {
      const target = event.target as Node;
      if (!(el === target || el.contains(target))) {
        if (typeof binding.value === "function") {
          binding.value(event);
        }
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: TypeHTMLElementWithClickOutside) {
    if (el.clickOutsideEvent) {
      document.removeEventListener("click", el.clickOutsideEvent);
      delete el.clickOutsideEvent;
    }
  },
};
