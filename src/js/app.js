import { HERO_MEDIA, HOME_QUOTES, GALLERY_PHOTOS, loadPortfolioData } from './data.js';
import { bindImageShimmer, createFallbackTile } from './shimmer.js';
import { initLightbox, openLightbox } from './lightbox.js';
import { renderQuotesView } from './quotesView.js';
import { renderGalleryView } from './galleryView.js';
import { renderBlogView } from './blogView.js';

const ROUTE_META = {
  home: {
    path: './index.html',
    title: 'Jahidul Islam Jihad — Mariner & Photographer',
    label: 'Home',
  },
  quotes: {
    path: './quotes.html',
    title: 'Quotes — Jahidul Islam Jihad',
    label: 'Quotes',
  },
  gallery: {
    path: './gallery.html',
    title: 'Gallery — Jahidul Islam Jihad',
    label: 'Gallery',
  },
  blog: {
    path: './blog.html',
    title: 'Sea Journal & Blog — Jahidul Islam Jihad',
    label: 'Sea Journal',
  },
};

function resolveRouteFromLocation() {
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith('/quotes.html') || path.endsWith('/quotes')) return 'quotes';
  if (path.endsWith('/gallery.html') || path.endsWith('/gallery')) return 'gallery';
  if (path.endsWith('/blog.html') || path.endsWith('/blog')) return 'blog';
  if (path.endsWith('/index.html')) return 'home';
  return document.body.getAttribute('data-route') || 'home';
}

function waitForImagesAndMinTime(
  images,
  minDurationMs,
  startTime,
  onComplete,
  maxTimeoutMs = 8000
) {
  let done = false;
  const finishIfReady = () => {
    if (done) return;
    done = true;
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDurationMs - elapsed);
    if (remaining === 0) {
      onComplete();
    } else {
      window.setTimeout(onComplete, remaining);
    }
  };

  const validImgs = Array.from(images || []).filter(Boolean);
  if (validImgs.length === 0) {
    finishIfReady();
    return;
  }

  let settledCount = 0;
  const markOneSettled = () => {
    settledCount += 1;
    if (settledCount >= validImgs.length) {
      finishIfReady();
    }
  };

  validImgs.forEach((img) => {
    if (img.complete) {
      markOneSettled();
      return;
    }
    let marked = false;
    const mark = () => {
      if (marked) return;
      marked = true;
      markOneSettled();
    };
    img.addEventListener('load', mark, { once: true });
    img.addEventListener('error', mark, { once: true });
    if (typeof img.decode === 'function') {
      img.decode().then(mark).catch(() => {});
    }
  });

  window.setTimeout(finishIfReady, maxTimeoutMs);
}

function dismissPreloader() {
  const preloader = document.getElementById('page-preloader');
  if (!preloader) return;
  preloader.classList.add('is-hidden');
  preloader.setAttribute('aria-hidden', 'true');
  window.setTimeout(() => {
    preloader.style.display = 'none';
  }, 460);
}

function waitForInitialPreload(images) {
  const preloader = document.getElementById('page-preloader');
  if (!preloader) {
    return;
  }

  const startTime =
    typeof window.__preloaderStart === 'number' ? window.__preloaderStart : Date.now();
  waitForImagesAndMinTime(images, 700, startTime, dismissPreloader, 8000);
}

let compassHideTimer = null;

