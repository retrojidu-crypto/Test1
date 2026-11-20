import { ALL_QUOTES } from './data.js';

export function renderQuotesView(container) {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#080808] spa-view-active">
      <header class="border-b border-white/8 bg-[#080808]">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-6">
          <a
            href="index.html"
            data-spa-link="home"
            class="inline-flex items-center gap-2 min-h-[44px] text-xs sm:text-sm text-neutral-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md whitespace-nowrap shrink-0"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m6-6l-6 6 6 6" />
            </svg>
            <span>Back to Home</span>
          </a>
        </div>
      </header>

      <main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
        <section class="border-b border-white/8">
          <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <p class="text-[11px] font-medium uppercase tracking-[0.26em] text-neutral-400">
              Bridge Watch Notes
            </p>
            <h1 class="mt-3 font-serif text-4xl sm:text-5xl font-normal tracking-tight text-white text-balance">
              Words &amp; Reflections
            </h1>
            <p class="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
              Thoughts written between watches at sea, quiet anchorages, and moments framed through a monochrome lens.
            </p>
          </div>
        </section>

        <section aria-label="Featured auto-scrolling quote" class="border-b border-white/8 bg-[#0b0b0b]">
          <div
            id="spotlight-carousel"
            class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 flex flex-col gap-8"
          >
            <div class="flex flex-wrap items-center justify-between gap-4">
              <p id="spotlight-context" class="text-xs tracking-wide text-neutral-400">
                ${ALL_QUOTES[0] ? `${ALL_QUOTES[0].theme} &middot; ${ALL_QUOTES[0].context}` : ''}
              </p>
              <div class="flex items-center gap-3">
                <span id="spotlight-index" class="text-xs font-medium tracking-widest tabular-nums text-neutral-300">
                  ${ALL_QUOTES[0]?.indexLabel || '01 / 01'}
                </span>
                <button
                  id="spotlight-toggle"
                  type="button"
                  aria-pressed="false"
                  class="min-h-[40px] px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium text-neutral-200 hover:bg-white hover:text-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer whitespace-nowrap shrink-0"
                >
                  Pause Auto-Scroll
                </button>
              </div>
            </div>

            <div class="flex items-start gap-4 max-w-4xl">
              <span aria-hidden="true" class="font-serif text-6xl leading-none text-neutral-500 select-none -mt-2">
                &ldquo;
              </span>
              <blockquote
                id="spotlight-quote"
                aria-live="polite"
                class="quote-stage font-serif text-2xl sm:text-4xl leading-snug text-white whitespace-pre-line min-h-[7rem]"
              >${ALL_QUOTES[0]?.text || ''}</blockquote>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div class="w-48 h-px bg-white/15 overflow-hidden rounded-full" aria-hidden="true">
                <div id="spotlight-progress" class="h-full bg-white transition-all duration-300" style="width: ${ALL_QUOTES.length ? 100 / ALL_QUOTES.length : 100}%"></div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  id="spotlight-prev"
                  type="button"
                  aria-label="Previous featured quote"
                  class="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  id="spotlight-next"
                  type="button"
                  aria-label="Next featured quote"
                  class="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="anthology-heading">
          <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div role="tablist" aria-label="Filter quotes by theme" class="flex flex-wrap items-center gap-2">
                ${['All', 'At Sea', 'Photography', 'Horizons', 'Solitude']
                  .map(
                    (theme, idx) => `
                  <button
                    type="button"
                    role="tab"
                    aria-selected="${idx === 0 ? 'true' : 'false'}"
                    data-quote-filter="${theme}"
                    class="min-h-[40px] px-4 py-2 text-xs font-medium rounded-full ${
                      idx === 0 ? 'bg-white text-neutral-950' : 'bg-white/8 text-neutral-300 hover:bg-white/14'
                    } transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    ${theme}
                  </button>`
                  )
                  .join('')}
              </div>

              <p id="quotes-count" class="text-xs tabular-nums text-neutral-400">${String(ALL_QUOTES.length).padStart(2, '0')} Reflections</p>
            </div>

            <h2 id="anthology-heading" class="sr-only">Complete Quote Anthology</h2>
            <div id="quotes-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5"></div>
          </div>
        </section>
      </main>

      <footer class="border-t border-white/8 bg-[#080808]">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-center text-center text-xs text-neutral-400">
          <p>&copy; 2026 Jahidul Islam Jihad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `;

  // Setup Spotlight Auto-Scroll
  const spotlightContainer = container.querySelector('#spotlight-carousel');
  const quoteEl = container.querySelector('#spotlight-quote');
  const contextEl = container.querySelector('#spotlight-context');
  const indexEl = container.querySelector('#spotlight-index');
  const progressBar = container.querySelector('#spotlight-progress');
  const prevBtn = container.querySelector('#spotlight-prev');
  const nextBtn = container.querySelector('#spotlight-next');
  const toggleBtn = container.querySelector('#spotlight-toggle');

  let current = 0;
  let isPlaying = true;
  let isHovered = false;
  let timerId = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateSpotlight(nextIdx) {
    current = (nextIdx + ALL_QUOTES.length) % ALL_QUOTES.length;
    const item = ALL_QUOTES[current];

    const applyUpdate = () => {
      if (!quoteEl || !indexEl) return;
      quoteEl.textContent = item.text;
      if (contextEl) contextEl.textContent = `${item.theme} · ${item.context}`;
      indexEl.textContent = item.indexLabel;
      if (progressBar) {
        progressBar.style.width = `${((current + 1) / ALL_QUOTES.length) * 100}%`;
      }
    };

    if (prefersReducedMotion || !quoteEl) {
      applyUpdate();
      return;
    }

    quoteEl.classList.add('is-fading');
    window.setTimeout(() => {
      applyUpdate();
      quoteEl.classList.remove('is-fading');
    }, 240);
  }

  function startTimer() {
    if (timerId !== null) window.clearInterval(timerId);
    if (prefersReducedMotion) return;
    timerId = window.setInterval(() => {
      if (isPlaying && !isHovered) {
        updateSpotlight(current + 1);
      }
    }, 4500);
  }

  prevBtn?.addEventListener('click', () => {
    updateSpotlight(current - 1);
    startTimer();
  });

  nextBtn?.addEventListener('click', () => {
    updateSpotlight(current + 1);
    startTimer();
  });

  toggleBtn?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    toggleBtn.textContent = isPlaying ? 'Pause Auto-Scroll' : 'Resume Auto-Scroll';
    toggleBtn.setAttribute('aria-pressed', String(!isPlaying));
  });

  spotlightContainer?.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  spotlightContainer?.addEventListener('mouseleave', () => {
    isHovered = false;
  });
  spotlightContainer?.addEventListener('focusin', () => {
    isHovered = true;
  });
  spotlightContainer?.addEventListener('focusout', () => {
    isHovered = false;
  });

  updateSpotlight(0);
  startTimer();

  // Setup Anthology Grid & Filter Tabs
  const grid = container.querySelector('#quotes-grid');
  const tabs = container.querySelectorAll('[data-quote-filter]');
  const countLabel = container.querySelector('#quotes-count');
  let activeTheme = 'All';

  function renderGrid() {
    if (!grid) return;
    const items = activeTheme === 'All' ? ALL_QUOTES : ALL_QUOTES.filter((q) => q.theme === activeTheme);
    if (countLabel) {
      countLabel.textContent = `${String(items.length).padStart(2, '0')} Reflections`;
    }

    grid.innerHTML = '';

    items.forEach((item) => {
      const card = document.createElement('article');
      card.className =
        'flex flex-col justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/10 transition-colors hover:border-white/20';

      const top = document.createElement('div');
      top.className = 'space-y-4';

      const meta = document.createElement('div');
      meta.className = 'flex items-center justify-between text-xs text-neutral-400';

      const themeText = document.createElement('span');
      themeText.textContent = `${item.theme} · ${item.context}`;

      const numText = document.createElement('span');
      numText.className = 'tabular-nums tracking-widest';
      numText.textContent = item.indexLabel;

      meta.append(themeText, numText);

      const blockquote = document.createElement('blockquote');
      blockquote.className = 'font-serif text-xl sm:text-2xl leading-snug text-white whitespace-pre-line';
      blockquote.textContent = `“${item.text}”`;

      top.append(meta, blockquote);

      const bottom = document.createElement('div');
      bottom.className = 'pt-4 border-t border-white/10 flex items-center justify-between gap-4';

      const sig = document.createElement('span');
      sig.className = 'font-serif italic text-sm text-neutral-300';
      sig.textContent = `— ${item.attribution}`;

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className =
        'min-h-[40px] px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium text-neutral-200 hover:bg-white hover:text-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer';
      copyBtn.textContent = 'Copy Quote';
      copyBtn.setAttribute('aria-label', `Copy quote: ${item.text.replace(/\n/g, ' ')}`);

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(`"${item.text.replace(/\n/g, ' ')}" — Jahidul Islam Jihad`);
          copyBtn.textContent = 'Copied';
          window.setTimeout(() => {
            copyBtn.textContent = 'Copy Quote';
          }, 1800);
        } catch {
          copyBtn.textContent = 'Selected';
        }
      });

      bottom.append(sig, copyBtn);
      card.append(top, bottom);
      grid.appendChild(card);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTheme = tab.getAttribute('data-quote-filter') || 'All';
      tabs.forEach((btn) => {
        const isSelected = btn === tab;
        btn.setAttribute('aria-selected', String(isSelected));
        btn.className = isSelected
          ? 'min-h-[40px] px-4 py-2 text-xs font-medium rounded-full bg-white text-neutral-950 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer'
          : 'min-h-[40px] px-4 py-2 text-xs font-medium rounded-full bg-white/8 text-neutral-300 hover:bg-white/14 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer';
      });
      renderGrid();
    });
  });

  renderGrid();

  // Return cleanup function for SPA route changes
  return () => {
    if (timerId !== null) window.clearInterval(timerId);
  };
}
