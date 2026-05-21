const menuToggle = document.querySelector('.mobile-menu-toggle') || document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const headerHomeLink = document.querySelector('[data-header-home-link]');
const donorMenu = document.querySelector('#donor-menu');
const donorMenuToggles = document.querySelectorAll('.donor-menu-toggle');
const donorMenuClose = document.querySelector('.donor-menu-close');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (headerHomeLink) {
  headerHomeLink.addEventListener('click', (event) => {
    const interactiveElement = event.target.closest('a, button, input, select, textarea, label');

    if (interactiveElement) {
      return;
    }

    window.location.href = headerHomeLink.dataset.headerHomeLink || '/';
  });
}

document.querySelectorAll('.donor-search').forEach((form) => {
  const input = form.querySelector('input[type="search"]');
  const button = form.querySelector('button[type="submit"]');
  const livePanel = document.createElement('div');
  let searchAbortController = null;
  let searchTimer = null;

  livePanel.className = 'donor-search-live';
  livePanel.setAttribute('aria-live', 'polite');
  livePanel.hidden = true;
  form.append(livePanel);

  const hideLivePanel = () => {
    livePanel.hidden = true;
    form.classList.remove('has-live-results');
  };

  const showLivePanel = () => {
    livePanel.hidden = false;
    form.classList.add('has-live-results');
  };

  const renderLiveResults = (items, query) => {
    if (!query) {
      livePanel.innerHTML = '';
      hideLivePanel();
      return;
    }

    if (!items.length) {
      livePanel.innerHTML = '<p class="donor-search-empty">Ничего не найдено</p>';
      showLivePanel();
      return;
    }

    livePanel.innerHTML = items.map((item) => `
      <a href="${item.url}">
        <span>${item.title}</span>
        <small>${item.category}</small>
      </a>
    `).join('');
    showLivePanel();
  };

  const updateLiveResults = () => {
    const query = input?.value.trim() || '';

    window.clearTimeout(searchTimer);

    if (!query) {
      searchAbortController?.abort();
      renderLiveResults([], '');
      return;
    }

    searchTimer = window.setTimeout(async () => {
      searchAbortController?.abort();
      searchAbortController = new AbortController();

      try {
        const response = await fetch(`/api/services/search?q=${encodeURIComponent(query)}`, {
          signal: searchAbortController.signal
        });
        const data = await response.json();

        renderLiveResults(data.results || [], query);
      } catch (error) {
        if (error.name !== 'AbortError') {
          hideLivePanel();
        }
      }
    }, 140);
  };

  button?.addEventListener('click', (event) => {
    if (!input || input.value.trim() || document.activeElement === input) {
      return;
    }

    event.preventDefault();
    input.focus();
  });

  input?.addEventListener('input', updateLiveResults);
  input?.addEventListener('focus', updateLiveResults);

  document.addEventListener('click', (event) => {
    if (!form.contains(event.target)) {
      hideLivePanel();
    }
  });

  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideLivePanel();
      input.blur();
    }
  });
});

if (donorMenu && donorMenuToggles.length) {
  const donorSubmenuToggles = donorMenu.querySelectorAll('.donor-submenu-toggle');

  const closeSubmenu = (button) => {
    const item = button.closest('.donor-menu-item');
    const submenu = item?.querySelector(':scope > .donor-submenu');

    if (!item || !submenu || !item.classList.contains('open')) {
      return;
    }

    submenu.querySelectorAll('.donor-submenu-toggle[aria-expanded="true"]').forEach(closeSubmenu);
    item.classList.remove('open');
    submenu.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', button.getAttribute('aria-label')?.replace('Свернуть', 'Раскрыть') || 'Раскрыть');
  };

  const openSubmenu = (button) => {
    const item = button.closest('.donor-menu-item');
    const submenu = item?.querySelector(':scope > .donor-submenu');

    if (!item || !submenu || item.classList.contains('open')) {
      return;
    }

    item.classList.add('open');
    submenu.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', button.getAttribute('aria-label')?.replace('Раскрыть', 'Свернуть') || 'Свернуть');
  };

  const closeAllSubmenus = () => {
    donorSubmenuToggles.forEach(closeSubmenu);
  };

  const setDonorMenuState = (isOpen, mode = donorMenu.dataset.mode || 'primary') => {
    donorMenu.dataset.mode = mode;
    donorMenu.classList.toggle('open', isOpen);
    donorMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    donorMenuToggles.forEach((button) => {
      const isCurrentMode = button.dataset.menuMode === mode;
      button.classList.toggle('active', isOpen && isCurrentMode);
      button.setAttribute('aria-expanded', String(isOpen && isCurrentMode));
      const marker = button.querySelector('.donor-toggle-marker');

      if (marker) {
        marker.textContent = isOpen && isCurrentMode ? '−' : '+';
      }
    });

    if (!isOpen) {
      closeAllSubmenus();
    }
  };

  donorMenuToggles.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.menuMode || 'primary';
      const isSameOpenMenu = donorMenu.classList.contains('open') && donorMenu.dataset.mode === mode;
      setDonorMenuState(!isSameOpenMenu, mode);
    });
  });

  donorMenuClose?.addEventListener('click', () => {
    setDonorMenuState(false);
  });

  donorMenu.addEventListener('click', (event) => {
    if (event.target === donorMenu) {
      setDonorMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setDonorMenuState(false);
    }
  });

  donorSubmenuToggles.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-expanded') === 'true') {
        closeSubmenu(button);
      } else {
        openSubmenu(button);
      }
    });
  });
}