function ensureCompassOverlay() {
  let overlay = document.getElementById('route-compass-loader');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'route-compass-loader';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.className =
    'route-compass-overlay is-hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808]/95 backdrop-blur-sm';

  overlay.innerHTML = `
    <svg
      viewBox="0 0 96 96"
      class="w-20 h-20 text-neutral-200"
      fill="none"
      aria-hidden="true"
    >
      <!-- Outer Compass Bezel -->
      <circle cx="48" cy="48" r="38" stroke="currentColor" stroke-opacity="0.24" stroke-width="1.25" />
      <circle cx="48" cy="48" r="32" stroke="currentColor" stroke-opacity="0.65" stroke-width="1.5" />

      <!-- Slowly Rotating Degree Rose & Ticks -->
      <g class="compass-rose-spin">
        <line x1="48" y1="10" x2="48" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <line x1="48" y1="79" x2="48" y2="86" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <line x1="10" y1="48" x2="17" y2="48" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <line x1="79" y1="48" x2="86" y2="48" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <line x1="21.1" y1="21.1" x2="25.5" y2="25.5" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.3" stroke-linecap="round" />
        <line x1="70.5" y1="70.5" x2="74.9" y2="74.9" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.3" stroke-linecap="round" />
        <line x1="74.9" y1="21.1" x2="70.5" y2="25.5" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.3" stroke-linecap="round" />
        <line x1="25.5" y1="70.5" x2="21.1" y2="74.9" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.3" stroke-linecap="round" />
      </g>

      <!-- Cardinal Labels -->
      <text x="48" y="25" text-anchor="middle" fill="currentColor" font-size="6.5" font-weight="600" letter-spacing="0.12em">N</text>
      <text x="48" y="75.5" text-anchor="middle" fill="currentColor" fill-opacity="0.5" font-size="5.5" letter-spacing="0.12em">S</text>
      <text x="72.5" y="50" text-anchor="middle" fill="currentColor" fill-opacity="0.5" font-size="5.5" letter-spacing="0.12em">E</text>
      <text x="23.5" y="50" text-anchor="middle" fill="currentColor" fill-opacity="0.5" font-size="5.5" letter-spacing="0.12em">W</text>

      <!-- Oscillating Marine Compass Needle -->
      <g class="compass-needle-seek">
        <polygon points="48,22 52.2,48 48,45 43.8,48" fill="currentColor" />
        <polygon points="48,74 52.2,48 48,51 43.8,48" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-opacity="0.6" stroke-width="0.9" />
      </g>

      <!-- Pivot Cap -->
      <circle cx="48" cy="48" r="3" fill="#080808" stroke="currentColor" stroke-width="1.5" />
    </svg>
    <p id="route-compass-label" class="mt-4 font-serif italic text-xs tracking-[0.22em] text-neutral-300">
      Charting Course
    </p>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

function showCompassLoader(routeLabel) {
  if (compassHideTimer !== null) {
    window.clearTimeout(compassHideTimer);
    compassHideTimer = null;
  }
  const overlay = ensureCompassOverlay();
  const labelEl = overlay.querySelector('#route-compass-label');
  if (labelEl) {
    labelEl.textContent = routeLabel ? `Navigating · ${routeLabel}` : 'Charting Course';
  }
  overlay.style.display = 'flex';
  void overlay.offsetWidth;
  overlay.classList.remove('is-hidden');
  overlay.setAttribute('aria-hidden', 'false');
}

function hideCompassLoader() {
  const overlay = document.getElementById('route-compass-loader');
  if (!overlay) return;
  overlay.classList.add('is-hidden');
  overlay.setAttribute('aria-hidden', 'true');
  compassHideTimer = window.setTimeout(() => {
    if (overlay.classList.contains('is-hidden')) {
      overlay.style.display = 'none';
    }
  }, 280);
}

function renderShipWaveIndicator() {
  return `
    <span class="wave-viewport-mask inline-flex flex-col items-center justify-center overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 84 44" class="w-16 h-10 text-neutral-200 group-hover:text-white transition-colors" fill="none">
        <!-- Detailed Ocean Vessel Silhouette with Natural Swell Heave -->
        <g class="ship-swell">
          <!-- Hull -->
          <path
            d="M21 23.5H63.5L59 29.2C58.6 29.7 58 30 57.3 30H25.2C24.5 30 23.9 29.6 23.5 29L21 23.5Z"
            fill="currentColor"
            fill-opacity="0.14"
            stroke="currentColor"
            stroke-width="1.35"
            stroke-linejoin="round"
          />
          <!-- Bow sheer & deckhouse bridge -->
          <path
            d="M31 23.5V17.5H45.5V23.5M34 17.5V14H42V17.5"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linejoin="round"
          />
          <!-- Mast, yardarm & funnel -->
          <path
            d="M38 14V8.5M34.5 11H41.5M49 23.5V18.5H52.5V23.5"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <!-- Tiny bridge windows -->
          <line x1="35.5" y1="15.8" x2="40.5" y2="15.8" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-opacity="0.7" />
        </g>

        <!-- Seamless Looping 2-Line Waves (200% width path translated smoothly by -50%) -->
        <g class="wave-track-1">
          <path
            d="M0 32.5 C7 30 14 30 21 32.5 C28 35 35 35 42 32.5 C49 30 56 30 63 32.5 C70 35 77 35 84 32.5 C91 30 98 30 105 32.5 C112 35 119 35 126 32.5 C133 30 140 30 147 32.5 C154 35 161 35 168 32.5"
            stroke="currentColor"
            stroke-width="1.35"
            stroke-linecap="round"
          />
        </g>
        <g class="wave-track-2">
          <path
            d="M0 37.5 C7 35 14 35 21 37.5 C28 40 35 40 42 37.5 C49 35 56 35 63 37.5 C70 40 77 40 84 37.5 C91 35 98 35 105 37.5 C112 40 119 40 126 37.5 C133 35 140 35 147 37.5 C154 40 161 40 168 37.5"
            stroke="currentColor"
            stroke-opacity="0.52"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </g>
      </svg>
    </span>
  `;
}

function renderQuoteSignature(signatureId) {
  switch (signatureId) {
    case 'jihad-monogram':
      return `
        <svg viewBox="0 0 116 42" class="w-22 h-8 text-neutral-300" fill="none" aria-label="Signed J. I. Jihad" role="img">
          <path d="M12 10C18 8 22 14 19 25C17 33 11 35 15 27C19 19 28 11 34 11C31 20 29 26 32 27C35 28 42 19 46 14C44 22 44 26 48 25C52 24 58 17 62 12C65 9 60 25 65 25C69 25 75 18 80 18C77 22 77 25 81 24C86 23 94 17 104 14" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M26 24H39M70 11L72 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>`;
    case 'jihad-lens':
      return `
        <svg viewBox="0 0 116 42" class="w-22 h-8 text-neutral-300" fill="none" aria-label="Signed Jihad — Lens" role="img">
          <path d="M15 24C22 13 30 7 33 8C35 9 27 31 21 35C16 38 11 34 15 28C19 22 33 19 41 20C39 24 39 27 42 26C46 25 53 16 58 14C55 21 55 26 60 25C65 24 72 18 78 19C76 23 78 26 84 24C91 22 99 16 106 16" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 32C40 29 72 28 102 30" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.15" stroke-linecap="round" />
        </svg>`;
    case 'jahidul-full':
      return `
        <svg viewBox="0 0 120 42" class="w-24 h-8 text-neutral-300" fill="none" aria-label="Signed Jahidul Islam" role="img">
          <path d="M10 27C18 14 25 6 29 7C31 8 22 32 16 36C11 39 7 34 12 28C17 22 27 19 34 21C32 25 32 27 35 26C39 25 44 18 48 12C49 9 45 26 49 26C53 26 59 18 63 14C62 21 63 25 67 24C71 23 76 16 80 10C82 7 77 25 81 25C85 25 90 20 94 19C92 23 93 25 97 24C102 23 108 18 113 15" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M41 13L42 12M65 11L66 10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>`;
    case 'jihad-classic':
    default:
      return `
        <svg viewBox="0 0 110 42" class="w-20 h-8 text-neutral-300" fill="none" aria-label="Signed Jihad" role="img">
          <path d="M14 26C21 15 28 7 32 7C34 7 25 32 19 36C14 39 9 35 13 29C17 23 30 18 37 19C35 24 34 27 36 27C39 27 44 21 47 16C48 14 45 26 49 26C53 26 59 16 64 11C66 9 61 25 65 25C68 25 73 20 77 19C74 22 74 25 77 25C81 25 88 18 93 15C90 21 89 26 93 25C97 24 102 20 105 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M42 13L43 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>`;
  }
}

