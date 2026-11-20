import { GALLERY_PHOTOS } from './data.js';
import { bindImageShimmer, createFallbackTile } from './shimmer.js';
import { openLightbox } from './lightbox.js';

export function renderGalleryView(container) {
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
              Monochrome Archive
            </p>
            <h1 class="mt-3 font-serif text-4xl sm:text-5xl font-normal tracking-tight text-white text-balance">
              Through the Lens
            </h1>
            <p class="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
              Sailing through life, capturing its beauty — open waters, quiet shores, and architectural geometry in black and white.
            </p>
          </div>
        </section>

        <section aria-labelledby="archive-heading">
          <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div role="tablist" aria-label="Filter photographs by category" class="flex flex-wrap items-center gap-2">
                ${['All', 'Seascapes', 'Voyages', 'Architecture', 'Solitude']
                  .map(
                    (cat, idx) => `
                  <button
                    type="button"
                    role="tab"
                    aria-selected="${idx === 0 ? 'true' : 'false'}"
                    data-gallery-filter="${cat}"
                    class="min-h-[40px] px-4 py-2 text-xs font-medium rounded-full ${
                      idx === 0 ? 'bg-white text-neutral-950' : 'bg-white/8 text-neutral-300 hover:bg-white/14'
                    } transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    ${cat}
                  </button>`
                  )
                  .join('')}
              </div>

              <p id="archive-count" class="text-xs tabular-nums text-neutral-400">08 Frames</p>
            </div>

            <h2 id="archive-heading" class="sr-only">Photography Collection</h2>
            <div id="archive-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
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

  const grid = container.querySelector('#archive-grid');
  const tabs = container.querySelectorAll('[data-gallery-filter]');
  const countEl = container.querySelector('#archive-count');
  let activeCategory = 'All';
  let filteredPhotos = [...GALLERY_PHOTOS];

  function renderGrid() {
    if (!grid) return;
    filteredPhotos =
      activeCategory === 'All'
        ? [...GALLERY_PHOTOS]
        : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

    if (countEl) {
      countEl.textContent = `${String(filteredPhotos.length).padStart(2, '0')} Frames`;
    }

    grid.innerHTML = '';

    filteredPhotos.forEach((photo, idx) => {
      const card = document.createElement('article');
      card.className = 'flex flex-col gap-3';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'img-shimmer group relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] cursor-pointer';
      btn.setAttribute('aria-label', `Inspect photograph: ${photo.title}`);

      const img = document.createElement('img');
      img.alt = photo.alt;
      img.loading = 'eager';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.className = 'w-full h-full object-cover grayscale contrast-110 group-hover:scale-[1.04]';

      bindImageShimmer(
        img,
        btn,
        () => {
          img.replaceWith(createFallbackTile(photo.title));
        },
        photo.src
      );

      const scrim = document.createElement('div');
      scrim.setAttribute('aria-hidden', 'true');
      scrim.className =
        'absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-end p-4';

      const prompt = document.createElement('span');
      prompt.className = 'text-xs font-medium text-white tracking-wide';
      prompt.textContent = 'View Frame';
      scrim.appendChild(prompt);

      btn.append(img, scrim);
      btn.addEventListener('click', () => openLightbox(filteredPhotos, idx));

      const caption = document.createElement('div');
      caption.className = 'px-0.5 space-y-1';

      const heading = document.createElement('h2');
      heading.className = 'font-serif text-lg text-white leading-snug';
      heading.textContent = photo.title;

      const meta = document.createElement('p');
      meta.className = 'text-xs text-neutral-400';
      meta.textContent = `${photo.category} · ${photo.location} · ${photo.year}`;

      const exif = document.createElement('p');
      exif.className = 'text-[11px] tabular-nums text-neutral-500';
      exif.textContent = photo.exif;

      caption.append(heading, meta, exif);
      card.append(btn, caption);
      grid.appendChild(card);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.getAttribute('data-gallery-filter') || 'All';
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
}