document.querySelectorAll('.main_services_block .services_show').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.main_services_block');
    const isOpen = card?.classList.toggle('open');
    const label = button.querySelector('span');

    button.setAttribute('aria-expanded', String(Boolean(isOpen)));

    if (label) {
      label.textContent = isOpen ? 'Скрыть' : 'Показать все';
    }
  });
});

document.querySelectorAll('[data-souvenir-slider]').forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll('[data-souvenir-slide]'));
  const prevButton = slider.querySelector('[data-souvenir-prev]');
  const nextButton = slider.querySelector('[data-souvenir-next]');
  const progress = slider.querySelector('[data-souvenir-progress]');
  const progressTrack = progress?.querySelector('.souvenir-slider-progress-track');
  const progressFill = slider.querySelector('[data-souvenir-progress-fill]');
  const progressThumb = slider.querySelector('[data-souvenir-progress-thumb]');
  let currentIndex = slides.findIndex((slide) => slide.classList.contains('active'));
  let isDraggingProgress = false;
  let activeProgressPointerId = null;

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  const renderSlide = (nextIndex) => {
    if (!slides.length) {
      return;
    }

    currentIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });

    const percent = slides.length > 1 ? (currentIndex / (slides.length - 1)) * 100 : 0;

    if (progress) {
      progress.setAttribute('aria-valuenow', String(currentIndex + 1));
      progress.setAttribute('aria-valuetext', `${currentIndex + 1} из ${slides.length}`);
      progress.style.setProperty('--souvenir-progress', `${percent}%`);
    }

    if (progressFill) {
      progressFill.style.width = progress?.style.getPropertyValue('--souvenir-progress') || '0%';
    }

    if (progressThumb) {
      const thumbOffset = 18 - (percent / 100) * 36;
      progressThumb.style.left = `calc(${percent}% + ${thumbOffset}px)`;
    }
  };

  const renderSlideFromPointer = (clientX) => {
    if (!progress || !slides.length) {
      return;
    }

    const rect = (progressTrack || progress).getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    renderSlide(Math.round(ratio * (slides.length - 1)));
  };

  prevButton?.addEventListener('click', () => {
    renderSlide(currentIndex - 1);
  });

  nextButton?.addEventListener('click', () => {
    renderSlide(currentIndex + 1);
  });

  progress?.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    isDraggingProgress = true;
    activeProgressPointerId = event.pointerId;
    progress.setPointerCapture?.(event.pointerId);
    renderSlideFromPointer(event.clientX);
  });

  progress?.addEventListener('pointermove', (event) => {
    if (!isDraggingProgress || event.pointerId !== activeProgressPointerId) {
      return;
    }

    renderSlideFromPointer(event.clientX);
  });

  const stopProgressDrag = (event) => {
    if (event && activeProgressPointerId !== null && event.pointerId !== activeProgressPointerId) {
      return;
    }

    isDraggingProgress = false;
    activeProgressPointerId = null;

    if (event?.pointerId !== undefined && progress.hasPointerCapture?.(event.pointerId)) {
      progress.releasePointerCapture(event.pointerId);
    }
  };

  progress?.addEventListener('pointerup', stopProgressDrag);
  progress?.addEventListener('pointercancel', stopProgressDrag);
  progress?.addEventListener('lostpointercapture', stopProgressDrag);
  window.addEventListener('pointerup', stopProgressDrag);
  window.addEventListener('pointercancel', stopProgressDrag);
  window.addEventListener('blur', () => {
    isDraggingProgress = false;
    activeProgressPointerId = null;
  });

  progress?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      renderSlide(currentIndex - 1);
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      renderSlide(currentIndex + 1);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      renderSlide(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      renderSlide(slides.length - 1);
    }
  });

  renderSlide(currentIndex);
});

document.querySelectorAll('[data-fill-service], [data-fill-category]').forEach((button) => {
  button.addEventListener('click', () => {
    const form = document.querySelector('[data-lead-form]');
    const field = form?.querySelector('[name="productOrService"]');
    const category = form?.querySelector('[name="category"]');

    if (field && button.dataset.fillService) {
      field.value = button.dataset.fillService;
    }

    if (category && button.dataset.fillCategory) {
      category.value = button.dataset.fillCategory;
    }
  });
});

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    submitButton.disabled = true;
    status.textContent = 'Отправляем заявку...';
    status.className = 'form-status';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Ошибка отправки');
      }

      status.textContent = result.message;
      status.classList.add('success');
      form.reset();
    } catch (error) {
      status.textContent = 'Не удалось отправить заявку. Проверьте поля или попробуйте позже.';
      status.classList.add('error');
    } finally {
      submitButton.disabled = false;
    }
  });
});