function renderHomeView(container, { waitPreloader = false } = {}) {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#080808] spa-view-active">
      <main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
        <!-- HEADER / HERO SECTION (Full Header Background Portrait Behind Greeting & Restored Shadow Vignette) -->
        <section
          id="home"
          aria-label="Introduction"
          class="relative overflow-hidden bg-[#080808] border-b border-white/8"
        >
          <!-- Header Background Portrait Stage Behind Intro Text (NO unnecessary circle) -->
          <div aria-hidden="true" class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="relative w-full h-full md:ml-[18%] md:w-[82%] lg:ml-[22%] lg:w-[78%]">
              <!-- User Portrait in Header Background (NO shimmer) -->
              <img
                id="hero-portrait"
                src="${HERO_MEDIA.portrait}"
                alt="${HERO_MEDIA.alt}"
                referrerPolicy="no-referrer"
                class="w-full h-full object-cover object-[50%_14%] md:object-[58%_16%] grayscale contrast-115 opacity-85"
              />

              <!-- Multi-Directional Darkroom Vignette Shadows for Crisp Text Legibility -->
              <div class="hero-portrait-vignette absolute inset-0"></div>
              <div class="absolute inset-y-0 left-0 w-4/5 md:w-3/5 bg-gradient-to-r from-[#080808]/85 via-[#080808]/55 md:from-[#080808] md:via-[#080808]/78 to-transparent"></div>
              <div class="hidden md:block absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#080808]/80 to-transparent"></div>
              <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#080808]/60 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 h-3/4 md:h-40 bg-gradient-to-t from-[#080808] via-[#080808]/82 to-transparent"></div>
            </div>
          </div>

          <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-56 sm:pt-64 pb-10 md:py-20 lg:py-24">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              <!-- Editorial Typography Column Overlaid on Background Shadow -->
              <div class="md:col-span-5 flex flex-col justify-between md:min-h-[420px] lg:min-h-[460px]">
                <div class="space-y-5">
                  <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-400">
                    Hello, I&apos;m
                  </p>

                  <h1 class="font-serif font-normal text-[40px] sm:text-[48px] lg:text-[60px] leading-[1.03] tracking-tight text-white">
                    Jahidul Islam
                    <span class="block italic font-normal text-[36px] sm:text-[44px] lg:text-[56px] text-neutral-100 mt-1">
                      Jihad
                    </span>
                  </h1>

                  <div class="flex items-start gap-4 pt-1">
                    <span aria-hidden="true" class="w-8 h-px bg-white/35 mt-3 shrink-0"></span>
                    <p class="text-sm sm:text-base leading-relaxed text-neutral-300">
                      A Mariner by Profession,
                      <br />
                      A Photographer by Passion.
                    </p>
                  </div>

                  <p class="font-serif italic text-sm text-neutral-400 pt-1">
                    &ldquo;Sailing through life, capturing its beauty...&rdquo;
                  </p>
                </div>

                <!-- Smooth Realistic Ship & 2-Line Wave Scroll Cue -->
                <div class="mt-8 md:mt-10 flex items-center justify-center md:justify-start">
                  <a
                    href="#quotes"
                    aria-label="Scroll down to quotes, biography, and gallery"
                    title="Scroll down"
                    class="inline-flex items-center justify-center min-h-[44px] min-w-[56px] px-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group"
                  >
                    ${renderShipWaveIndicator()}
                  </a>
                </div>
              </div>

              <div aria-hidden="true" class="hidden md:block md:col-span-7 pointer-events-none"></div>
            </div>
          </div>
        </section>

        <!-- QUOTES, BIO, MARITIME STATS & DEDICATED EXPLORE ACTIONS -->
        <section
          id="quotes"
          aria-label="Philosophy, biography, and maritime milestones"
          class="bg-[#080808] border-b border-white/8"
        >
          <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-center">
              <!-- Column 1: Auto-Scrolling Quote Carousel -->
              <div id="quote-carousel" class="lg:col-span-4 lg:pr-10 flex flex-col justify-between">
                <div class="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    class="font-serif text-5xl leading-none text-neutral-500 select-none -mt-2"
                  >
                    &ldquo;
                  </span>
                  <blockquote
                    id="quote-text"
                    aria-live="polite"
                    class="quote-stage font-serif text-xl sm:text-2xl leading-snug text-neutral-100 whitespace-pre-line min-h-[5.5rem]"
                  >${HOME_QUOTES[0]?.text || ''}</blockquote>
                </div>

                <div class="mt-5 pl-8 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <button
                      id="quote-prev"
                      type="button"
                      aria-label="Previous quote"
                      class="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>

                    <span
                      id="quote-index"
                      class="text-xs font-medium tracking-widest tabular-nums text-neutral-400 px-1"
                    >
                      ${HOME_QUOTES[0]?.indexLabel || '01 / 01'}
                    </span>

                    <button
                      id="quote-next"
                      type="button"
                      aria-label="Next quote"
                      class="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>

                  <div id="quote-signature" class="quote-stage shrink-0">
                    ${renderQuoteSignature(HOME_QUOTES[0]?.signatureId)}
                  </div>
                </div>
              </div>

              <!-- Column 2: Short Bio -->
              <div class="lg:col-span-5 lg:px-10 lg:border-l lg:border-white/10">
                <p class="text-sm sm:text-[15px] leading-[1.75] text-neutral-400 max-w-prose">
                  I&apos;m a <strong class="font-semibold text-white">sailor at heart</strong>, a
                  photographer by passion, and a lifelong learner. Through my lens and words, I try to
                  find beauty in the ordinary, peace in the chaos, and meaning in every moment.
                </p>
              </div>

              <!-- Column 3: Maritime & Photography Metrics -->
              <div class="lg:col-span-3 lg:pl-10 lg:border-l lg:border-white/10 w-full">
                <dl class="grid grid-cols-3 gap-4 sm:gap-6 text-center lg:text-left">
                  <div class="flex flex-col items-center lg:items-start">
                    <dt class="order-2 mt-1.5 text-[11px] sm:text-xs leading-snug text-neutral-400">
                      Countries<br />Visited
                    </dt>
                    <dd class="order-1 font-serif text-2xl sm:text-3xl font-normal tracking-tight tabular-nums text-white">
                      08+
                    </dd>
                  </div>
                  <div class="flex flex-col items-center lg:items-start">
                    <dt class="order-2 mt-1.5 text-[11px] sm:text-xs leading-snug text-neutral-400">
                      Moments<br />Captured
                    </dt>
                    <dd class="order-1 font-serif text-2xl sm:text-3xl font-normal tracking-tight tabular-nums text-white">
                      1K+
                    </dd>
                  </div>
                  <div class="flex flex-col items-center lg:items-start">
                    <dt class="order-2 mt-1.5 text-[11px] sm:text-xs leading-snug text-neutral-400">
                      Stories<br />To Tell
                    </dt>
                    <dd class="order-1 font-serif text-2xl sm:text-3xl font-normal tracking-tight tabular-nums text-white">
                      &infin;
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Dedicated Eye-Catching Editorial Action Strip -->
            <div class="mt-10 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <p class="text-xs sm:text-sm text-neutral-400">
                Explore collected reflections and stories written between watches at sea.
              </p>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <a
                  href="./quotes.html"
                  data-spa-link="quotes"
                  class="inline-flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-2.5 rounded-full border border-white/25 bg-white/[0.04] text-xs sm:text-sm font-medium tracking-wide text-white hover:bg-white hover:text-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
                >
                  <span>All Quotes</span>
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                  </svg>
                </a>

                <a
                  href="./blog.html"
                  data-spa-link="blog"
                  class="inline-flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-2.5 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] whitespace-nowrap shrink-0"
                >
                  <span>Read Sea Journal &amp; Essays</span>
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- MY GALLERY SECTION -->
        <section
          id="gallery"
          aria-labelledby="gallery-heading"
          class="bg-[#080808] border-b border-white/8"
        >
          <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <div class="flex items-center justify-between gap-4 mb-8">
              <div class="flex items-center gap-4">
                <span aria-hidden="true" class="hidden sm:block w-8 h-px bg-neutral-500"></span>
                <h2
                  id="gallery-heading"
                  class="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-white"
                >
                  My Gallery
                </h2>
              </div>

              <a
                href="./gallery.html"
                data-spa-link="gallery"
                class="inline-flex items-center gap-2 min-h-[44px] px-2 text-xs sm:text-sm font-medium tracking-wide text-neutral-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md whitespace-nowrap shrink-0"
              >
                <span class="md:hidden">See My World</span>
                <span class="hidden md:inline">Explore More</span>
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <!-- Mobile Horizontal Strip with Right-Edge Fade Hint & Pagination Dots -->
            <div class="md:hidden relative">
              <div
                id="mobile-gallery-strip"
                class="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 pr-10 no-scrollbar"
              ></div>
              <div
                id="mobile-gallery-fade"
                aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#080808] via-[#080808]/75 to-transparent transition-opacity duration-200"
              ></div>
            </div>
            <div
              id="mobile-gallery-dots"
              role="group"
              aria-label="Mobile gallery slide indicators"
              class="md:hidden mt-4 flex items-center justify-center gap-1.5"
            ></div>

            <div id="desktop-bento-grid" class="hidden md:grid md:grid-cols-12 gap-3"></div>
          </div>
        </section>
      </main>

      <!-- CONTACT & FOOTER -->
      <footer id="contact" aria-labelledby="connect-heading" class="bg-[#080808]">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-8 md:pt-20 md:pb-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <!-- Left Centered Info & Socials -->
            <div class="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <h2
                id="connect-heading"
                class="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white"
              >
                Let&apos;s Connect
              </h2>

              <p class="text-sm sm:text-[15px] leading-relaxed text-neutral-400">
                Have a thought? Let&apos;s talk.
              </p>

              <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Jahidul Islam Jihad on YouTube"
                  class="social-icon-btn inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 border border-white/12 text-neutral-300 hover:-translate-y-1 hover:bg-white hover:text-neutral-950 hover:border-white hover:shadow-[0_6px_20px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Jahidul Islam Jihad on Instagram"
                  class="social-icon-btn inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 border border-white/12 text-neutral-300 hover:-translate-y-1 hover:bg-white hover:text-neutral-950 hover:border-white hover:shadow-[0_6px_20px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Jahidul Islam Jihad on LinkedIn"
                  class="social-icon-btn inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 border border-white/12 text-neutral-300 hover:-translate-y-1 hover:bg-white hover:text-neutral-950 hover:border-white hover:shadow-[0_6px_20px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Jahidul Islam Jihad on GitHub"
                  class="social-icon-btn inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 border border-white/12 text-neutral-300 hover:-translate-y-1 hover:bg-white hover:text-neutral-950 hover:border-white hover:shadow-[0_6px_20px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Jahidul Islam Jihad on X"
                  class="social-icon-btn inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 border border-white/12 text-neutral-300 hover:-translate-y-1 hover:bg-white hover:text-neutral-950 hover:border-white hover:shadow-[0_6px_20px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Right Contained Contact Form Card -->
            <div class="lg:col-span-7">
              <div class="rounded-2xl bg-[#0e0e0e] border border-white/10 p-6 sm:p-8">
                <div
                  id="contact-success"
                  role="status"
                  aria-live="polite"
                  class="hidden flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p class="font-serif text-xl text-white">
                      Message received, <span id="contact-success-name"></span>.
                    </p>
                    <p class="text-sm text-neutral-400 mt-1">
                      Thank you for reaching out. I will respond as soon as the vessel reaches port.
                    </p>
                  </div>
                  <button
                    id="contact-reset"
                    type="button"
                    class="min-h-[44px] px-5 py-2 rounded-full border border-white/25 text-xs font-medium text-white hover:bg-white hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    Send Another
                  </button>
                </div>

                <form id="contact-form" novalidate class="space-y-5">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex flex-col">
                      <label for="contact-name" class="text-xs font-medium text-neutral-300 mb-2">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autocomplete="name"
                        placeholder="e.g. Tariq Rahman"
                        aria-describedby="contact-name-error"
                        class="w-full min-h-[46px] px-4 py-3 rounded-lg bg-[#080808] border border-white/12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/45 focus-visible:ring-2 focus-visible:ring-white transition-colors"
                      />
                      <p id="contact-name-error" class="hidden mt-1.5 text-xs text-red-400"></p>
                    </div>

                    <div class="flex flex-col">
                      <label for="contact-email" class="text-xs font-medium text-neutral-300 mb-2">
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        placeholder="you@example.com"
                        aria-describedby="contact-email-error"
                        class="w-full min-h-[46px] px-4 py-3 rounded-lg bg-[#080808] border border-white/12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/45 focus-visible:ring-2 focus-visible:ring-white transition-colors"
                      />
                      <p id="contact-email-error" class="hidden mt-1.5 text-xs text-red-400"></p>
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <label for="contact-message" class="text-xs font-medium text-neutral-300 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      placeholder="Write your message or inquiry..."
                      aria-describedby="contact-message-error"
                      class="w-full px-4 py-3 rounded-lg bg-[#080808] border border-white/12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/45 focus-visible:ring-2 focus-visible:ring-white transition-colors resize-none"
                    ></textarea>
                    <p id="contact-message-error" class="hidden mt-1.5 text-xs text-red-400"></p>
                  </div>

                  <div class="pt-1 flex justify-end">
                    <button
                      type="submit"
                      class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[46px] px-7 py-2.5 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-medium hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0e] cursor-pointer"
                    >
                      <span>Send Message</span>
                      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="mt-14 pt-6 border-t border-white/8 flex items-center justify-center text-center text-xs text-neutral-400">
            <p>&copy; 2026 Jahidul Islam Jihad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `;

  if (waitPreloader) {
    waitForInitialPreload([container.querySelector('#hero-portrait')]);
  }

  // Initialize Auto-Scrolling Quotes & Swapping Signatures
  const quoteCarousel = container.querySelector('#quote-carousel');
  const quoteEl = container.querySelector('#quote-text');
  const indexEl = container.querySelector('#quote-index');
  const signatureEl = container.querySelector('#quote-signature');
  const prevBtn = container.querySelector('#quote-prev');
  const nextBtn = container.querySelector('#quote-next');

  container.querySelectorAll('.social-icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.remove('is-clicked');
      void btn.offsetWidth;
      btn.classList.add('is-clicked');
    });
  });

  let currentIndex = 0;
  let timerId = null;
  let isPaused = false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderQuote(nextIdx) {
    currentIndex = (nextIdx + HOME_QUOTES.length) % HOME_QUOTES.length;
    const item = HOME_QUOTES[currentIndex];
    if (!quoteEl || !indexEl) return;

    if (prefersReducedMotion) {
      quoteEl.textContent = item.text;
      indexEl.textContent = item.indexLabel;
      if (signatureEl) signatureEl.innerHTML = renderQuoteSignature(item.signatureId);
      return;
    }

    quoteEl.classList.add('is-fading');
    signatureEl?.classList.add('is-fading');
    window.setTimeout(() => {
      quoteEl.textContent = item.text;
      indexEl.textContent = item.indexLabel;
      if (signatureEl) signatureEl.innerHTML = renderQuoteSignature(item.signatureId);
      quoteEl.classList.remove('is-fading');
      signatureEl?.classList.remove('is-fading');
    }, 240);
  }

  function startAutoScroll() {
    if (timerId !== null) window.clearInterval(timerId);
    if (prefersReducedMotion) return;
    timerId = window.setInterval(() => {
      if (!isPaused) renderQuote(currentIndex + 1);
    }, 4500);
  }

  prevBtn?.addEventListener('click', () => {
    renderQuote(currentIndex - 1);
    startAutoScroll();
  });
  nextBtn?.addEventListener('click', () => {
    renderQuote(currentIndex + 1);
    startAutoScroll();
  });
  quoteCarousel?.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  quoteCarousel?.addEventListener('mouseleave', () => {
    isPaused = false;
  });
  quoteCarousel?.addEventListener('focusin', () => {
    isPaused = true;
  });
  quoteCarousel?.addEventListener('focusout', () => {
    isPaused = false;
  });

  startAutoScroll();

  // Initialize Home Bento & Mobile Strip with Shimmer ONLY on gallery tiles
  function createTile(photo, idx, extraClasses) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `img-shimmer group relative overflow-hidden rounded-xl border border-white/10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] cursor-pointer ${extraClasses}`;
    button.setAttribute('aria-label', `View photograph: ${photo.title} (${photo.category})`);

    const img = document.createElement('img');
    img.alt = photo.alt;
    img.loading = 'eager';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.className = 'w-full h-full object-cover grayscale contrast-110 group-hover:scale-[1.04]';

    bindImageShimmer(
      img,
      button,
      () => {
        img.replaceWith(createFallbackTile(photo.title));
      },
      photo.src
    );

    const scrim = document.createElement('div');
    scrim.setAttribute('aria-hidden', 'true');
    scrim.className =
      'absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3.5';

    const title = document.createElement('p');
    title.className = 'font-serif text-sm text-white leading-snug';
    title.textContent = photo.title;

    const meta = document.createElement('p');
    meta.className = 'text-[11px] text-neutral-300 mt-0.5';
    meta.textContent = `${photo.location} · ${photo.year}`;

    scrim.append(title, meta);
    button.append(img, scrim);
    button.addEventListener('click', () => openLightbox(GALLERY_PHOTOS, idx));
    return button;
  }

  const mobileTrack = container.querySelector('#mobile-gallery-strip');
  const mobileFade = container.querySelector('#mobile-gallery-fade');
  const mobileDots = container.querySelector('#mobile-gallery-dots');
  const desktopBento = container.querySelector('#desktop-bento-grid');

  const mobileTileButtons = [];
  const mobileDotButtons = [];
  let onMobileStripScroll = null;

  if (mobileTrack) {
    GALLERY_PHOTOS.forEach((photo, idx) => {
      const tile = createTile(
        photo,
        idx,
        'snap-start shrink-0 w-[42vw] min-w-[148px] max-w-[200px] aspect-[4/3]'
      );
      mobileTileButtons.push(tile);
      mobileTrack.appendChild(tile);

      if (mobileDots) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Jump to photo ${idx + 1}: ${photo.title}`);
        dot.className =
          idx === 0
            ? 'h-1.5 w-5 rounded-full bg-white transition-all duration-200 cursor-pointer'
            : 'h-1.5 w-1.5 rounded-full bg-white/25 hover:bg-white/50 transition-all duration-200 cursor-pointer';
        dot.addEventListener('click', () => {
          tile.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
        mobileDotButtons.push(dot);
        mobileDots.appendChild(dot);
      }
    });

    const syncMobileGalleryIndicators = () => {
      const maxScroll = mobileTrack.scrollWidth - mobileTrack.clientWidth;
      if (mobileFade) {
        if (maxScroll <= 8 || mobileTrack.scrollLeft >= maxScroll - 8) {
          mobileFade.classList.add('opacity-0');
        } else {
          mobileFade.classList.remove('opacity-0');
        }
      }

      if (mobileDotButtons.length > 0 && mobileTileButtons.length > 0) {
        let closestIdx = 0;
        let smallestDist = Infinity;
        const currentScroll = mobileTrack.scrollLeft;
        mobileTileButtons.forEach((tile, i) => {
          const dist = Math.abs(tile.offsetLeft - currentScroll);
          if (dist < smallestDist) {
            smallestDist = dist;
            closestIdx = i;
          }
        });
        if (maxScroll > 0 && currentScroll >= maxScroll - 4) {
          closestIdx = mobileDotButtons.length - 1;
        }
        mobileDotButtons.forEach((dot, i) => {
          dot.className =
            i === closestIdx
              ? 'h-1.5 w-5 rounded-full bg-white transition-all duration-200 cursor-pointer'
              : 'h-1.5 w-1.5 rounded-full bg-white/25 hover:bg-white/50 transition-all duration-200 cursor-pointer';
        });
      }
    };

    onMobileStripScroll = syncMobileGalleryIndicators;
    mobileTrack.addEventListener('scroll', onMobileStripScroll, { passive: true });
    window.requestAnimationFrame(syncMobileGalleryIndicators);
  }

  if (desktopBento) {
    const leadIdx = GALLERY_PHOTOS.findIndex((p) => p.bentoSlot === 'lead');
    if (leadIdx !== -1) {
      desktopBento.appendChild(
        createTile(GALLERY_PHOTOS[leadIdx], leadIdx, 'md:col-span-5 h-[320px] lg:h-[372px]')
      );
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.className = 'md:col-span-7 grid grid-rows-2 gap-3 h-[320px] lg:h-[372px]';

    const topRow = document.createElement('div');
    topRow.className = 'grid grid-cols-12 gap-3';
    const topSpans = ['col-span-3', 'col-span-4', 'col-span-2', 'col-span-3'];
    let topCount = 0;

    const bottomRow = document.createElement('div');
    bottomRow.className = 'grid grid-cols-12 gap-3';
    const bottomSpans = ['col-span-3', 'col-span-3', 'col-span-6'];
    let bottomCount = 0;

    GALLERY_PHOTOS.forEach((photo, idx) => {
      if (photo.bentoSlot.startsWith('top-')) {
        const span = topSpans[topCount] || 'col-span-3';
        topCount += 1;
        topRow.appendChild(createTile(photo, idx, `${span} h-full`));
      } else if (photo.bentoSlot.startsWith('bottom-')) {
        const span = bottomSpans[bottomCount] || 'col-span-4';
        bottomCount += 1;
        bottomRow.appendChild(createTile(photo, idx, `${span} h-full`));
      }
    });

    rightWrapper.append(topRow, bottomRow);
    desktopBento.appendChild(rightWrapper);
  }

  // Contact Form Validation
  const form = container.querySelector('#contact-form');
  const statusBanner = container.querySelector('#contact-success');
  const statusNameEl = container.querySelector('#contact-success-name');
  const resetBtn = container.querySelector('#contact-reset');
  const nameInput = container.querySelector('#contact-name');
  const emailInput = container.querySelector('#contact-email');
  const messageInput = container.querySelector('#contact-message');
  const nameError = container.querySelector('#contact-name-error');
  const emailError = container.querySelector('#contact-email-error');
  const messageError = container.querySelector('#contact-message-error');

  function setError(input, errorEl, msg) {
    if (!input || !errorEl) return;
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = msg;
      errorEl.classList.remove('hidden');
    } else {
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  [
    [nameInput, nameError],
    [emailInput, emailError],
    [messageInput, messageError],
  ].forEach(([input, errorEl]) => {
    input?.addEventListener('input', () => setError(input, errorEl, ''));
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = nameInput?.value.trim() || '';
    const emailVal = emailInput?.value.trim() || '';
    const messageVal = messageInput?.value.trim() || '';

    let hasError = false;
    if (!nameVal) {
      setError(nameInput, nameError, 'Please enter your name.');
      hasError = true;
    }
    if (!emailVal) {
      setError(emailInput, emailError, 'Please enter your email address.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      hasError = true;
    }
    if (messageVal.length < 5) {
      setError(messageInput, messageError, 'Please write a brief message (at least 5 characters).');
      hasError = true;
    }
    if (hasError) return;

    if (statusNameEl) statusNameEl.textContent = nameVal;
    form.classList.add('hidden');
    statusBanner?.classList.remove('hidden');
    statusBanner?.classList.add('flex');
    form.reset();
  });

  resetBtn?.addEventListener('click', () => {
    statusBanner?.classList.add('hidden');
    statusBanner?.classList.remove('flex');
    form?.classList.remove('hidden');
    nameInput?.focus();
  });

  return () => {
    if (timerId !== null) window.clearInterval(timerId);
    if (mobileTrack && onMobileStripScroll) {
      mobileTrack.removeEventListener('scroll', onMobileStripScroll);
    }
  };
}

let currentCleanup = null;
let currentActiveRoute = null;
let routeTransitionSeq = 0;

function mountRoute(route, { pushHistory = false, scrollTop = true, isInitial = false } = {}) {
  const root = document.getElementById('spa-root');
  if (!root) return;

  const targetRoute = ROUTE_META[route] ? route : 'home';
  if (!isInitial && targetRoute === currentActiveRoute) {
    return;
  }

  const transitionId = ++routeTransitionSeq;
  const switchStartTime = Date.now();

  if (!isInitial) {
    showCompassLoader(ROUTE_META[targetRoute].label);
  }

  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  currentActiveRoute = targetRoute;
  const meta = ROUTE_META[targetRoute];
  document.title = meta.title;

  if (pushHistory) {
    window.history.pushState({ route: targetRoute }, '', meta.path);
  }

  if (targetRoute === 'quotes') {
    currentCleanup = renderQuotesView(root) || null;
  } else if (targetRoute === 'gallery') {
    currentCleanup = renderGalleryView(root) || null;
  } else if (targetRoute === 'blog') {
    currentCleanup = renderBlogView(root) || null;
  } else {
    currentCleanup = renderHomeView(root, { waitPreloader: isInitial }) || null;
  }

  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  if (isInitial) {
    if (targetRoute !== 'home') {
      waitForInitialPreload(root.querySelectorAll('img'));
    }
    return;
  }

  const targetImages =
    targetRoute === 'home'
      ? [root.querySelector('#hero-portrait')].filter(Boolean)
      : root.querySelectorAll('img');

  waitForImagesAndMinTime(
    targetImages,
    500,
    switchStartTime,
    () => {
      if (transitionId !== routeTransitionSeq) return;
      hideCompassLoader();
    },
    8000
  );
}

async function bootApp() {
  initLightbox();

  await loadPortfolioData();

  const initialRoute = resolveRouteFromLocation();
  window.history.replaceState(
    { route: initialRoute },
    '',
    window.location.pathname + window.location.search + window.location.hash
  );
  mountRoute(initialRoute, { pushHistory: false, scrollTop: false, isInitial: true });

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    const link = e.target.closest('a[data-spa-link]');
    if (!link) return;

    const targetRoute = link.getAttribute('data-spa-link');
    if (!targetRoute || !ROUTE_META[targetRoute]) return;

    e.preventDefault();
    mountRoute(targetRoute, { pushHistory: true, scrollTop: true, isInitial: false });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  });

  window.addEventListener('popstate', (e) => {
    const nextRoute = e.state?.route || resolveRouteFromLocation();
    mountRoute(nextRoute, { pushHistory: false, scrollTop: true, isInitial: false });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}
