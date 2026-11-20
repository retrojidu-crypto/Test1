/**
 * External JSON Data Configuration (Cloudflare Pages / Remote Static Hosting)
 *
 * Loads gallery, quotes, and journal data from Cloudflare Pages so content
 * can be updated remotely without redeploying the main site.
 *
 * Endpoints:
 *   - `${DATA_BASE_URL}/gallery.json`
 *   - `${DATA_BASE_URL}/quotes.json`
 *   - `${DATA_BASE_URL}/journal.json`
 */
const ENV_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DATA_BASE_URL
    ? String(import.meta.env.VITE_DATA_BASE_URL).trim()
    : '';

export const DATA_BASE_URL = (ENV_BASE_URL || 'https://cld-nz3.pages.dev').replace(/\/+$/, '');

export const DATA_ENDPOINTS = {
  gallery: `${DATA_BASE_URL}/gallery.json`,
  quotes: `${DATA_BASE_URL}/quotes.json`,
  journal: `${DATA_BASE_URL}/journal.json`,
};

export const HERO_MEDIA = {
  portrait: 'https://i.ibb.co.com/HTzQfRQy/Picsart-26-11-14-22-21-08-763.jpg',
  alt: 'Picsart 26 11 14 22 21 08 763',
};

const FALLBACK_HOME_QUOTES = [
  {
    id: 'quote-1',
    indexLabel: '01 / 04',
    theme: 'Horizons',
    text: 'Dream big,\nCapture more,\nLive deeper.',
    attribution: 'Jihad',
    signatureId: 'jihad-classic',
    context: 'Personal Manifesto',
  },
  {
    id: 'quote-2',
    indexLabel: '02 / 04',
    theme: 'At Sea',
    text: 'The ocean teaches patience;\nthe shutter teaches presence.',
    attribution: 'J. I. Jihad',
    signatureId: 'jihad-monogram',
    context: 'Bay of Bengal Passage',
  },
  {
    id: 'quote-3',
    indexLabel: '03 / 04',
    theme: 'Photography',
    text: 'Between distant ports,\nlight writes quiet stories\nin silver and shadow.',
    attribution: 'Jihad — Lens',
    signatureId: 'jihad-lens',
    context: 'Bridge Watch Notes',
  },
  {
    id: 'quote-4',
    indexLabel: '04 / 04',
    theme: 'Solitude',
    text: 'Every horizon is an invitation\nto look once more\nwith beginner eyes.',
    attribution: 'Jahidul Islam',
    signatureId: 'jahidul-full',
    context: 'Port Said Anchorage',
  },
];

const FALLBACK_ALL_QUOTES = [
  ...FALLBACK_HOME_QUOTES.map((q, idx) => ({
    ...q,
    indexLabel: `${String(idx + 1).padStart(2, '0')} / 08`,
  })),
  {
    id: 'quote-5',
    indexLabel: '05 / 08',
    theme: 'At Sea',
    text: 'Out beyond the breakwater,\nnoise fades until only wind,\ncompass, and conscience remain.',
    attribution: 'Jihad',
    context: 'Midnight Watch · 02:00 LT',
  },
  {
    id: 'quote-6',
    indexLabel: '06 / 08',
    theme: 'Photography',
    text: 'Monochrome strips away distraction\nso emotion and light\ncan speak without apology.',
    attribution: 'Jihad',
    context: 'Darkroom Notebook',
  },
  {
    id: 'quote-7',
    indexLabel: '07 / 08',
    theme: 'Horizons',
    text: 'A ship is never truly anchored\nin the mind of a sailor\nwho carries the sea in his lens.',
    attribution: 'Jihad',
    context: 'Singapore Strait',
  },
  {
    id: 'quote-8',
    indexLabel: '08 / 08',
    theme: 'Solitude',
    text: 'Find beauty in the ordinary,\npeace in the chaos,\nand meaning in every mile.',
    attribution: 'Jihad',
    context: 'Indian Ocean Crossing',
  },
];

