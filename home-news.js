// Homepage-only filtering; article and "more news" links keep their destinations.
(() => {
  const section = document.querySelector('.home-preview #news');
  if (!section) return;
  const controls = section.querySelector('.news-categories');
  const buttons = [...controls.querySelectorAll('[data-home-news-filter]')];
  const cards = [...section.querySelectorAll('.news-card[data-home-news-kind]')];
  const status = section.querySelector('.home-news-status');
  if (!buttons.length || !cards.length) return;
  const revealSelected = () => {
    const selected = controls.querySelector('[aria-pressed="true"]');
    if (!selected) return;
    const view = controls.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.right > view.right) controls.scrollLeft += item.right - view.right;
    else if (item.left < view.left) controls.scrollLeft -= view.left - item.left;
  };
  const selectCategory = selected => {
    const category = selected.dataset.homeNewsFilter;
    buttons.forEach(button => {
      button.classList.toggle('active', button === selected);
      button.setAttribute('aria-pressed', String(button === selected));
    });
    cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.homeNewsKind !== category; });
    if (status) status.textContent = `${selected.textContent.trim()}：顯示 ${cards.filter(card => !card.hidden).length} 則最新消息。`;
    revealSelected();
  };
  buttons.forEach(button => {
    button.addEventListener('click', () => selectCategory(button));
    button.disabled = false;
  });
  selectCategory(buttons.find(button => button.dataset.homeNewsFilter === 'all') || buttons[0]);
  document.fonts?.ready.then(revealSelected);
  window.addEventListener('resize', revealSelected);
})();
