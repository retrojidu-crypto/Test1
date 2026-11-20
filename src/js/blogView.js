import { INITIAL_BLOG_POSTS } from './data.js';
import { bindImageShimmer, createFallbackTile } from './shimmer.js';

export function renderBlogView(container) {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#080808] spa-view-active">
      <header class="border-b border-white/8 bg-[#080808]">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-6">
          <a
            href="./index.html"
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
              Sea Journal &amp; Essays
            </p>
            <h1 class="mt-3 font-serif text-4xl sm:text-5xl font-normal tracking-tight text-white text-balance">
              Dispatches from Sea &amp; Shore
            </h1>
            <p class="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
              Stories from maritime passages, darkroom notes, and quiet observations written along the horizon.
            </p>
          </div>
        </section>

        <section aria-labelledby="blog-feed-heading">
          <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div role="tablist" aria-label="Filter journal entries" class="flex flex-wrap items-center gap-2">
                ${['All', 'Voyage Logs', 'Photography', 'Reflections']
                  .map(
                    (cat, idx) => `
                  <button
                    type="button"
                    role="tab"
                    aria-selected="${idx === 0 ? 'true' : 'false'}"
                    data-blog-filter="${cat}"
                    class="min-h-[40px] px-4 py-2 text-xs font-medium rounded-full ${
                      idx === 0 ? 'bg-white text-neutral-950' : 'bg-white/8 text-neutral-300 hover:bg-white/14'
                    } transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    ${cat}
                  </button>`
                  )
                  .join('')}
              </div>

              <p id="blog-count" class="text-xs tabular-nums text-neutral-400">03 Essays</p>
            </div>

            <h2 id="blog-feed-heading" class="sr-only">Journal Posts</h2>
            <div id="blog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
          </div>
        </section>
      </main>

      <footer class="border-t border-white/8 bg-[#080808]">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-center text-center text-xs text-neutral-400">
          <p>&copy; 2026 Jahidul Islam Jihad. All rights reserved.</p>
        </div>
      </footer>

      <!-- Accessible Blog Post Reader Modal with Full Social Share Row -->
      <div
        id="blog-reader-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reader-title"
        class="hidden fixed inset-0 z-50 items-center justify-center bg-black/92 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      >
        <article class="relative w-full max-w-3xl my-auto bg-[#0e0e0e] border border-white/12 rounded-2xl overflow-hidden shadow-2xl">
          <button
            id="reader-close"
            type="button"
            aria-label="Close article reader"
            class="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/75 text-white border border-white/15 hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          >
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div id="reader-cover-wrap" class="img-shimmer w-full aspect-[16/9] max-h-[340px]">
            <img
              id="reader-cover"
              src=""
              alt=""
              referrerPolicy="no-referrer"
              class="w-full h-full object-cover grayscale contrast-110"
            />
          </div>

          <div class="p-6 sm:p-10 space-y-6">
            <div class="space-y-3">
              <p id="reader-meta" class="text-xs text-neutral-400"></p>
              <h2 id="reader-title" class="font-serif text-2xl sm:text-3xl text-white leading-snug"></h2>
            </div>

            <div id="reader-body" class="space-y-4 text-sm sm:text-base leading-[1.8] text-neutral-300"></div>

            <!-- Redesigned Monochrome Share Dock -->
            <div class="pt-6 border-t border-white/10 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="font-serif italic text-sm text-neutral-400">Written by Jahidul Islam Jihad</p>
                <span id="share-feedback" role="status" aria-live="polite" class="text-xs font-medium text-neutral-200 min-h-[1rem]"></span>
              </div>

              <div class="rounded-2xl bg-[#111111] border border-white/12 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Share on social platforms">
                  <span class="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mr-1.5">
                    Share
                  </span>

                  <a
                    id="share-x"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on X"
                    aria-label="Share essay on X"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#080808] border border-white/12 text-neutral-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  <a
                    id="share-facebook"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Facebook"
                    aria-label="Share essay on Facebook"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#080808] border border-white/12 text-neutral-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
                      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
                    </svg>
                  </a>

                  <a
                    id="share-linkedin"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                    aria-label="Share essay on LinkedIn"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#080808] border border-white/12 text-neutral-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                    </svg>
                  </a>

                  <a
                    id="share-whatsapp"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on WhatsApp"
                    aria-label="Share essay on WhatsApp"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#080808] border border-white/12 text-neutral-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
                      <path d="M12.04 2a9.95 9.95 0 0 0-8.6 14.95L2 22l5.2-1.36A9.96 9.96 0 1 0 12.04 2Zm5.8 14.12c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.38-.15-.2-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.26-.29.58-.36.77-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.52-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.01.96.3.15.49.22.56.34.08.12.08.7-.16 1.38Z" />
                    </svg>
                  </a>

                  <a
                    id="share-telegram"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Telegram"
                    aria-label="Share essay on Telegram"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#080808] border border-white/12 text-neutral-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
                      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42Z" />
                    </svg>
                  </a>

                  <a
                    id="share-email"
                    href="#"
                    title="Share via Email"
                    aria-label="Share essay via Email"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#080808] border border-white/12 text-neutral-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9 6 9-6" />
                    </svg>
                  </a>
                </div>

                <!-- Right Utility Pair: Copy Link Icon + Native Share Sheet (+) -->
                <div class="flex items-center justify-end gap-2 pt-2.5 border-t border-white/8 sm:pt-0 sm:border-t-0 sm:pl-3.5 sm:border-l sm:border-white/10 shrink-0">
                  <button
                    id="reader-share"
                    type="button"
                    title="Copy essay link"
                    aria-label="Copy essay link"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.06] border border-white/15 text-neutral-200 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    <svg id="share-copy-icon" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <svg id="share-check-icon" viewBox="0 0 24 24" class="hidden w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    id="share-native"
                    type="button"
                    title="More share options"
                    aria-label="Open device share sheet"
                    class="social-icon-btn inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white text-neutral-950 hover:-translate-y-0.5 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  `;

  const posts = [...INITIAL_BLOG_POSTS];
  let activeCategory = 'All';
  let lastFocusedEl = null;

  const grid = container.querySelector('#blog-grid');
  const countEl = container.querySelector('#blog-count');
  const tabs = container.querySelectorAll('[data-blog-filter]');

  const readerModal = container.querySelector('#blog-reader-modal');
  const readerClose = container.querySelector('#reader-close');
  const readerCoverWrap = container.querySelector('#reader-cover-wrap');
  const readerCover = container.querySelector('#reader-cover');
  const readerMeta = container.querySelector('#reader-meta');
  const readerTitle = container.querySelector('#reader-title');
  const readerBody = container.querySelector('#reader-body');

  const shareX = container.querySelector('#share-x');
  const shareLinkedin = container.querySelector('#share-linkedin');
  const shareFacebook = container.querySelector('#share-facebook');
  const shareWhatsapp = container.querySelector('#share-whatsapp');
  const shareTelegram = container.querySelector('#share-telegram');
  const shareEmail = container.querySelector('#share-email');
  const readerShare = container.querySelector('#reader-share');
  const shareCopyIcon = container.querySelector('#share-copy-icon');
  const shareCheckIcon = container.querySelector('#share-check-icon');
  const shareNative = container.querySelector('#share-native');
  const shareFeedback = container.querySelector('#share-feedback');

  container.querySelectorAll('.social-icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.remove('is-clicked');
      void btn.offsetWidth;
      btn.classList.add('is-clicked');
    });
  });

  let activePost = null;
  let feedbackTimer = null;

  function showShareFeedback(msg, markCopied = false) {
    if (feedbackTimer) window.clearTimeout(feedbackTimer);
    if (shareFeedback) shareFeedback.textContent = msg;
    if (markCopied && shareCopyIcon && shareCheckIcon) {
      shareCopyIcon.classList.add('hidden');
      shareCheckIcon.classList.remove('hidden');
    }
    feedbackTimer = window.setTimeout(() => {
      if (shareFeedback) shareFeedback.textContent = '';
      if (shareCopyIcon && shareCheckIcon) {
        shareCopyIcon.classList.remove('hidden');
        shareCheckIcon.classList.add('hidden');
      }
    }, 1800);
  }

  function openReader(post) {
    activePost = post;
    lastFocusedEl = document.activeElement;

    if (readerCover && readerCoverWrap) {
      readerCover.alt = post.coverAlt;
      bindImageShimmer(readerCover, readerCoverWrap, null, post.coverSrc);
    }

    if (readerMeta) {
      readerMeta.textContent = `${post.category} · ${post.date} · ${post.readTime} · ${post.location}`;
    }
    if (readerTitle) readerTitle.textContent = post.title;
    if (readerBody) {
      readerBody.innerHTML = '';
      post.paragraphs.forEach((para) => {
        const p = document.createElement('p');
        p.textContent = para;
        readerBody.appendChild(p);
      });
    }

    const shareUrl = new URL(`./blog.html#${post.id}`, window.location.href).href;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${post.title} — Jahidul Islam Jihad`);

    if (shareX) shareX.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    if (shareFacebook) shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    if (shareLinkedin) shareLinkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    if (shareWhatsapp) shareWhatsapp.href = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    if (shareTelegram) shareTelegram.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    if (shareEmail) shareEmail.href = `mailto:?subject=${encodedText}&body=${encodedUrl}`;
    if (shareFeedback) shareFeedback.textContent = '';
    if (shareCopyIcon && shareCheckIcon) {
      shareCopyIcon.classList.remove('hidden');
      shareCheckIcon.classList.add('hidden');
    }

    if (window.location.hash !== `#${post.id}`) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}#${post.id}`
      );
    }

    readerModal?.classList.remove('hidden');
    readerModal?.classList.add('flex');
    document.body.style.overflow = 'hidden';
    readerClose?.focus();
  }

  function closeReader() {
    readerModal?.classList.add('hidden');
    readerModal?.classList.remove('flex');
    document.body.style.overflow = '';
    activePost = null;

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}`
      );
    }

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  readerClose?.addEventListener('click', closeReader);
  readerModal?.addEventListener('click', (e) => {
    if (e.target === readerModal) closeReader();
  });

  const handleEscape = (e) => {
    if (e.key === 'Escape' && activePost) closeReader();
  };
  document.addEventListener('keydown', handleEscape);

  readerShare?.addEventListener('click', async () => {
    if (!activePost) return;
    const shareUrl = new URL(`./blog.html#${activePost.id}`, window.location.href).href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showShareFeedback('Link copied', true);
    } catch {
      showShareFeedback('Copy link ready', false);
    }
  });

  shareNative?.addEventListener('click', async () => {
    if (!activePost) return;
    const shareUrl = new URL(`./blog.html#${activePost.id}`, window.location.href).href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${activePost.title} — Jahidul Islam Jihad`,
          text: activePost.excerpt,
          url: shareUrl,
        });
        showShareFeedback('Shared');
      } catch (err) {
        if (err && err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(shareUrl);
            showShareFeedback('Link copied', true);
          } catch {
            showShareFeedback('Share ready');
          }
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showShareFeedback('Link copied', true);
    } catch {
      showShareFeedback('Share ready');
    }
  });

  function renderFeed() {
    if (!grid) return;
    const filtered =
      activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory);

    if (countEl) {
      countEl.textContent = `${String(filtered.length).padStart(2, '0')} ${filtered.length === 1 ? 'Essay' : 'Essays'}`;
    }

    grid.innerHTML = '';

    filtered.forEach((post) => {
      const card = document.createElement('article');
      card.className =
        'flex flex-col justify-between rounded-2xl bg-[#111111] border border-white/10 overflow-hidden transition-colors hover:border-white/20';

      const mediaBtn = document.createElement('button');
      mediaBtn.type = 'button';
      mediaBtn.className =
        'img-shimmer w-full aspect-[16/10] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer';
      mediaBtn.setAttribute('aria-label', `Read blog post: ${post.title}`);

      const img = document.createElement('img');
      img.alt = post.coverAlt;
      img.loading = 'eager';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.className = 'w-full h-full object-cover grayscale contrast-110 hover:scale-[1.03]';
      bindImageShimmer(
        img,
        mediaBtn,
        () => {
          img.replaceWith(createFallbackTile(post.title));
        },
        post.coverSrc
      );
      mediaBtn.appendChild(img);
      mediaBtn.addEventListener('click', () => openReader(post));

      const body = document.createElement('div');
      body.className = 'p-6 flex-1 flex flex-col justify-between gap-5';

      const top = document.createElement('div');
      top.className = 'space-y-3';

      const meta = document.createElement('p');
      meta.className = 'text-xs text-neutral-400';
      meta.textContent = `${post.category} · ${post.date} · ${post.readTime}`;

      const heading = document.createElement('h3');
      heading.className = 'font-serif text-xl text-white leading-snug';
      heading.textContent = post.title;

      const excerpt = document.createElement('p');
      excerpt.className = 'text-sm leading-relaxed text-neutral-400 line-clamp-3';
      excerpt.textContent = post.excerpt;

      top.append(meta, heading, excerpt);

      const footer = document.createElement('div');
      footer.className = 'pt-4 border-t border-white/10 flex items-center justify-between gap-4';

      const loc = document.createElement('span');
      loc.className = 'text-xs text-neutral-500';
      loc.textContent = post.location;

      const readBtn = document.createElement('button');
      readBtn.type = 'button';
      readBtn.className =
        'inline-flex items-center gap-1.5 min-h-[40px] text-xs font-medium text-neutral-200 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md cursor-pointer whitespace-nowrap';
      readBtn.innerHTML = `<span>Read Essay</span><svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" /></svg>`;
      readBtn.addEventListener('click', () => openReader(post));

      footer.append(loc, readBtn);
      body.append(top, footer);
      card.append(mediaBtn, body);
      grid.appendChild(card);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.getAttribute('data-blog-filter') || 'All';
      tabs.forEach((btn) => {
        const isSelected = btn === tab;
        btn.setAttribute('aria-selected', String(isSelected));
        btn.className = isSelected
          ? 'min-h-[40px] px-4 py-2 text-xs font-medium rounded-full bg-white text-neutral-950 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer'
          : 'min-h-[40px] px-4 py-2 text-xs font-medium rounded-full bg-white/8 text-neutral-300 hover:bg-white/14 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer';
      });
      renderFeed();
    });
  });

  function openPostFromHash() {
    const hashId = window.location.hash.replace(/^#/, '').trim();
    if (!hashId) return;
    const matched = posts.find((p) => p.id === hashId);
    if (matched && activePost?.id !== matched.id) {
      openReader(matched);
    }
  }

  renderFeed();
  openPostFromHash();
  window.addEventListener('hashchange', openPostFromHash);

  return () => {
    document.removeEventListener('keydown', handleEscape);
    window.removeEventListener('hashchange', openPostFromHash);
    document.body.style.overflow = '';
  };
}