const FALLBACK_GALLERY_PHOTOS = [
  {
    id: 'silver-meridian',
    title: 'Silver Meridian at Dusk',
    category: 'Seascapes',
    src: 'https://picsum.photos/1200/900?random=1',
    alt: 'Black-and-white photograph of sunlight breaking through heavy clouds onto open ocean waves',
    location: 'Indian Ocean · 06°14′N 81°12′E',
    year: '2025',
    exif: '35mm · f/5.6 · 1/1250s · ISO 100',
    story: 'Captured from the bridge wing just before evening watch handoff as squall clouds parted over the swell.',
    bentoSlot: 'lead',
  },
  {
    id: 'quiet-cosmos',
    title: 'Stillness After Rain',
    category: 'Solitude',
    src: 'https://picsum.photos/1200/900?random=2',
    alt: 'Monochrome macro study of a single white wildflower in bloom against a dark bokeh backdrop',
    location: 'Chittagong Coast',
    year: '2025',
    exif: '85mm · f/2.0 · 1/400s · ISO 200',
    story: 'A quiet study in contrast found near the harbor breakwater after weeks at sea.',
    bentoSlot: 'top-1',
  },
  {
    id: 'merchant-crossing',
    title: 'Passage Under Overcast',
    category: 'Voyages',
    src: 'https://picsum.photos/1200/900?random=3',
    alt: 'Documentary monochrome photograph of a merchant cargo vessel crossing open ocean waters under overcast clouds',
    location: 'Malacca Strait',
    year: '2024',
    exif: '50mm · f/8.0 · 1/800s · ISO 160',
    story: 'Passing sister vessel cutting steadily through flat gray swells along the Singapore shipping lane.',
    bentoSlot: 'top-2',
  },
  {
    id: 'vertical-cadence',
    title: 'Vertical Cadence',
    category: 'Architecture',
    src: 'https://picsum.photos/1200/900?random=4',
    alt: 'Low-angle black-and-white architectural photograph looking up at a geometric modernist skyscraper facade',
    location: 'Singapore Port District',
    year: '2024',
    exif: '24mm · f/9.0 · 1/500s · ISO 100',
    story: 'Shore leave geometry — steel, glass, and storm clouds converging skyward.',
    bentoSlot: 'top-3',
  },
  {
    id: 'edge-of-tide',
    title: 'Edge of the Tide',
    category: 'Solitude',
    src: 'https://picsum.photos/1200/900?random=5',
    alt: 'Minimalist black-and-white photograph of a solitary silhouette standing on wet beach sand facing a misty ocean horizon',
    location: 'Cox’s Bazar Shoreline',
    year: '2025',
    exif: '35mm · f/4.0 · 1/1000s · ISO 100',
    story: 'Where wet sand turns to mirror and the distant horizon dissolves into morning sea mist.',
    bentoSlot: 'top-4',
  },
  {
    id: 'before-the-squall',
    title: 'Before the Squall',
    category: 'Voyages',
    src: 'https://picsum.photos/1200/900?random=6',
    alt: 'Dramatic monochrome photo of a coastal figure silhouetted against dark storm clouds and ocean surf',
    location: 'Arabian Sea Coast',
    year: '2024',
    exif: '28mm · f/5.6 · 1/640s · ISO 400',
    story: 'Low barometric pressure and shafts of sunlight tearing through storm fronts along the coast.',
    bentoSlot: 'bottom-1',
  },
  {
    id: 'gulls-in-formation',
    title: 'Bearing North',
    category: 'Seascapes',
    src: 'https://picsum.photos/1200/900?random=7',
    alt: 'Minimalist monochrome photograph of a flock of seabirds flying in formation across a bright overcast sky',
    location: 'Suez Approach',
    year: '2025',
    exif: '135mm · f/4.0 · 1/2000s · ISO 200',
    story: 'Harbor gulls escorting the vessel three nautical miles offshore at daybreak.',
    bentoSlot: 'bottom-2',
  },
  {
    id: 'concrete-causeway',
    title: 'Span Across Calm Water',
    category: 'Architecture',
    src: 'https://picsum.photos/1200/900?random=8',
    alt: 'Wide black-and-white architectural view of a long concrete sea bridge stretching across calm dark water',
    location: 'Colombo Outer Harbor',
    year: '2024',
    exif: '35mm · f/11 · 1/125s · ISO 100',
    story: 'Rhythmic concrete pilings reflected in stillness before morning harbor traffic begins.',
    bentoSlot: 'bottom-3',
  },
];

