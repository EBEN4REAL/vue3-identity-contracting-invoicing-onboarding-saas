type TypeIsInViewport = {
  isBelowBottomCompletely: boolean;
  isBelowBottomPartially: boolean;
};

export default (element: HTMLElement): TypeIsInViewport => {
  const bottomEdge: number =
    window.innerHeight || document.documentElement.clientHeight || 0;
  const rect: DOMRect = element.getBoundingClientRect();

  return {
    isBelowBottomCompletely: rect.bottom + rect.height >= bottomEdge,
    isBelowBottomPartially: rect.bottom >= bottomEdge,
  };
};
