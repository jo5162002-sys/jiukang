// Shared page interactions. Connected inquiry forms use contact-form.js.
(() => {
  const all = s => [...document.querySelectorAll(s)];
  if (!document.querySelector('.banner-swiper')) {
    const menu = document.querySelector('.mobile-menu');
    const button = document.querySelector('header button');
    button?.addEventListener('click', () => {
      const open = menu.classList.toggle('active');
      button.classList.toggle('active', open);
      button.setAttribute('aria-expanded', String(open));
    });
    all('.footer-top-btn').forEach(b => b.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'})));
  }
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in', 'visible');
      observer.unobserve(e.target);
    }
  }), {threshold:0.05});
  all('.rv,.gsap-slide-up,.gsap-reveal,.gsap-slide-up-group').forEach(e => observer.observe(e));
  function notice(message) {
    document.querySelector('.preview-notice')?.remove();
    const box = document.createElement('div');
    box.className = 'preview-notice';
    box.setAttribute('role','status');
    box.textContent = message + ' ';
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = '關閉';
    close.addEventListener('click', () => box.remove());
    box.append(close); document.body.append(box);
  }
  all('[data-link-pending]').forEach(a => {
    const show = e => { e.preventDefault(); notice(a.dataset.linkPending); };
    a.addEventListener('click', show);
    a.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') show(e); });
  });
  all('form:not([data-contact-form])').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    notice('這是本機預覽，資料尚未送出。需要聯絡久康，請撥 04-2335-0395。');
  }));
  all('.post button.pr').forEach(b => b.addEventListener('click', () => {
    const body = b.closest('.post').querySelector('.pb');
    const expanded = b.getAttribute('aria-expanded') !== 'true';
    body.hidden = !expanded; b.setAttribute('aria-expanded', String(expanded));
    b.textContent = expanded ? '收合內容' : '閱讀全文';
  }));
  // Keep the selected category visible in the horizontally scrolling news menu.
  const revealNewsCategory = () => {
    const filters = document.querySelector('.nfs.tabs');
    const selected = filters?.querySelector('.nf.on');
    if (!selected) return;
    const view = filters.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.right > view.right) filters.scrollLeft += item.right - view.right;
    else if (item.left < view.left) filters.scrollLeft -= view.left - item.left;
  };
  all('.nf').forEach(b => b.addEventListener('click', () => {
    const filter = b.dataset.f || b.dataset.c || 'all';
    all('.nf').forEach(x => {x.setAttribute('aria-pressed',String(x===b));x.classList.toggle('on',x===b);});
    all('.post').forEach(p => {p.hidden = filter!=='all' && p.dataset.c!==filter;});
    const empty = document.querySelector('#nempty');
    if(empty) empty.hidden = all('.post').some(p=>!p.hidden);
    revealNewsCategory();
  }));
  if (document.querySelector('.nfs.tabs')) {
    document.fonts?.ready.then(revealNewsCategory);
    window.addEventListener('resize', revealNewsCategory);
  }
  all('[data-news-category]').forEach(link => {
    const go = () => { location.href='news.html?category='+encodeURIComponent(link.dataset.newsCategory); };
    link.addEventListener('click',go);
    link.addEventListener('keydown',e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();go();} });
  });
  const requestedCategory = new URLSearchParams(location.search).get('category');
  const categoryButton = all('.nf').find(b => b.dataset.f===requestedCategory);
  if (categoryButton) { categoryButton.click(); categoryButton.parentElement.scrollIntoView({block:'start'}); }
  // Homepage article links open the matching local article directly.
  function openLinkedArticle() {
    const id = decodeURIComponent(location.hash.slice(1));
    const article = id && document.getElementById(id);
    if (!article || !article.classList.contains('post')) return;
    if (article.dataset.newsDetail) {
      location.replace(article.dataset.newsDetail);
      return;
    }
    const allFilter = document.querySelector('.nf[data-f="all"]');
    if (allFilter) allFilter.click();
    const body = article.querySelector('.pb');
    const button = article.querySelector('.pr');
    if (body && button) {
      body.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      button.textContent = '收合內容';
    }
    article.scrollIntoView({block:'start'});
  }
  openLinkedArticle();
  window.addEventListener('hashchange', openLinkedArticle);
})();
