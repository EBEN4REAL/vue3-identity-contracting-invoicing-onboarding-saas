// usePopup.ts
import { ref, Ref, onMounted, onBeforeUnmount, nextTick } from "vue";

export default function usePopup(
  displayPosition:
    | "toLeft"
    | "toRight"
    | "center"
    | "top"
    | "center-top" = "toLeft",
  cypressId?: string,
) {
  const isPopupActive: Ref<boolean> = ref(false);
  const popupTarget: Ref<HTMLElement | null> = ref(null);
  const activatorElement: Ref<HTMLElement | null> = ref(null);
  const el: Ref<HTMLElement | null> = ref(null);
  const mutationObserver: Ref<MutationObserver | null> = ref(null);
  const resizeObserver: Ref<ResizeObserver | null> = ref(null);

  const togglePopup = () => {
    isPopupActive.value = !isPopupActive.value;
    el.value.style.display = isPopupActive.value ? "block" : "none";
    nextTick(updatePosition);
  };

  const showPopup = () => {
    isPopupActive.value = true;
    el.value.style.display = "block";
  };

  const hidePopup = () => {
    isPopupActive.value = false;
    el.value.style.display = "none";
  };

  const updatePosition = () => {
    if (activatorElement.value && popupTarget.value) {
      const activatorRect = activatorElement.value.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      popupTarget.value.style.position = "absolute";
      popupTarget.value.style.top = `${activatorRect.bottom + scrollY + 6}px`;

      switch (displayPosition) {
        case "toLeft":
          popupTarget.value.style.left = `calc(${activatorRect.right + scrollX}px - ${popupTarget.value.offsetWidth}px)`;
          break;
        case "toRight":
          popupTarget.value.style.left = `${activatorRect.left + scrollX}px`;
          break;
        case "center":
          popupTarget.value.style.left = `${activatorRect.left + activatorRect.width / 2 - popupTarget.value.offsetWidth / 2 + scrollX}px`;
          if (popupTarget.value.offsetWidth > activatorRect.width) {
            popupTarget.value.style.left = `${parseFloat(popupTarget.value.style.left) - (popupTarget.value.offsetWidth - activatorRect.width) / 2}px`;
          }
          break;
        case "top":
          popupTarget.value.style.top = `${activatorRect.top + scrollY - popupTarget.value.offsetHeight - 10}px`;
          popupTarget.value.style.left = `${activatorRect.left + scrollX}px`;
          break;
        case "center-top":
          popupTarget.value.style.top = `${activatorRect.top + scrollY - popupTarget.value.offsetHeight - 10}px`;
          popupTarget.value.style.left = `${activatorRect.left + activatorRect.width / 2 - popupTarget.value.offsetWidth / 2 + scrollX}px`;
          break;
      }
    }
  };

  onMounted(() => {
    el.value = document.createElement("div");
    el.value.setAttribute("data-cy", cypressId);
    el.value.style.display = "none";
    document.body.appendChild(el.value);
    popupTarget.value = el.value;

    mutationObserver.value = new MutationObserver(updatePosition);
    mutationObserver.value.observe(document.body, {
      childList: true,
      subtree: true,
    });

    resizeObserver.value = new ResizeObserver(updatePosition);
    if (activatorElement.value) {
      resizeObserver.value.observe(activatorElement.value);
    }

    window.addEventListener("resize", updatePosition);
  });

  onBeforeUnmount(() => {
    if (popupTarget.value) {
      document.body.removeChild(popupTarget.value);
    }
    if (mutationObserver.value) {
      mutationObserver.value.disconnect();
    }
    if (resizeObserver.value && activatorElement.value) {
      resizeObserver.value.unobserve(activatorElement.value);
    }

    window.removeEventListener("resize", updatePosition);
  });

  return {
    isPopupActive,
    popupTarget,
    activatorElement,
    togglePopup,
    showPopup,
    hidePopup,
  };
}
