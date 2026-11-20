import { bindImageShimmer } from './shimmer.js';

let initialized = false;
let activePhotos = [];
let activeIndex = -1;
let lastFocusedEl = null;

function ensureLightboxDom() {
  let modal = document.getElementById('lightbox-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'lightbox-title');
  modal.className =
    'hidden fixed inset-0 z-50 items-center justify-center bg-black/92 backdrop-blur-sm p-4 sm:p-8';

  modal.innerHTML = `
    <div class="relative w-full max-w-5xl bg-[#0e0e0e] border border-white/12 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:grid lg:grid-cols-12">
      <button
        id="lightbox-close"
        type="button"
        aria-label="Close photograph viewer"
        class="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/75 text-white border border-white/15 hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
      >
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div id="lightbox-img-wrap" class="img-shimmer relative lg:col-span-8 bg-black flex items-center justify-center min-h-[260px] sm:min-h-[420px] lg:min-h-[540px]">
        <img
          id="lightbox-image"
          src=""
          alt=""
          referrerPolicy="no-referrer"
          class="w-full h-full max-h-[68vh] object-contain grayscale contrast-110"
        />

        <button
          id="lightbox-prev"
          type="button"
          aria-label="Previous photograph"
          class="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/70 text-white border border-white/15 hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          id="lightbox-next"
          type="button"
          aria-label="Next photograph"
          class="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/70 text-white border border-white/15 hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div class="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/10">
        <div class="space-y-4">
          <p id="lightbox-category" class="text-xs tracking-wide text-neutral-400"></p>
          <h3 id="lightbox-title" class="font-serif text-2xl text-white leading-snug"></h3>
          <p id="lightbox-story" class="text-sm leading-relaxed text-neutral-300"></p>
        </div>
        <div class="space-y-2 pt-4 border-t border-white/10 text-xs text-neutral-400">
          <p id="lightbox-location" class="text-neutral-200 font-medium"></p>
          <p id="lightbox-exif" class="tabular-nums"></p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function renderModal(idx) {
  if (!activePhotos.length) return;
  activeIndex = (idx + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[activeIndex];

  const imgWrap = document.getElementById('lightbox-img-wrap');
  const imgEl = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const categoryEl = document.getElementById('lightbox-category');
  const storyEl = document.getElementById('lightbox-story');
  const locationEl = document.getElementById('lightbox-location');
  const exifEl = document.getElementById('lightbox-exif');

  if (imgEl && imgWrap) {
    imgEl.alt = photo.alt;
    bindImageShimmer(imgEl, imgWrap, null, photo.src);
  }
  if (titleEl) titleEl.textContent = photo.title;
  if (categoryEl) categoryEl.textContent = `${photo.category} · ${photo.year}`;
  if (storyEl) storyEl.textContent = photo.story;
  if (locationEl) locationEl.textContent = photo.location;
  if (exifEl) exifEl.textContent = photo.exif;
}

export function initLightbox() {
  const modal = ensureLightboxDom();
  if (initialized) return;
  initialized = true;

  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const close = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    activeIndex = -1;
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  };

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => renderModal(activeIndex - 1));
  nextBtn?.addEventListener('click', () => renderModal(activeIndex + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (activeIndex === -1) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') renderModal(activeIndex - 1);
    if (e.key === 'ArrowRight') renderModal(activeIndex + 1);
  });
}

export function openLightbox(photos, idx) {
  initLightbox();
  activePhotos = photos;
  lastFocusedEl = document.activeElement;
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  renderModal(idx);
  modal?.classList.remove('hidden');
  modal?.classList.add('flex');
  document.body.style.overflow = 'hidden';
  closeBtn?.focus();
}
