// Preserve the existing horizontal tab layout and reveal the selected service.
(() => {
  // Keep the old timeline bookmark working after its move to a standalone page.
  if (location.hash === '#day' && !document.getElementById('stage')) {
    location.replace('service-day-life.html#day');
    return;
  }
  const tabs = document.getElementById('stabs');
  const selected = tabs?.querySelector('[aria-current="page"]');
  if (!tabs || !selected) return;
  const revealSelected = () => {
    const view = tabs.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.right > view.right) tabs.scrollLeft += item.right - view.right;
    else if (item.left < view.left) tabs.scrollLeft -= view.left - item.left;
  };
  revealSelected();
  document.fonts?.ready.then(revealSelected);
  window.addEventListener('resize', revealSelected);
})();