const FALLBACK_BLOG_POSTS = [
  {
    id: 'midnight-watch-indian-ocean',
    title: 'Notes from the 00:00–04:00 Watch in the Indian Ocean',
    category: 'Voyage Logs',
    date: 'November 2026',
    readTime: '4 min read',
    location: '06°14′N 81°12′E',
    coverSrc: 'https://picsum.photos/1200/800?random=9',
    coverAlt: 'Sunlight breaking through dark ocean clouds over rippling waves',
    excerpt:
      'When the bridge lights dim to amber and the radar sweeps in quiet circles, the sea reveals a stillness rarely found ashore.',
    paragraphs: [
      'Every four-hour bridge watch carries its own rhythm, yet nothing compares to the midnight-to-four shift when the horizon vanishes into deep slate and the bow slices phosphorescent swells.',
      'Between plotting fixes and monitoring traffic across the shipping lane, I keep a compact 35mm camera slung near the chart table. You do not take many frames out here—most nights belong purely to observation—but when squall clouds part just before false dawn, the contrast of silver moonlight on steel deck plates feels unforgettable.',
      'Life at sea trains your eye to notice subtle changes: a shift in wind direction, a distant masthead light, or the brief second when spray catches deck floodlights before vanishing back into darkness.',
    ],
  },
  {
    id: 'why-i-shoot-monochrome',
    title: 'Why Monochrome Tells the Honest Story of the Sea',
    category: 'Photography',
    date: 'October 2026',
    readTime: '3 min read',
    location: 'Malacca Strait',
    coverSrc: 'https://picsum.photos/1200/800?random=10',
    coverAlt: 'Merchant cargo vessel crossing open ocean waters in monochrome',
    excerpt:
      'Removing color strips away tourist postcard clichés and leaves behind texture, scale, and the quiet tension between water and sky.',
    paragraphs: [
      'People often imagine maritime life as endless turquoise water and bright tropical sunsets. In truth, most days at sea live in shades of charcoal, pewter, mist, and salt-stained steel.',
      'Shooting in black and white lets me honor that reality without distraction. When color steps aside, your attention moves directly to geometry—the sweep of crane booms against overcast clouds, the crisp white wake trailing astern, and the solitary posture of a crewmate on lookout.',
      'For me, monochrome is not nostalgia; it is clarity. It turns an ordinary overcast afternoon into an enduring study of form and light.',
    ],
  },
  {
    id: 'shore-leave-stillness',
    title: 'Three Hours Ashore: Finding Quiet Geometry in Port Cities',
    category: 'Reflections',
    date: 'September 2026',
    readTime: '5 min read',
    location: 'Colombo & Singapore',
    coverSrc: 'https://picsum.photos/1200/800?random=11',
    coverAlt: 'Long concrete coastal bridge stretching over calm dark water',
    excerpt:
      'After fourteen days of unbroken ocean horizon, stepping onto solid concrete feels surreal—and every street corner becomes a study in vertical lines.',
    paragraphs: [
      'Port calls today are brief, often measured in hours rather than days. When cargo operations allow a short window ashore, I skip crowded shopping avenues and walk toward breakwaters, bridges, and quiet residential alleys.',
      'Transitioning from the rolling deck of a ship to stillness on land sharpens your senses. Look upward between tower blocks or down the length of an empty harbor causeway, and you notice how architecture mirrors maritime engineering—repetition, tension, and endurance against weather.',
      'A single wildflower pushing through cracked concrete near the jetty or gulls banking across flat harbor skies often stays with me longer than any landmark.',
    ],
  },
];

export let HOME_QUOTES = [...FALLBACK_HOME_QUOTES];
export let ALL_QUOTES = [...FALLBACK_ALL_QUOTES];
export let GALLERY_PHOTOS = [...FALLBACK_GALLERY_PHOTOS];
export let INITIAL_BLOG_POSTS = [...FALLBACK_BLOG_POSTS];

let loadPromise = null;

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

export async function loadPortfolioData({ force = false } = {}) {
  if (loadPromise && !force) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const [galleryRes, quotesRes, journalRes] = await Promise.allSettled([
      fetchJson(DATA_ENDPOINTS.gallery),
      fetchJson(DATA_ENDPOINTS.quotes),
      fetchJson(DATA_ENDPOINTS.journal),
    ]);

    if (galleryRes.status === 'fulfilled' && Array.isArray(galleryRes.value) && galleryRes.value.length > 0) {
      GALLERY_PHOTOS = galleryRes.value;
    }

    if (quotesRes.status === 'fulfilled' && quotesRes.value) {
      const payload = quotesRes.value;
      if (Array.isArray(payload)) {
        if (payload.length > 0) {
          ALL_QUOTES = payload;
          HOME_QUOTES = payload.slice(0, 4);
        }
      } else {
        if (Array.isArray(payload.homeQuotes) && payload.homeQuotes.length > 0) {
          HOME_QUOTES = payload.homeQuotes;
        }
        if (Array.isArray(payload.allQuotes) && payload.allQuotes.length > 0) {
          ALL_QUOTES = payload.allQuotes;
        } else if (Array.isArray(payload.homeQuotes) && payload.homeQuotes.length > 0) {
          ALL_QUOTES = payload.homeQuotes;
        }
      }
    }

    if (journalRes.status === 'fulfilled' && Array.isArray(journalRes.value) && journalRes.value.length > 0) {
      INITIAL_BLOG_POSTS = journalRes.value;
    }

    return {
      HOME_QUOTES,
      ALL_QUOTES,
      GALLERY_PHOTOS,
      INITIAL_BLOG_POSTS,
    };
  })();

  return loadPromise;
}
