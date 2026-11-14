// Reuse the captured controls and original colors; keep calculation local.
(() => {
  const root = document.querySelector('#calculator');
  if (!root) return;
  const config = JSON.parse(document.querySelector('#fee-config').textContent);
  const sections = [...root.querySelector('.calculator-body').children];
  const identityButtons = [...sections[0].querySelectorAll('[data-identity]')];
  const kindButtons = [...sections[1].querySelectorAll('[data-service-kind]')];
  const dayTemplate = sections[2].cloneNode(true);
  const summary = sections[3];
  let state = {idn:'general',lv:'2',tm:'full',days:0,q:{}};
  let kind = 'day';
  const labels = {day:'日間照護',home:'居家照顧',other:'其他服務'};
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const clamped = (v,max) => Math.min(max,Math.max(0,Math.floor(Number(v)||0)));
  const empty = summary.querySelector('.text-center');
  const valueAfter = label => [...summary.querySelectorAll('div,span')].find(n => n.childElementCount===0 && n.textContent.trim()===label)?.nextElementSibling;
  const rawValue = valueAfter('總費用（未補助）');
  const selfValue = valueAfter('民眾自付額');
  const govtValue = valueAfter('政府補助金額');
  const activeIdentity = identityButtons[0].className;
  const inactiveIdentity = identityButtons[1].className;
  const activeKind = kindButtons[0].className;
  const inactiveKind = kindButtons[1].className;
  const identityDot = identityButtons[0].querySelector('.absolute')?.cloneNode(true);

  function settings(){return root.querySelector('[data-fee-settings]');}
  function render() {
    identityButtons.forEach(b => {
      const active = b.dataset.identity === state.idn;
      b.className = active ? activeIdentity : inactiveIdentity;
      b.setAttribute('aria-pressed',String(active));
      b.querySelector('.absolute')?.remove();
      if(active && identityDot)b.prepend(identityDot.cloneNode(true));
    });
    kindButtons.forEach(b => {
      const active = b.dataset.serviceKind === kind;
      b.className=active?activeKind:inactiveKind;b.setAttribute('aria-pressed',String(active));
    });
    const panel=settings();
    panel.querySelector('select').value=state.lv;
    const activeCodes = [...panel.querySelectorAll('[data-fee-code]')].map(e=>e.dataset.feeCode);
    panel.querySelectorAll('[data-fee-code]').forEach(row => {
      const quantity=state.q[row.dataset.feeCode]||0;
      row.querySelector('[data-quantity]').textContent=quantity;
      row.querySelector('[data-quantity-change="-1"]').disabled=quantity===0;
      row.classList.toggle('border-accent',quantity>0);
      row.classList.toggle('bg-accent-pale',quantity>0);
      row.classList.toggle('border-gray-100',quantity===0);
      row.classList.toggle('bg-white',quantity===0);
    });
    if(kind==='day') {
      panel.querySelectorAll('input').forEach(i=>i.value=state.days);
      panel.querySelector('[data-day-change="-1"]').disabled=state.days===0;
      panel.querySelector('[data-day-change="1"]').disabled=state.days===31;
      panel.querySelectorAll('[data-period]').forEach(b=>{
        const selected=b.dataset.period===state.tm;
        b.classList.toggle('border-accent',selected);b.classList.toggle('bg-accent-pale',selected);
        b.classList.toggle('border-gray-100',!selected);b.classList.toggle('text-primary-light',!selected);
        b.setAttribute('aria-pressed',String(selected));
      });
      const unit=config.dayCareRates[state.lv][state.tm];
      const row=panel.querySelector('.mt-4.flex.items-center.justify-between');
      row.children[0].textContent=`單價 $${fmt(unit)} / ${state.tm==='full'?'全日':'半日'}`;
      row.children[1].textContent=`費用 $${fmt(unit*state.days)}`;
    }
    const q=Object.fromEntries(Object.entries(state.q).filter(([code])=>activeCodes.includes(code)));
    const result=window.JiukangFees.calculate(config,{...state,days:kind==='day'?state.days:0,q});
    summary.querySelector('h2').textContent=`費用試算總表（${labels[kind]}）`;
    empty.textContent=result.det.length ? result.det.map(x=>`${x.name} × ${x.qty}${x.unit}：$${fmt(x.sub)}`).join('\n') : '請先選擇服務項目';
    empty.style.whiteSpace='pre-line';
    if(result.excess+result.rExcess>0)empty.textContent+=`\n超過給付額度部分：$${fmt(result.excess+result.rExcess)}，已計入自付額。`;
    rawValue.textContent='$'+fmt(result.raw);selfValue.textContent='$'+fmt(result.self);govtValue.textContent='$'+fmt(result.gov);
    summary.setAttribute('aria-live','polite');
  }
  function switchKind(next) {
    kind=next;
    const replacement=next==='day'?dayTemplate.cloneNode(true):document.querySelector('#fee-'+next).content.firstElementChild.cloneNode(true);
    settings().replaceWith(replacement);render();
  }
  root.addEventListener('click', e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.identity)state.idn=button.dataset.identity;
    else if(button.dataset.serviceKind){switchKind(button.dataset.serviceKind);return;}
    else if(button.dataset.period)state.tm=button.dataset.period;
    else if(button.dataset.dayChange)state.days=clamped(state.days+Number(button.dataset.dayChange),31);
    else if(button.dataset.quantityChange){
      const code=button.closest('[data-fee-code]').dataset.feeCode;
      state.q[code]=clamped((state.q[code]||0)+Number(button.dataset.quantityChange),9999);
    } else if(button.classList.contains('reset-btn')) {
      state={idn:'general',lv:'2',tm:'full',days:0,q:{}};switchKind('day');return;
    } else return;
    render();
  });
  root.addEventListener('change', e=>{if(e.target.matches('select')){state.lv=e.target.value;render();}});
  root.addEventListener('input', e=>{if(e.target.matches('input[type="number"],input[type="range"]')){state.days=clamped(e.target.value,31);render();}});
  render();
})();
