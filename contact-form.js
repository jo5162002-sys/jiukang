// Shared inquiry delivery for the homepage and contact page.
(() => {
  const publicHost = 'jo5162002-sys.github.io';
  const endpoint = 'https://formsubmit.co/ajax/jiukang.healthcares@gmail.com';
  const fallback = '請稍後再試，或撥 04-2335-0395、寄信至 jiukang.healthcares@gmail.com。';

  document.querySelectorAll('form[data-contact-form]').forEach(form => {
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-contact-status]');
    const success = form.querySelector('[data-contact-success]');
    const originalButton = button.innerHTML;
    let sending = false;
    let sent = false;

    function show(message, ok = false) {
      status.textContent = message;
      status.hidden = !message;
      status.setAttribute('role', ok ? 'status' : 'alert');
      if (message) status.focus({preventScroll: true});
    }

    form.addEventListener('input', () => {
      if (sending) return;
      sent = false;
      show('');
      if (success) success.hidden = true;
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || sent) return;
      show('');
      if (success) success.hidden = true;

      const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')];
      for (const field of fields) {
        if (field.required && !field.value.trim()) {
          show('請填寫姓名與聯絡電話，並選擇希望了解的服務。');
          field.focus();
          return;
        }
      }
      if (!form.reportValidity()) return;
      const phone = form.querySelector('[autocomplete="tel"]').value.trim();
      const digits = phone.replace(/\D/g, '');
      if (!/^[+\d\s().#xX\-分機]+$/.test(phone) || digits.length < 8 || digits.length > 20) {
        show('請填寫可聯絡的電話號碼，例如 04-2335-0395 或手機號碼。');
        form.querySelector('[autocomplete="tel"]').focus();
        return;
      }
      if (form.querySelector('[name="_honey"]').value) {
        show('無法送出這份表單，請重新整理後再試。');
        return;
      }
      if (location.protocol !== 'https:' || location.hostname !== publicHost) {
        show('本機預覽不會寄送資料；請從已發布的久康網站送出諮詢。');
        return;
      }

      const payload = Object.fromEntries(new FormData(form));
      for (const key of Object.keys(payload)) payload[key] = String(payload[key]).trim();
      payload['來源頁面'] = location.origin + location.pathname;
      payload['表單位置'] = form.dataset.contactForm;

      sending = true;
      button.disabled = true;
      button.textContent = '寄送中…';
      form.setAttribute('aria-busy', 'true');
      // Prevent edits from being lost if a request completes while the user types.
      const disabled = fields.map(field => field.disabled);
      fields.forEach(field => { field.disabled = true; });
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
          body: JSON.stringify(payload),
          credentials: 'omit',
          signal: controller.signal
        });
        const result = await response.json();
        // Activation replies are not a delivered inquiry, even if HTTP is 200.
        if (/activat|confirm.{0,30}(email|form)|check.{0,30}(email|inbox)/i.test(String(result.message || ''))) {
          show('諮詢信箱尚待啟用，這次送出尚未完成。請先撥 04-2335-0395 或寄信至 jiukang.healthcares@gmail.com。');
          return;
        }
        if (!response.ok || ![true, 'true'].includes(result.success)) {
          show('目前無法確認諮詢已寄出。' + fallback);
          return;
        }
        form.reset();
        sent = true;
        const message = '您的諮詢已送出，我們將由人員與您聯絡。如需即時詢問，請於服務時間來電 04-2335-0395。';
        if (success) {
          success.textContent = message;
          success.hidden = false;
          success.focus({preventScroll: true});
        } else {
          show(message, true);
        }
      } catch (error) {
        // Never retry automatically: the service may have accepted a timed-out request.
        show('連線中斷或逾時，無法確認是否寄出。內容已保留，為避免重複寄送，請先電話或來信確認。');
      } finally {
        clearTimeout(timeout);
        sending = false;
        button.disabled = false;
        button.innerHTML = originalButton;
        form.removeAttribute('aria-busy');
        fields.forEach((field, i) => { field.disabled = disabled[i]; });
      }
    });
  });
})();
