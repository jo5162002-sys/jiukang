// Local visual preview of the captured public page. No original-site API requests.
(() => {
  const one = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const copy = JSON.parse(one('#preview-banner-copy').textContent);
  const wrapper = one('.swiper-wrapper');
  const slides = all('[data-swiper-slide-index]').sort((a,b) => +a.dataset.swiperSlideIndex - +b.dataset.swiperSlideIndex);
  slides.forEach(slide => wrapper.append(slide));
  let active = 0;
  function render() {
    const width = one('.banner-swiper').clientWidth;
    const gap = innerWidth < 768 ? 20 : 40;
    slides.forEach((slide,i) => {
      slide.style.width = width + 'px';
      slide.style.marginRight = gap + 'px';
      slide.classList.toggle('swiper-slide-active',i===active);
      slide.classList.toggle('swiper-slide-next',i===(active+1)%slides.length);
      slide.classList.toggle('swiper-slide-prev',i===(active+slides.length-1)%slides.length);
    });
    // The live loop keeps the selected slide last in its rendered row.
    for(let offset=1;offset<=slides.length;offset++) wrapper.append(slides[(active+offset)%slides.length]);
    wrapper.style.transitionDuration='0ms';
    wrapper.style.transform=`translate3d(${-(slides.length-1)*(width+gap)}px,0,0)`;
    one('.l-banner__title').classList.remove('is-leaving','is-entering');
    one('.l-banner__desc').classList.remove('is-leaving','is-entering');
    one('.l-banner__title').textContent=copy[active][0];
    one('.l-banner__desc').innerHTML=copy[active][1];
  }
  one('.banner-prev').addEventListener('click',()=>{active=(active+slides.length-1)%slides.length;render()});
  one('.banner-next').addEventListener('click',()=>{active=(active+1)%slides.length;render()});
  window.addEventListener('resize',render);
  render();
  // Keep the original reveal styles and use their existing visibility class.
  const reveal = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  }),{threshold:0.05});
  all('.gsap-slide-up,.gsap-reveal,.gsap-slide-up-group').forEach(el=>reveal.observe(el));
  all('.l-service__item').forEach(el=>el.addEventListener('mouseenter',()=>{
    all('.l-service__item').forEach(n=>n.classList.toggle('l-service__item--active',n===el));
  }));
  const navLinks = new Map(all('footer a[href]').map(a=>[a.textContent.trim(),a.href]));
  all('header a:not([href]),.mobile-menu a:not([href])').forEach(a=>{
    if(navLinks.has(a.textContent.trim())) a.href=navLinks.get(a.textContent.trim());
  });
  const menuButton=one('header button');
  if(menuButton) menuButton.addEventListener('click',()=>{
    const open=one('.mobile-menu').classList.toggle('active');
    menuButton.classList.toggle('active',open);
    menuButton.setAttribute('aria-expanded',String(open));
  });
  // Connected inquiry forms are handled by contact-form.js.
  all('form:not([data-contact-form])').forEach(form=>form.addEventListener('submit',event=>event.preventDefault()));
  all('button').filter(b=>b.textContent.trim()==='TOP').forEach(b=>b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})));
})();
