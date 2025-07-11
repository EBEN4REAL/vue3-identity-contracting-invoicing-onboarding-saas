import type { Directive } from "vue";

const findFocusableElements = (el: HTMLElement): HTMLElement[] => {
  const standardSelectors =
    "input, button, select, textarea, [tabindex]:not([disabled]), pre";
  const customSelectors =
    ".mm-select, .mm-password, .mm-tabs-item, .mm-autocomplete-control, .mm-tabs, .step-card";

  const combinedSelector = `${standardSelectors}, ${customSelectors}`;

  return Array.from(el.querySelectorAll(combinedSelector)).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement &&
      !el.hasAttribute("disabled") &&
      (el.offsetWidth > 0 || el.offsetHeight > 0) &&
      window.getComputedStyle(el).visibility !== "hidden",
  );
};

const getFocusedElement = (): HTMLElement | null => {
  return document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
};

const focusFirstDirective: Directive = {
  mounted(el: HTMLElement) {
    let hasReceivedTab = false;

    const handleTabPress = (event: KeyboardEvent) => {
      const focusedElement = getFocusedElement();
      const isBodyElement = focusedElement === document.body;
      if (!hasReceivedTab && event.key === "Tab" && !event.shiftKey) {
        if (isBodyElement) event.preventDefault();
        hasReceivedTab = true;

        const focusableElements = findFocusableElements(el);

        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];

          if (!firstElement.hasAttribute("tabindex")) {
            firstElement.setAttribute("tabindex", "0");
          }

          if (firstElement.classList.contains("mm-select")) {
            const selectTrigger = firstElement.querySelector(
              ".select-trigger, button",
            );

            if (selectTrigger instanceof HTMLElement) {
              selectTrigger.focus();
            } else {
              firstElement.focus();
            }
          } else {
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleTabPress);
    el._handleTabPress = handleTabPress;
  },
  unmounted(el: HTMLElement) {
    if (el._handleTabPress) {
      document.removeEventListener("keydown", el._handleTabPress);
      delete el._handleTabPress;
    }
  },
};

export default focusFirstDirective;
