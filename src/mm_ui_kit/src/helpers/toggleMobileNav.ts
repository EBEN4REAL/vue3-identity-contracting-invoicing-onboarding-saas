export const toggleMobileNav = () => {
  const layoutEl: HTMLDivElement = document.querySelector(
    ".mm-app-layout",
  ) as HTMLDivElement;

  if (layoutEl) {
    layoutEl.classList.toggle("mm-app-layout-mobile");
  }
};

export const hideMobileNav = () => {
  const layoutEl: HTMLDivElement = document.querySelector(
    ".mm-app-layout",
  ) as HTMLDivElement;

  if (layoutEl && layoutEl.classList.contains("mm-app-layout-mobile")) {
    layoutEl.classList.remove("mm-app-layout-mobile");
  }
};
