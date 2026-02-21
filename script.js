import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { registerServiceWorker } from './lib/service-worker-registration.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPowerByCores = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
const lowPowerByMemory = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4;
const isLowPowerDevice = lowPowerByCores || lowPowerByMemory;
const allow3D = !prefersReducedMotion;
const lowDetail3D = isLowPowerDevice;
const MOTION = {
    splashMs: prefersReducedMotion ? 1200 : 4600,
    modelEntranceMs: 0.82,
    revealStagger: 0.085,
    revealDuration: 0.66,
    revealEase: 'power3.out',
    counterDuration: 0.95,
    scrollScrub: 0.28
};
const GALLERY_SCROLL_EXPERIENCE = {
    desktopTravelRatio: 0.42,
    desktopPinVhMin: 0.85,
    desktopPinVhMax: 1.2,
    desktopScrub: 0.72
};
const SPLASH_SESSION_KEY = 'qazi_bismillah_seen_v2';
const CENTER_LOOK_DAMPING = 0.09;
const CENTER_LOOK_YAW_OFFSET = 0;
const DEFAULT_LOOK_TARGET = { x: 0, z: 4.8 };

const mobileQuery = window.matchMedia('(max-width: 767px)');
let isMobile = mobileQuery.matches;
let viewportProfile = 'desktop';
let currentKeyframes = [];
mobileQuery.addEventListener('change', (event) => {
    isMobile = event.matches;
    viewportProfile = getViewportProfile();
    currentKeyframes = getKeyframesForViewport();
    syncTimelineSideLayout();
    activeLookTarget = { ...(currentKeyframes[0]?.look || DEFAULT_LOOK_TARGET) };
    if (allow3D && minaGroup && mina) {
        initScrollAnimations();
        ScrollTrigger.refresh();
    }
});

function getViewportProfile() {
    const w = window.innerWidth;
    if (w <= 430) return 'small_mobile';
    if (w <= 767) return 'mobile';
    if (w <= 1024) return 'tablet';
    if (w <= 1366) return 'laptop';
    return 'desktop';
}

const KEYFRAME_LIBRARY = {
    desktop: [
        { target: '#sec-hero', pos: { x: 2.96, y: -1.18, z: 0.44 }, rot: { x: 0.08, y: 0, z: 0 }, scale: 1.7, look: { x: -1.52, z: 3.04 } },
        { target: '#sec-profile', pos: { x: 3.08, y: -1.24, z: 0.24 }, rot: { x: 0.05, y: 0, z: 0.01 }, scale: 0.82, look: { x: -1.24, z: 2.14 } },
        { target: '#sec-gallery', pos: { x: 3.16, y: -1.0, z: 0.26 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.78, look: { x: -0.24, z: 2.04 } },
        { target: '#sec-history', pos: { x: 2.96, y: 0.18, z: 0.16 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.84, look: { x: -1.02, z: 1.74 } },
        { target: '#sec-iman', pos: { x: 3.04, y: -0.22, z: 0.3 }, rot: { x: 0.07, y: 0, z: -0.01 }, scale: 0.82, look: { x: -0.98, z: 1.8 } },
        { target: '#sec-video', pos: { x: 2.86, y: -0.5, z: 0.22 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.78, look: { x: -0.34, z: 1.94 } },
        { target: '#sec-clients', pos: { x: 3.22, y: -1.04, z: 0.16 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.74, look: { x: -1.1, z: 2.06 } },
        { target: '#sec-cred', pos: { x: 4.48, y: -0.34, z: 0.42 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.54, look: { x: -1.72, z: 2.24 } },
        { target: '#sec-tech', pos: { x: 3.82, y: -0.98, z: 0.28 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.62, look: { x: -1.38, z: 2.26 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.24, z: 0.42 }, rot: { x: 0.03, y: 0, z: 0 }, scale: 0.76, look: { x: 0.0, z: 4.4 } }
    ],
    laptop: [
        { target: '#sec-hero', pos: { x: 2.6, y: -1.12, z: 0.32 }, rot: { x: 0.08, y: 0, z: 0 }, scale: 1.42, look: { x: -1.28, z: 2.76 } },
        { target: '#sec-profile', pos: { x: 2.72, y: -1.18, z: 0.2 }, rot: { x: 0.05, y: 0, z: 0.01 }, scale: 0.8, look: { x: -1.08, z: 1.98 } },
        { target: '#sec-gallery', pos: { x: 2.78, y: -0.94, z: 0.22 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.76, look: { x: -0.2, z: 1.92 } },
        { target: '#sec-history', pos: { x: 2.64, y: 0.14, z: 0.12 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.82, look: { x: -0.9, z: 1.62 } },
        { target: '#sec-iman', pos: { x: 2.7, y: -0.18, z: 0.26 }, rot: { x: 0.07, y: 0, z: -0.01 }, scale: 0.8, look: { x: -0.88, z: 1.68 } },
        { target: '#sec-video', pos: { x: 2.56, y: -0.48, z: 0.2 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.76, look: { x: -0.28, z: 1.76 } },
        { target: '#sec-clients', pos: { x: 2.82, y: -0.98, z: 0.16 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.72, look: { x: -0.94, z: 1.88 } },
        { target: '#sec-cred', pos: { x: 3.72, y: -0.3, z: 0.34 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.52, look: { x: -1.42, z: 2.06 } },
        { target: '#sec-tech', pos: { x: 3.32, y: -0.92, z: 0.24 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.6, look: { x: -1.2, z: 2.1 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.22, z: 0.4 }, rot: { x: 0.03, y: 0, z: 0 }, scale: 0.74, look: { x: 0.0, z: 4.0 } }
    ],
    tablet: [
        { target: '#sec-hero', pos: { x: 1.18, y: -1.04, z: -0.18 }, rot: { x: 0.08, y: 0, z: 0 }, scale: 1.26, look: { x: -0.64, z: 2.24 } },
        { target: '#sec-profile', pos: { x: 1.24, y: -0.98, z: -1.14 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.86, look: { x: -0.46, z: 1.36 } },
        { target: '#sec-gallery', pos: { x: 1.34, y: -0.9, z: -1.2 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.86, look: { x: -0.08, z: 1.32 } },
        { target: '#sec-history', pos: { x: 1.28, y: 0.18, z: -1.12 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.84, look: { x: -0.46, z: 1.12 } },
        { target: '#sec-iman', pos: { x: 1.36, y: -0.1, z: -0.98 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.88, look: { x: -0.42, z: 1.16 } },
        { target: '#sec-video', pos: { x: -1.34, y: -0.5, z: -1.18 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.86, look: { x: 0.44, z: 1.2 } },
        { target: '#sec-clients', pos: { x: 1.24, y: -0.88, z: -1.12 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.84, look: { x: -0.42, z: 1.24 } },
        { target: '#sec-cred', pos: { x: 1.2, y: -0.18, z: -0.92 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.84, look: { x: -0.42, z: 1.44 } },
        { target: '#sec-tech', pos: { x: 1.2, y: -0.8, z: -0.98 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.84, look: { x: -0.38, z: 1.46 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.3, z: -0.44 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.78, look: { x: 0.0, z: 2.7 } }
    ],
    mobile: [
        { target: '#sec-hero', pos: { x: 0.88, y: -0.98, z: -0.88 }, rot: { x: 0.07, y: 0, z: 0 }, scale: 0.92, look: { x: -0.36, z: 2.54 } },
        { target: '#sec-profile', pos: { x: 0.94, y: -0.88, z: -2.24 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.24, z: 1.22 } },
        { target: '#sec-gallery', pos: { x: 0.84, y: -0.96, z: -2.32 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.14, z: 1.18 } },
        { target: '#sec-history', pos: { x: 0.96, y: 0.2, z: -2.14 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.78, look: { x: -0.24, z: 1.02 } },
        { target: '#sec-iman', pos: { x: 0.9, y: -0.1, z: -2.0 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.22, z: 1.1 } },
        { target: '#sec-video', pos: { x: -0.78, y: -0.56, z: -2.14 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: 0.2, z: 1.02 } },
        { target: '#sec-clients', pos: { x: 0.88, y: 0.18, z: -2.08 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.2, z: 1.1 } },
        { target: '#sec-cred', pos: { x: 0.92, y: -0.04, z: -1.92 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.2, z: 1.24 } },
        { target: '#sec-tech', pos: { x: 0.92, y: -0.54, z: -1.94 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.16, z: 1.3 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.34, z: -1.08 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.76, look: { x: 0.0, z: 3.0 } }
    ],
    small_mobile: [
        { target: '#sec-hero', pos: { x: 0.76, y: -0.94, z: -0.9 }, rot: { x: 0.07, y: 0, z: 0 }, scale: 0.84, look: { x: -0.3, z: 2.26 } },
        { target: '#sec-profile', pos: { x: 0.82, y: -0.82, z: -2.14 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.74, look: { x: -0.2, z: 1.1 } },
        { target: '#sec-gallery', pos: { x: 0.74, y: -0.92, z: -2.2 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.74, look: { x: -0.12, z: 1.04 } },
        { target: '#sec-history', pos: { x: 0.82, y: 0.2, z: -2.04 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.72, look: { x: -0.2, z: 0.94 } },
        { target: '#sec-iman', pos: { x: 0.78, y: -0.1, z: -1.92 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.74, look: { x: -0.18, z: 1.0 } },
        { target: '#sec-video', pos: { x: -0.68, y: -0.54, z: -2.06 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.72, look: { x: 0.16, z: 0.96 } },
        { target: '#sec-clients', pos: { x: 0.76, y: 0.18, z: -2.0 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.72, look: { x: -0.16, z: 1.0 } },
        { target: '#sec-cred', pos: { x: 0.8, y: -0.04, z: -1.86 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.72, look: { x: -0.16, z: 1.14 } },
        { target: '#sec-tech', pos: { x: 0.8, y: -0.5, z: -1.88 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.72, look: { x: -0.14, z: 1.18 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.26, z: -1.02 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.7, look: { x: 0.0, z: 2.62 } }
    ]
};

function getKeyframesForViewport() {
    const profile = getViewportProfile();
    return KEYFRAME_LIBRARY[profile] || KEYFRAME_LIBRARY.desktop;
}

viewportProfile = getViewportProfile();
currentKeyframes = getKeyframesForViewport();

const GALLERY_DATA = {
    birth: [
        { src: 'assets/qazi-birth-2.jpg', caption: 'Origin Archive // Early Life' },
        { src: 'assets/qazi-birth-3.jpg', caption: 'Origin Archive // Family Chapter' },
        { src: 'assets/qazibirth.jpg', caption: 'Qazi Islam: The Origin Point' }
    ],
    target: [
        { src: 'assets/baby-qazi.jpg', caption: 'School Years Archive // Childhood' },
        { src: 'assets/qazibrothers.jpg', caption: 'Family Unit During Survival-Mode Years' },
        { src: 'assets/okcdowntown.jpg', caption: 'Oklahoma City Context // Daily Pressure Years' }
    ],
    lyrewood: [
        { src: 'assets/lyrewoodlane.png', caption: 'L-BLOCK // 20+ Years at One House on Lyrewood Lane' },
        { src: 'assets/smokeyqazi.jpg', caption: 'L-BLOCK Era Portrait // Surviving the Pressure' }
    ],
    bangla: [
        { src: 'assets/banglabazaar-baby-qazi.jpg', caption: 'Bangla Bazaar Childhood Archive' },
        { src: 'assets/banglabazaar-meat-area.jpg', caption: 'Bangla Bazaar Meat Prep Area' },
        { src: 'assets/banglabazaar-inside.jpg', caption: 'Inside the Portland Storefront' },
        { src: 'assets/banglabazaar-movies.jpg', caption: 'Bollywood VHS / DVD / CD Wall' },
        { src: 'assets/banglabazaar-grandpa.jpg', caption: 'Family Archive: With Grandpa at Bangla Bazaar' },
        { src: 'assets/banglabazaar-mom.jpg', caption: 'Family Archive: Mom at Bangla Bazaar' },
        { src: 'assets/banglabazaar_outside.jpg', caption: 'Original Bangla Bazaar (Portland) // 1998-2012' }
    ],
    bpa: [
        { src: 'assets/bpafirstplace.jpg', caption: 'BPA Nationals 2015 // 1st Place Recognition' },
        { src: 'assets/bpafirstplace-2.jpg', caption: 'BPA Web Design & Development // Anaheim' }
    ],
    grind: [
        { src: 'assets/sabah_vape_photography.jpg', caption: 'Sabah Vape Photography' },
        { src: 'assets/okcdowntown.jpg', caption: 'Dual-Shift Years: Day Job and Agency Nights' },
        { src: 'VgfP2XjQL_A', caption: 'Imageline Moments Wedding Reel' }
    ],
    roots: [
        { src: 'https://img.youtube.com/vi/tF120629k3A/maxresdefault.jpg', caption: 'The Roots Project Playlist // Oklahoma Hip-Hop Archive' },
        { src: 'tF120629k3A', caption: 'The Roots Project // Playlist Highlight' }
    ],
    mina: [
        { src: 'assets/puppymina.jpg', caption: 'Mina as a Puppy // Archive' },
        { src: 'assets/puppymina2.jpg', caption: 'Mina Puppy Era // Early Days' },
        { src: 'assets/minayellowbg.jpg', caption: 'Mina with Yellow Background' },
        { src: 'assets/minaonthehunt.jpg', caption: 'Mina on the Hunt' }
    ],
    imageline: [
        { src: 'assets/pokuxshopgood.jpg', caption: 'Imageline Studios // Umbrella Agency Campaign Work' },
        { src: 'assets/sabah_vape_photography.jpg', caption: 'Corporate Ad Production // Creative Direction' },
        { src: 'assets/pokuxshopgood-2.jpg', caption: 'Imageline Campaign Work // Brand System Execution' },
        { src: 'assets/qazicaptainamericashield.jpg', caption: 'Studio Field Portrait // Operator Era' }
    ],
    cannaline: [
        { src: 'assets/cannalinemarketing_spherex.jpg', caption: 'Cannaline Marketing: Spherex Execution' },
        { src: 'assets/cannalinemarketing.jpg', caption: 'Cannaline Marketing: Brand Systems' },
        { src: 'assets/cannalineshoot1.jpg', caption: 'Cannaline Field Shoot // Session 01' },
        { src: 'assets/cannalineshoot2.jpg', caption: 'Cannaline Field Shoot // Session 02' },
        { src: 'assets/qazicannalinebald.jpg', caption: 'Cannaline Operator Era // Field Portrait' },
        { src: 'assets/cananbisflower.jpg', caption: 'Cannaline Era // Product Visual' },
        { src: 'assets/alterra_cannabis_greenery.jpg', caption: 'Oklahoma Cannabis Client Work' }
    ],
    mom: [
        { src: 'assets/momanddad.jpg', caption: 'Mom and Dad Archive' },
        { src: 'assets/momanddad-marriage.jpg', caption: 'Mom and Dad Marriage Archive' },
        { src: 'assets/maaportrait.jpg', caption: 'Portrait of Maa' },
        { src: 'assets/mom_homemovies.mp4', caption: 'Maa Home Movies' },
        { src: 'assets/mompoloroid.jpg', caption: 'Maa Polaroid' },
        { src: 'assets/babyqaziandmom.jpg', caption: 'Baby Qazi and Mom' },
        { src: 'assets/teenageqaziandmom.jpg', caption: 'Teenage Years with Mom' }
    ],
    iman: [
        { src: 'assets/imandocumentaryposter.jpg', caption: 'IMAN Documentary Poster' },
        { src: 'assets/iman1.jpg', caption: 'IMAN Field Still // Archive 01' },
        { src: 'assets/iman2.jpg', caption: 'IMAN Field Still // Archive 02' },
        { src: 'assets/iman3.jpg', caption: 'IMAN Field Still // Archive 03' },
        { src: 'assets/iman4.jpg', caption: 'IMAN Field Still // Archive 04' },
        { src: 'pqaHFMtrNHY', caption: 'IMAN Documentary Trailer' }
    ],
    cair: [
        { src: 'assets/imandocumentaryposter.jpg', caption: 'IMAN Documentary Poster // CAIR Collaboration' },
        { src: 'assets/iman1.jpg', caption: 'IMAN Still // Community Story Frame 01' },
        { src: 'assets/iman2.jpg', caption: 'IMAN Still // Community Story Frame 02' },
        { src: 'assets/cairbeyondtheballet.jpg', caption: 'CAIR Community Documentary Work' },
        { src: 'vBpGV5GUhPM', caption: 'CAIR Project Video' },
        { src: 'assets/foodbankcair.jpg', caption: 'CAIR Ramadan Food Bank // Yearly Community Service' }
    ],
    oao: [
        { src: 'assets/qaziatwashingtondcprotest.jpg', caption: 'Washington DC Protest Coverage' },
        { src: 'assets/oaolandrally.jpg', caption: 'OAO Land Rally' },
        { src: 'assets/qaziwithrashidatalib.jpg', caption: 'Community Work with Rep. Rashida Tlaib' }
    ],
    topcrop: [
        { src: 'assets/qazicannalinebald.jpg', caption: 'Top Crop Era // Systems and Operations Leadership' },
        { src: 'assets/cananbisflower.jpg', caption: 'Cannabis Flower' },
        { src: 'assets/alterra_cannabis_greenery.jpg', caption: 'Alterra Cannabis Greenery' },
        { src: 'assets/sabah_vape_photography.jpg', caption: 'Sabah Vape Photography' }
    ],
    now: [
        { src: 'assets/qazi_noice.png', caption: 'Qazi: Big Dawg Era' },
        { src: 'assets/qazialaska.jpg', caption: 'Alaska Chapter // Field Frame' },
        { src: 'assets/qaziminanicole.jpg', caption: 'Qazi, Mina, Nicole // Wedding Chapter (Nov 7, 2026)' },
        { src: 'assets/qazianddad.jpg', caption: 'Family Archive // Qazi and Dad' }
    ]
};

const VISUAL_GALLERY_DATA = [
    { src: 'assets/jabee_runthejewels.jpg', caption: 'Run The Jewels Frame' },
    { src: 'assets/jabee_thunderarena.jpg', caption: 'Thunder Arena Portrait' },
    { src: 'assets/lilwayne.jpg', caption: 'Lil Wayne Performance Still' },
    { src: 'assets/qaziwithrashidatalib.jpg', caption: 'Community Work with Rep. Rashida Tlaib' },
    { src: 'assets/repturner.jpg', caption: 'Oklahoma Capitol Documentation' },
    { src: 'assets/tianasoylent.jpg', caption: 'Soylent Campaign Portrait' },
    { src: 'assets/thunder_dj.jpg', caption: 'Thunder Tunnels Session' },
    { src: 'assets/bangladesh_dronepicture.jpg', caption: 'Bangladesh Aerial Frame' },
    { src: 'assets/cannalineshoot1.jpg', caption: 'Cannaline Field Shoot // Session 01' },
    { src: 'assets/qaziseattle.jpg', caption: 'Seattle Forest Frame' },
    { src: 'assets/foodbankcair.jpg', caption: 'CAIR Ramadan Food Bank // Yearly Service' },
    { src: 'assets/imandocumentaryposter.jpg', caption: 'IMAN Documentary Poster' },
    { src: 'assets/qaziatwashingtondcprotest.jpg', caption: 'Washington DC Protest Coverage' },
    { src: 'assets/qazialaska.jpg', caption: 'Alaska Field Portrait' },
    { src: 'assets/soylent_jen.jpg', caption: 'Soylent Campaign // Jen' },
    { src: 'assets/soylent_michelle.jpg', caption: 'Soylent Campaign // Michelle' },
    { src: 'assets/pokuxshopgood.jpg', caption: 'Pokux Brand Frame' },
    { src: 'assets/qazianddad.jpg', caption: 'Family Archive // Qazi and Dad' }
];

const VIDEO_GALLERY_DATA = [
    { src: '-Ayp30uJSPk', caption: 'Oregon Trip' },
    { src: 'pdJg_Wlb8Ac', caption: 'OKC Palestine Protest' },
    { src: 'YAjpdOEYs8Q', caption: 'Chronclub Vegas' },
    { src: 'yMO3nwPEQ7g', caption: 'Bangladesh 120FPS' },
    { src: '2La7TDYkng8', caption: 'March on Washington' },
    { src: '7RKnyG7L5L0', caption: 'Timberland Pioneers' },
    { src: 'CfDc66a5mVU', caption: 'Spherex Commercial' },
    { src: '1NY4IrxMcCk', caption: 'Sundeep: First Light' },
    { src: 'mWHXkGMUehg', caption: 'Masood Haq Campaign' }
];

let scene;
let camera;
let renderer;
let mina;
let minaGroup;
const minaRaycaster = new THREE.Raycaster();
const minaPointer = new THREE.Vector2();
let minaMaterial;
let redKeyLight;
let redKeyLightBaseIntensity = 34;
let targetRotation = { x: 0, y: 0 };
let interactionOffset = { x: 0, y: 0 };
let activeLookTarget = { ...DEFAULT_LOOK_TARGET };
let modelLoadedPromise = Promise.resolve();
let rafId = null;
let minaMotionTriggers = [];
let minaBeatTriggers = [];
let activeMinaBeat = null;
let lastBeat = { key: '', at: 0 };
let isMinaDocked = false;
let isGalleryPinned = false;
let lastMinaSpinAt = 0;
let activeDockFlipTween = null;

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVid = document.getElementById('lightbox-vid');
const lightboxYT = document.getElementById('lightbox-yt');
const ytPlayer = document.getElementById('yt-player');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.getElementById('lb-prev');
const nextBtn = document.getElementById('lb-next');
const caption = document.getElementById('lb-caption');

let currentGallery = [];
let currentIndex = 0;
let lightboxSwapRaf = null;
let galleryPinTrigger = null;
let galleryDidDrag = false;
let lightboxPreviouslyFocused = null;
const LIGHTBOX_FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function initContactActions() {
    const funnel = document.getElementById('funnel-modal');
    if (funnel) {
        funnel.addEventListener('click', (event) => {
            const button = event.target.closest('.funnel-btn');
            if (!button) {
                return;
            }
            event.preventDefault();
            const subject = button.dataset.subject || 'Project Inquiry';
            const user = 'qazi';
            const domain = 'imagelinestudios.com';
            window.location.href = `mailto:${user}@${domain}?subject=${encodeURIComponent(subject)}`;
        });
    }
}

function initBackToTop() {
    const button = document.getElementById('back-to-top');
    const footer = document.querySelector('footer');
    if (!button) {
        return;
    }

    const updateButton = () => {
        const shouldShow = window.scrollY > Math.max(window.innerHeight * 0.8, 520);
        button.classList.toggle('is-visible', shouldShow);

        const baseBottom = window.innerWidth <= 768 ? 14 : 28;
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            const overlap = Math.max(0, window.innerHeight - footerRect.top + 12);
            button.style.bottom = `${baseBottom + overlap}px`;
        } else {
            button.style.bottom = `${baseBottom}px`;
        }
    };

    window.addEventListener('scroll', updateButton, { passive: true });
    window.addEventListener('resize', updateButton);
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateButton();
}

function initFunnelModal() {
    const funnel = document.getElementById('funnel-modal');
    const funnelClose = document.querySelector('.funnel-close');
    const triggerButtons = document.querySelectorAll('.js-initiate, #secure-contact-link');

    if (!funnel || !funnelClose) {
        return;
    }

    if (triggerButtons.length > 0) {
        triggerButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                funnel.classList.remove('hidden');
            });
        });
    }

    funnelClose.addEventListener('click', () => {
        funnel.classList.add('hidden');
    });

    funnel.addEventListener('click', (event) => {
        if (event.target === funnel) {
            funnel.classList.add('hidden');
        }
    });
}

function getHashTarget() {
    const rawHash = window.location.hash;
    if (!rawHash || rawHash.length <= 1) {
        return null;
    }
    const targetId = decodeURIComponent(rawHash.slice(1));
    return document.getElementById(targetId);
}

function scrollToHashTarget(behavior = 'auto') {
    const target = getHashTarget();
    if (!target) {
        return;
    }
    const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: absoluteTop, behavior });
}

function forceHashScrollRecovery() {
    const target = getHashTarget();
    if (!target) {
        return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
        attempts += 1;
        const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
        const delta = Math.abs(target.getBoundingClientRect().top);
        if (delta < 8 || attempts >= maxAttempts) {
            clearInterval(interval);
            return;
        }
        window.scrollTo({ top: absoluteTop, behavior: 'auto' });
    }, 320);
}

function initHashScrollRecovery() {
    if (!window.location.hash) {
        return;
    }
    // Retry deep-linking after splash/layout settles.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scrollToHashTarget('auto');
        });
    });
    setTimeout(() => scrollToHashTarget('auto'), 700);
    setTimeout(() => scrollToHashTarget('auto'), 1600);
    setTimeout(() => forceHashScrollRecovery(), 900);
}

function initJumpNavVisibility() {
    const nav = document.querySelector('.jump-nav');
    if (!nav) {
        return;
    }

    const mobileNavQuery = window.matchMedia('(max-width: 768px)');
    const update = () => {
        if (!mobileNavQuery.matches) {
            nav.classList.remove('is-hidden-mobile');
            return;
        }
        const shouldShow = window.scrollY > Math.max(window.innerHeight * 0.38, 220);
        nav.classList.toggle('is-hidden-mobile', !shouldShow);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    mobileNavQuery.addEventListener('change', update);
}

function initHashAnchorNavigation() {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) {
            return;
        }

        const href = link.getAttribute('href') || '';
        if (href === '#' || href.length <= 1) {
            return;
        }

        const targetId = decodeURIComponent(href.slice(1));
        const target = document.getElementById(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        if (window.location.hash !== href) {
            history.replaceState(null, '', href);
        }
        scrollToHashTarget('smooth');
    });
}

function revealSite() {
    const splash = document.getElementById('splash-screen');
    if (!splash || splash.dataset.revealed === 'true') {
        return;
    }

    splash.dataset.revealed = 'true';
    splash.classList.add('is-exiting');
    splash.style.transform = 'translateY(-100%)';

    setTimeout(() => {
        document.body.classList.remove('no-scroll');
        splash.classList.add('hidden');
        splash.style.display = 'none';
        initHashScrollRecovery();
        if (mina) {
            gsap.fromTo(mina.scale, { x: 0.2, y: 0.2, z: 0.2 }, { x: mina.scale.x, y: mina.scale.y, z: mina.scale.z, duration: MOTION.modelEntranceMs, ease: 'power2.out' });
        }
    }, prefersReducedMotion ? 120 : 520);
}

function initSplash() {
    const splash = document.getElementById('splash-screen');
    if (!splash) {
        document.body.classList.remove('no-scroll');
        return;
    }

    const splashEnter = document.getElementById('splash-enter');
    const splashSkip = document.getElementById('splash-skip');

    let hasSeenSplash = false;
    try {
        hasSeenSplash = window.sessionStorage.getItem(SPLASH_SESSION_KEY) === '1';
    } catch {
        hasSeenSplash = false;
    }

    if (hasSeenSplash) {
        splash.classList.add('quick-pass');
    }

    const isDeepLinkEntry = Boolean(window.location.hash && getHashTarget());
    if (isDeepLinkEntry) {
        splash.classList.add('quick-pass');
    }

    const completeSplash = () => {
        try {
            window.sessionStorage.setItem(SPLASH_SESSION_KEY, '1');
        } catch {
            // session storage unavailable; continue without persistence
        }
        revealSite();
    };

    const forceFastEnter = () => {
        if (splash.dataset.revealed === 'true') {
            return;
        }
        splash.classList.add('quick-pass');
        completeSplash();
    };

    if (splashEnter) {
        splashEnter.addEventListener('click', forceFastEnter);
    }
    if (splashSkip) {
        splashSkip.addEventListener('click', forceFastEnter);
    }

    document.addEventListener('keydown', (event) => {
        if (splash.dataset.revealed === 'true') {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
            event.preventDefault();
            forceFastEnter();
        }
    });

    const minSplashMs = isDeepLinkEntry
        ? (prefersReducedMotion ? 120 : 260)
        : (hasSeenSplash ? (prefersReducedMotion ? 800 : 1800) : MOTION.splashMs);
    const minTime = new Promise((resolve) => setTimeout(resolve, minSplashMs));
    const loadTime = new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

    Promise.all([minTime, loadTime, modelLoadedPromise.catch(() => null)]).then(completeSplash);

    setTimeout(() => {
        completeSplash();
    }, isDeepLinkEntry ? 1200 : (hasSeenSplash ? 4200 : 7800));
}

function showMinaFallbackImage() {
    const stage = document.getElementById('mina-stage');
    if (!stage || stage.querySelector('.mina-fallback-image')) {
        return;
    }

    const fallback = document.createElement('img');
    fallback.className = 'mina-fallback-image';
    fallback.src = 'assets/minayellowbg.jpg';
    fallback.alt = 'Mina fallback portrait';
    fallback.loading = 'lazy';
    fallback.decoding = 'async';
    stage.appendChild(fallback);
}

function init3D() {
    if (!allow3D) {
        const stage = document.getElementById('mina-stage');
        if (stage) {
            stage.style.opacity = '0';
        }
        return;
    }

    if (lowDetail3D && isMobile) {
        showMinaFallbackImage();
        return;
    }

    const canvas = document.getElementById('mina-canvas');
    if (!canvas) {
        return;
    }

    viewportProfile = getViewportProfile();
    currentKeyframes = getKeyframesForViewport();
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !lowDetail3D, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowDetail3D ? 1.25 : 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    minaGroup = new THREE.Group();
    scene.add(minaGroup);

    redKeyLightBaseIntensity = isMobile ? (lowDetail3D ? 35 : 45) : (lowDetail3D ? 28 : 34);
    redKeyLight = new THREE.SpotLight(0xe30613, redKeyLightBaseIntensity);
    redKeyLight.position.set(-5, 2, -2);
    scene.add(redKeyLight);

    const blueLight = new THREE.SpotLight(0xaaccff, isMobile ? (lowDetail3D ? 18 : 24) : (lowDetail3D ? 12 : 16));
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, isMobile ? (lowDetail3D ? 1.2 : 1.6) : (lowDetail3D ? 0.9 : 1.2));
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0x222222, 1.1);
    scene.add(ambient);

    const platinumMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x111111,
        emissiveIntensity: 0.2
    });
    minaMaterial = platinumMaterial;

    const loader = new GLTFLoader();
    modelLoadedPromise = new Promise((resolve, reject) => {
        loader.load('mina.glb', (gltf) => {
            mina = gltf.scene;
            mina.traverse((child) => {
                if (child.isMesh) {
                    child.material = platinumMaterial;
                }
            });

            const startFrame = currentKeyframes[0];
            activeLookTarget = { ...(startFrame.look || DEFAULT_LOOK_TARGET) };
            mina.scale.set(startFrame.scale, startFrame.scale, startFrame.scale);
            minaGroup.position.set(startFrame.pos.x, startFrame.pos.y, startFrame.pos.z);
            minaGroup.rotation.set(startFrame.rot.x, getYawToCenter(startFrame.pos.x, startFrame.pos.z), startFrame.rot.z);
            mina.rotation.y = 0;

            minaGroup.add(mina);
            initScrollAnimations();
            playHeroEntrance();
            startRenderLoop();
            resolve();
        }, undefined, (error) => {
            showMinaFallbackImage();
            reject(error);
        });
    });

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
}

function onVisibilityChange() {
    if (!allow3D) {
        return;
    }
    if (document.hidden) {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    } else if (!rafId) {
        startRenderLoop();
    }
}

function startRenderLoop() {
    if (!allow3D || !renderer) {
        return;
    }

    const renderFrame = () => {
        rafId = requestAnimationFrame(renderFrame);

        if (mina) {
            const time = Date.now() * 0.0035;
            mina.position.y = isMinaDocked ? 0 : Math.sin(time) * (lowDetail3D ? 0.015 : 0.024);
            interactionOffset.x *= 0.95;
            interactionOffset.y *= 0.95;
            const targetX = isMinaDocked ? 0 : (targetRotation.x + interactionOffset.x);
            const targetZ = isMinaDocked ? 0 : (targetRotation.y * 0.08 + interactionOffset.y * 0.04);
            mina.rotation.x += (targetX - mina.rotation.x) * (lowDetail3D ? 0.06 : 0.08);
            mina.rotation.z += (targetZ - mina.rotation.z) * (lowDetail3D ? 0.05 : 0.065);
        }

        if (minaGroup) {
            // Keep Mina's nose tracking toward the active look target for intentional framing.
            const targetYawToCenter = getYawToCenter(minaGroup.position.x, minaGroup.position.z);
            const deltaYaw = normalizeAngle(targetYawToCenter - minaGroup.rotation.y);
            minaGroup.rotation.y += deltaYaw * CENTER_LOOK_DAMPING;
        }

        renderer.render(scene, camera);
    };

    renderFrame();
}

function normalizeAngle(angle) {
    let wrapped = angle;
    while (wrapped > Math.PI) {
        wrapped -= Math.PI * 2;
    }
    while (wrapped < -Math.PI) {
        wrapped += Math.PI * 2;
    }
    return wrapped;
}

function getYawToCenter(x, z) {
    return Math.atan2(activeLookTarget.x - x, activeLookTarget.z - z) + CENTER_LOOK_YAW_OFFSET;
}

function initScrollAnimations() {
    if (!allow3D || !minaGroup) {
        return;
    }

    isGalleryPinned = false;
    isMinaDocked = false;
    document.body.classList.remove('mina-docked');
    minaMotionTriggers.forEach((trigger) => trigger.kill());
    minaMotionTriggers = [];
    clearMinaBeatTriggers();

    applyFramePose(currentKeyframes[0], true);
    currentKeyframes.forEach((frame, index) => {
        const section = document.querySelector(frame.target);
        if (!section) {
            return;
        }
        const trigger = ScrollTrigger.create({
            trigger: section,
            start: index === 0 ? 'top top' : 'top 66%',
            end: 'bottom 34%',
            onEnter: () => applyFramePose(frame),
            onEnterBack: () => applyFramePose(frame)
        });
        minaMotionTriggers.push(trigger);
    });

    createHistoryLaneTriggers();
    createContactDockTriggers();
    createMinaBeatTriggers();
}

function findFrameByTarget(target) {
    return currentKeyframes.find((frame) => frame.target === target) || null;
}

function applyFramePose(frame, immediate = false, options = {}) {
    if (!minaGroup || !mina) {
        return;
    }
    if (isGalleryPinned && frame.target !== '#sec-gallery') {
        return;
    }
    if (isMinaDocked && frame.target !== '#sec-contact') {
        return;
    }
    const duration = immediate ? 0 : (typeof options.duration === 'number' ? options.duration : 0.82);
    const ease = options.ease || 'power2.out';
    const frameLook = frame.look || DEFAULT_LOOK_TARGET;
    gsap.to(minaGroup.position, { x: frame.pos.x, y: frame.pos.y, z: frame.pos.z, duration, ease, overwrite: 'auto' });
    gsap.to(minaGroup.rotation, { x: frame.rot.x, z: frame.rot.z, duration, ease, overwrite: 'auto' });
    gsap.to(mina.scale, { x: frame.scale, y: frame.scale, z: frame.scale, duration, ease, overwrite: 'auto' });
    gsap.to(activeLookTarget, { x: frameLook.x, z: frameLook.z, duration, ease, overwrite: 'auto' });
}

function createHistoryLaneTriggers() {
    const cards = Array.from(document.querySelectorAll('#sec-history .tm-content[data-gallery-key]'));
    if (cards.length === 0) {
        return;
    }
    const historyFrame = findFrameByTarget('#sec-history') || currentKeyframes[3];
    if (!historyFrame) {
        return;
    }

    const laneMap = {
        desktop: 3.18,
        laptop: 2.84,
        tablet: 2.28,
        mobile: 1.08,
        small_mobile: 0.94
    };
    const lookZMap = {
        desktop: 1.9,
        laptop: 1.76,
        tablet: 1.34,
        mobile: 1.16,
        small_mobile: 1.1
    };
    const profileOffsets = {
        desktop: {
            birth: { y: -0.06, z: 0.2, scale: 0.96, x: 0.96 },
            target: { y: 0.08, z: 0.16, scale: 0.95, x: 1.02 },
            lyrewood: { y: 0.16, z: 0.14, scale: 0.94, x: 0.98 },
            bangla: { y: 0.11, z: 0.15, scale: 0.94, x: 1.04 },
            bpa: { y: 0.04, z: 0.18, scale: 0.92, x: 0.96 },
            grind: { y: -0.02, z: 0.2, scale: 0.94, x: 1.04 },
            roots: { y: 0.02, z: 0.2, scale: 0.94, x: 0.96 },
            mina: { y: -0.1, z: 0.22, scale: 0.98, x: 1.02 },
            imageline: { y: -0.04, z: 0.24, scale: 0.92, x: 1.04 },
            cannaline: { y: 0.03, z: 0.2, scale: 0.9, x: 0.96 },
            mom: { y: 0.05, z: 0.18, scale: 0.92, x: 1.02 },
            cair: { y: -0.03, z: 0.22, scale: 0.92, x: 0.96 },
            oao: { y: 0.02, z: 0.18, scale: 0.9, x: 1.02 },
            topcrop: { y: -0.04, z: 0.2, scale: 0.9, x: 0.96 },
            now: { y: -0.08, z: 0.24, scale: 0.9, x: 1.0 }
        },
        laptop: {
            birth: { y: -0.04, z: 0.16, scale: 0.94, x: 0.96 },
            target: { y: 0.06, z: 0.14, scale: 0.93, x: 1.02 },
            lyrewood: { y: 0.13, z: 0.12, scale: 0.92, x: 0.98 },
            bangla: { y: 0.09, z: 0.13, scale: 0.92, x: 1.04 },
            bpa: { y: 0.03, z: 0.16, scale: 0.9, x: 0.96 },
            grind: { y: -0.01, z: 0.17, scale: 0.92, x: 1.04 },
            roots: { y: 0.02, z: 0.17, scale: 0.92, x: 0.96 },
            mina: { y: -0.08, z: 0.18, scale: 0.94, x: 1.02 },
            imageline: { y: -0.03, z: 0.2, scale: 0.9, x: 1.04 },
            cannaline: { y: 0.02, z: 0.17, scale: 0.88, x: 0.96 },
            mom: { y: 0.04, z: 0.16, scale: 0.9, x: 1.02 },
            cair: { y: -0.02, z: 0.19, scale: 0.9, x: 0.96 },
            oao: { y: 0.02, z: 0.16, scale: 0.88, x: 1.02 },
            topcrop: { y: -0.03, z: 0.17, scale: 0.88, x: 0.96 },
            now: { y: -0.06, z: 0.2, scale: 0.88, x: 1.0 }
        },
        tablet: {
            birth: { y: -0.02, z: -1.02, scale: 0.92, x: 0.94 },
            target: { y: 0.06, z: -1.04, scale: 0.9, x: 0.94 },
            lyrewood: { y: 0.12, z: -1.06, scale: 0.9, x: 1.0 },
            bangla: { y: 0.1, z: -1.07, scale: 0.9, x: 0.98 },
            bpa: { y: 0.04, z: -1.0, scale: 0.88, x: 0.95 },
            grind: { y: 0, z: -0.98, scale: 0.9, x: 1.0 },
            roots: { y: 0.05, z: -0.98, scale: 0.9, x: 0.96 },
            mina: { y: -0.06, z: -0.95, scale: 0.94, x: 0.98 },
            imageline: { y: -0.02, z: -0.92, scale: 0.88, x: 1.0 },
            cannaline: { y: 0.02, z: -0.96, scale: 0.86, x: 0.96 },
            mom: { y: 0.04, z: -1.0, scale: 0.88, x: 0.96 },
            cair: { y: -0.02, z: -0.92, scale: 0.88, x: 1.0 },
            oao: { y: 0.01, z: -0.96, scale: 0.86, x: 0.96 },
            topcrop: { y: -0.02, z: -0.95, scale: 0.86, x: 1.0 },
            now: { y: -0.06, z: -0.88, scale: 0.86, x: 0.98 }
        },
        mobile: {
            birth: { y: -0.02, z: -2.28, scale: 0.88, x: 0.86 },
            target: { y: 0.05, z: -2.26, scale: 0.86, x: 1.08 },
            lyrewood: { y: 0.1, z: -2.24, scale: 0.86, x: 0.92 },
            bangla: { y: 0.09, z: -2.24, scale: 0.86, x: 1.14 },
            bpa: { y: 0.03, z: -2.16, scale: 0.84, x: 0.9 },
            grind: { y: 0, z: -2.14, scale: 0.86, x: 1.08 },
            roots: { y: 0.04, z: -2.14, scale: 0.86, x: 0.9 },
            mina: { y: -0.05, z: -2.1, scale: 0.88, x: 1.06 },
            imageline: { y: -0.02, z: -2.06, scale: 0.84, x: 1.14 },
            cannaline: { y: 0.02, z: -2.1, scale: 0.82, x: 0.88 },
            mom: { y: 0.04, z: -2.14, scale: 0.84, x: 1.1 },
            cair: { y: -0.02, z: -2.06, scale: 0.84, x: 0.88 },
            oao: { y: 0.01, z: -2.08, scale: 0.82, x: 1.1 },
            topcrop: { y: -0.02, z: -2.06, scale: 0.82, x: 0.9 },
            now: { y: -0.06, z: -1.98, scale: 0.82, x: 1.06 }
        },
        small_mobile: {
            birth: { y: -0.02, z: -2.12, scale: 0.82, x: 0.86 },
            target: { y: 0.04, z: -2.1, scale: 0.8, x: 1.08 },
            lyrewood: { y: 0.09, z: -2.08, scale: 0.8, x: 0.92 },
            bangla: { y: 0.08, z: -2.08, scale: 0.8, x: 1.14 },
            bpa: { y: 0.03, z: -2.0, scale: 0.78, x: 0.9 },
            grind: { y: 0, z: -1.98, scale: 0.8, x: 1.08 },
            roots: { y: 0.04, z: -1.98, scale: 0.8, x: 0.9 },
            mina: { y: -0.05, z: -1.94, scale: 0.82, x: 1.06 },
            imageline: { y: -0.02, z: -1.9, scale: 0.78, x: 1.14 },
            cannaline: { y: 0.02, z: -1.94, scale: 0.76, x: 0.88 },
            mom: { y: 0.04, z: -1.98, scale: 0.78, x: 1.1 },
            cair: { y: -0.02, z: -1.9, scale: 0.78, x: 0.88 },
            oao: { y: 0.01, z: -1.92, scale: 0.76, x: 1.1 },
            topcrop: { y: -0.02, z: -1.9, scale: 0.76, x: 0.9 },
            now: { y: -0.06, z: -1.84, scale: 0.76, x: 1.06 }
        }
    };

    const buildFrameForCard = (card) => {
        const node = card.closest('.timeline-node');
        if (!node) {
            return null;
        }
        const contentOnRight = Boolean(node.classList.contains('right'));
        const key = card.dataset.galleryKey || '';
        const laneX = laneMap[viewportProfile] ?? 2.35;
        const baseX = contentOnRight ? -laneX : laneX;
        const sideLookBase = contentOnRight ? 1.04 : -1.04;
        const lookZ = lookZMap[viewportProfile] ?? 1.86;
        const tweak = profileOffsets[viewportProfile]?.[key] || {};
        const xMul = typeof tweak.x === 'number' ? tweak.x : 1;
        const minaX = baseX * xMul;
        const lookX = typeof tweak.lookX === 'number' ? tweak.lookX : sideLookBase;
        return {
            ...historyFrame,
            pos: {
                ...historyFrame.pos,
                x: minaX,
                y: typeof tweak.y === 'number' ? tweak.y : historyFrame.pos.y,
                z: typeof tweak.z === 'number' ? tweak.z : historyFrame.pos.z
            },
            scale: typeof tweak.scale === 'number' ? tweak.scale : historyFrame.scale,
            look: { x: lookX, z: lookZ }
        };
    };

    const laneItems = cards
        .map((card) => {
            const node = card.closest('.timeline-node');
            const frame = buildFrameForCard(card);
            if (!node || !frame) {
                return null;
            }
            return { card, node, frame };
        })
        .filter(Boolean);

    if (laneItems.length === 0) {
        return;
    }

    const useActiveYearResolver = window.matchMedia('(min-width: 769px)').matches;
    if (useActiveYearResolver) {
        let activeIndex = -1;
        const resolveActiveYear = () => {
            if (isGalleryPinned || isMinaDocked) {
                return;
            }
            const probeY = window.innerHeight * 0.52;
            let closestIndex = -1;
            let closestDistance = Number.POSITIVE_INFINITY;
            laneItems.forEach((item, index) => {
                const rect = item.node.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    return;
                }
                const centerY = rect.top + rect.height * 0.5;
                const distance = Math.abs(centerY - probeY);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            if (closestIndex < 0 || closestIndex === activeIndex) {
                return;
            }
            activeIndex = closestIndex;
            applyFramePose(laneItems[closestIndex].frame, false, { duration: 1.06, ease: 'power2.out' });
        };

        const trigger = ScrollTrigger.create({
            trigger: '#sec-history',
            start: 'top 86%',
            end: 'bottom 18%',
            onEnter: resolveActiveYear,
            onEnterBack: resolveActiveYear,
            onUpdate: resolveActiveYear,
            onLeave: () => {
                activeIndex = -1;
            },
            onLeaveBack: () => {
                activeIndex = -1;
            }
        });
        minaMotionTriggers.push(trigger);
        resolveActiveYear();
        return;
    }

    laneItems.forEach((item) => {
        const trigger = ScrollTrigger.create({
            trigger: item.card,
            start: 'top 74%',
            end: 'bottom 34%',
            onEnter: () => {
                if (isGalleryPinned || isMinaDocked) {
                    return;
                }
                applyFramePose(item.frame, false, { duration: 1.08, ease: 'power1.out' });
            },
            onEnterBack: () => {
                if (isGalleryPinned || isMinaDocked) {
                    return;
                }
                applyFramePose(item.frame, false, { duration: 1.08, ease: 'power1.out' });
            }
        });
        minaMotionTriggers.push(trigger);
    });
}

function syncTimelineSideLayout() {
    const nodes = Array.from(document.querySelectorAll('#sec-history .timeline-node'));
    if (nodes.length === 0) {
        return;
    }

    const stacked = window.matchMedia('(max-width: 768px)').matches;
    nodes.forEach((node, index) => {
        const shouldRight = index % 2 === 1;
        node.dataset.timelineSide = shouldRight ? 'right' : 'left';
        node.classList.remove('timeline-auto-right');
        node.classList.remove('timeline-force-left');
        node.classList.toggle('right', !stacked && shouldRight);
    });
}

function createContactDockTriggers() {
    const contactSection = document.getElementById('sec-contact');
    if (!contactSection) {
        return;
    }

    const contactFrame = currentKeyframes[currentKeyframes.length - 1];
    const dockFrame = {
        ...contactFrame,
        pos: { ...contactFrame.pos, y: contactFrame.pos.y + 0.34, z: contactFrame.pos.z + 0.18 },
        scale: contactFrame.scale * 0.9
    };
    const setDocked = (value) => {
        if (value === isMinaDocked) {
            return;
        }
        isMinaDocked = value;
        document.body.classList.toggle('mina-docked', value);
        if (value) {
            isGalleryPinned = false;
            runContactBackflipDock(dockFrame);
        }
    };

    const contactTrigger = ScrollTrigger.create({
        trigger: contactSection,
        start: 'top 72%',
        end: 'bottom 28%',
        onEnter: () => {
            isMinaDocked = false;
            applyFramePose(contactFrame);
        },
        onEnterBack: () => {
            isMinaDocked = false;
            applyFramePose(contactFrame);
        }
    });
    minaMotionTriggers.push(contactTrigger);

    const pageEndTrigger = ScrollTrigger.create({
        trigger: contactSection,
        start: 'bottom bottom',
        end: '+=1',
        onEnter: () => setDocked(true),
        onEnterBack: () => setDocked(true),
        onLeaveBack: () => setDocked(false)
    });
    minaMotionTriggers.push(pageEndTrigger);
}

function runContactBackflipDock(dockFrame) {
    if (!minaGroup || !mina) {
        return;
    }
    if (activeDockFlipTween) {
        activeDockFlipTween.kill();
        activeDockFlipTween = null;
    }

    gsap.killTweensOf(mina.rotation);
    gsap.killTweensOf(minaGroup.position);
    gsap.killTweensOf(minaGroup.rotation);
    gsap.killTweensOf(mina.scale);
    gsap.killTweensOf(activeLookTarget);

    const frameLook = dockFrame.look || DEFAULT_LOOK_TARGET;
    const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
            activeDockFlipTween = null;
        }
    });

    tl.to(minaGroup.position, {
        x: dockFrame.pos.x,
        y: dockFrame.pos.y + 0.18,
        z: dockFrame.pos.z - 0.05,
        duration: 0.28,
        ease: 'power2.out'
    }, 0);
    tl.to(mina.rotation, {
        x: mina.rotation.x - Math.PI * 2,
        duration: 0.62,
        ease: 'power2.inOut'
    }, 0.02);
    tl.to(minaGroup.position, {
        x: dockFrame.pos.x,
        y: dockFrame.pos.y,
        z: dockFrame.pos.z,
        duration: 0.34,
        ease: 'power3.in'
    }, 0.3);
    tl.to(minaGroup.rotation, {
        x: dockFrame.rot.x,
        z: dockFrame.rot.z,
        duration: 0.36,
        ease: 'power2.out'
    }, 0.3);
    tl.to(mina.scale, {
        x: dockFrame.scale,
        y: dockFrame.scale,
        z: dockFrame.scale,
        duration: 0.36,
        ease: 'power2.out'
    }, 0.3);
    tl.to(activeLookTarget, {
        x: frameLook.x,
        z: frameLook.z,
        duration: 0.36,
        ease: 'power2.out'
    }, 0.3);

    activeDockFlipTween = tl;
}

function playHeroEntrance() {
    if (!minaGroup || !mina || prefersReducedMotion) {
        return;
    }
    const hero = currentKeyframes[0];
    const entrance = {
        x: hero.pos.x + (isMobile ? 0.08 : 0.3),
        y: hero.pos.y - (isMobile ? 0.06 : 0.12),
        z: hero.pos.z + 0.08
    };
    gsap.set(minaGroup.position, entrance);
    gsap.set(mina.scale, {
        x: hero.scale * 0.94,
        y: hero.scale * 0.94,
        z: hero.scale * 0.94
    });
    gsap.to(minaGroup.position, {
        x: hero.pos.x,
        y: hero.pos.y,
        z: hero.pos.z,
        duration: 1.15,
        ease: 'power3.out'
    });
    gsap.to(mina.scale, {
        x: hero.scale,
        y: hero.scale,
        z: hero.scale,
        duration: 1.1,
        ease: 'power2.out'
    });
}

function clearMinaBeatTriggers() {
    minaBeatTriggers.forEach((trigger) => trigger.kill());
    minaBeatTriggers = [];
}

function getMinaBeatForTarget(target) {
    if (viewportProfile === 'mobile' || viewportProfile === 'small_mobile') {
        switch (target) {
            case '#sec-profile':
                return 'nod';
            case '#sec-gallery':
                return 'shimmy';
            case '#sec-history':
                return 'nod';
            case '#sec-iman':
                return 'signature_iman';
            case '#sec-video':
                return 'tilt';
            case '#sec-cred':
                return 'nod';
            case '#sec-tech':
                return 'shimmy';
            case '#sec-contact':
                return 'signature_contact';
            default:
                return 'none';
        }
    }
    switch (target) {
        case '#sec-hero':
            return 'none';
        case '#sec-profile':
            return 'none';
        case '#sec-gallery':
            return 'none';
        case '#sec-history':
            return 'none';
        case '#sec-iman':
            return 'signature_iman';
        case '#sec-video':
            return 'none';
        case '#sec-clients':
            return 'tilt';
        case '#sec-cred':
            return 'nod';
        case '#sec-tech':
            return 'shimmy';
        case '#sec-contact':
            return 'signature_contact';
        default:
            return 'none';
    }
}

function playMinaBeat(beatKey) {
    if (!mina || prefersReducedMotion || isMinaDocked) {
        return;
    }

    const now = Date.now();
    const cooldownMs = beatKey.startsWith('signature_') ? 2800 : 1200;
    if (lastBeat.key === beatKey && now - lastBeat.at < cooldownMs) {
        return;
    }
    lastBeat = { key: beatKey, at: now };

    if (activeMinaBeat) {
        activeMinaBeat.kill();
    }
    gsap.killTweensOf(mina.rotation);
    gsap.killTweensOf(mina.position);

    const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });
    const isMobileViewport = viewportProfile === 'mobile' || viewportProfile === 'small_mobile';
    const beatScale = isMobileViewport ? 1.15 : 1;
    const d = (time) => time * beatScale;
    switch (beatKey) {
        case 'none':
            return;
        case 'signature_iman':
            tl.to(mina.rotation, { z: 0.18, x: 0.06, duration: d(0.24), ease: 'power2.out' })
                .to(mina.rotation, { z: -0.12, x: -0.04, duration: d(0.28), ease: 'power1.inOut' })
                .to(mina.rotation, { z: 0, x: 0, duration: d(0.26), ease: 'sine.inOut' });
            break;
        case 'signature_mom':
            tl.to(mina.rotation, { z: -0.1, x: 0.06, duration: d(0.24), ease: 'sine.out' })
                .to(mina.rotation, { z: 0.06, x: -0.03, duration: d(0.28), ease: 'sine.inOut' })
                .to(mina.rotation, { z: 0, x: 0, duration: d(0.26), ease: 'sine.inOut' });
            break;
        case 'signature_contact':
            tl.to(mina.scale, { x: mina.scale.x * 1.015, y: mina.scale.y * 1.015, z: mina.scale.z * 1.015, duration: d(0.2), ease: 'power2.out' })
                .to(mina.rotation, { z: 0.08, x: 0.03, duration: d(0.2), ease: 'power2.out' }, 0)
                .to(mina.scale, { x: mina.scale.x, y: mina.scale.y, z: mina.scale.z, duration: d(0.24), ease: 'power2.inOut' }, d(0.22))
                .to(mina.rotation, { z: 0, x: 0, duration: d(0.24), ease: 'sine.inOut' });
            break;
        case 'tilt':
            tl.to(mina.rotation, { z: -0.12, duration: d(0.2) })
                .to(mina.rotation, { z: 0.1, duration: d(0.22) })
                .to(mina.rotation, { z: 0, duration: d(0.2) });
            break;
        case 'shimmy':
            tl.to(mina.position, { x: 0.08, duration: d(0.14) })
                .to(mina.position, { x: -0.08, duration: d(0.16) })
                .to(mina.position, { x: 0.05, duration: d(0.14) })
                .to(mina.position, { x: 0, duration: d(0.16) })
                .to(mina.rotation, { z: 0.08, duration: d(0.14) }, d(0.05))
                .to(mina.rotation, { z: -0.08, duration: d(0.2) }, d(0.2))
                .to(mina.rotation, { z: 0, duration: d(0.18) }, d(0.42));
            break;
        case 'spin':
            tl.to(mina.rotation, { z: 0.3, duration: d(0.22) })
                .to(mina.rotation, { z: -0.2, duration: d(0.24) })
                .to(mina.rotation, { z: 0, duration: d(0.22) });
            break;
        case 'twirl':
            tl.to(mina.rotation, { z: 0.45, duration: d(0.24) })
                .to(mina.rotation, { z: -0.28, duration: d(0.26) })
                .to(mina.rotation, { z: 0.12, duration: d(0.22) })
                .to(mina.rotation, { z: 0, duration: d(0.2) });
            break;
        case 'settle':
            tl.to(mina.rotation, { z: 0.06, duration: d(0.2) })
                .to(mina.rotation, { z: 0, duration: d(0.22) });
            break;
        case 'nod':
        default:
            tl.to(mina.rotation, { z: 0.08, duration: d(0.16) })
                .to(mina.rotation, { z: -0.06, duration: d(0.2) })
                .to(mina.rotation, { z: 0, duration: d(0.2) });
            break;
    }

    tl.eventCallback('onComplete', () => {
        activeMinaBeat = null;
    });
    activeMinaBeat = tl;
}

function createMinaBeatTriggers() {
    currentKeyframes.forEach((frame) => {
        const section = document.querySelector(frame.target);
        if (!section) {
            return;
        }
        const beat = getMinaBeatForTarget(frame.target);
        const triggerElement = frame.target === '#sec-contact'
            ? (document.getElementById('secure-contact-link') || section)
            : section;
        const triggerStart = frame.target === '#sec-contact' ? 'top 88%' : 'top 72%';
        const trigger = ScrollTrigger.create({
            trigger: triggerElement,
            start: triggerStart,
            end: 'bottom 28%',
            onEnter: () => playMinaBeat(beat),
            onEnterBack: () => playMinaBeat(beat)
        });
        minaBeatTriggers.push(trigger);
    });

    const momNode = document.querySelector('.tm-content[data-gallery-key="mom"]');
    if (momNode) {
        const momTrigger = ScrollTrigger.create({
            trigger: momNode,
            start: 'top 74%',
            end: 'bottom 35%',
            onEnter: () => playMinaBeat('signature_mom'),
            onEnterBack: () => playMinaBeat('signature_mom')
        });
        minaBeatTriggers.push(momTrigger);
    }
}

function onMouseMove(event) {
    if (!allow3D || isMobile) {
        return;
    }
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotation.y = x * 0.045;
    targetRotation.x = y * 0.05;
}

function onResize() {
    syncTimelineSideLayout();

    if (!allow3D || !camera || !renderer) {
        return;
    }

    const nextProfile = getViewportProfile();
    if (nextProfile !== viewportProfile) {
        viewportProfile = nextProfile;
        currentKeyframes = getKeyframesForViewport();
        activeLookTarget = { ...(currentKeyframes[0]?.look || DEFAULT_LOOK_TARGET) };
        if (minaGroup && mina) {
            initScrollAnimations();
            ScrollTrigger.refresh();
        }
    }

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function inferMediaType(src) {
    if (typeof src !== 'string') {
        return 'image';
    }
    if (src.endsWith('.mp4')) {
        return 'video_local';
    }
    if (!src.includes('/') && !src.includes('.')) {
        return 'video_yt';
    }
    return 'image';
}

function openGallery(source, index = 0) {
    if (source === 'visuals') {
        currentGallery = VISUAL_GALLERY_DATA;
    } else if (source === 'videos') {
        currentGallery = VIDEO_GALLERY_DATA;
    } else {
        currentGallery = GALLERY_DATA[source] || [];
    }

    if (currentGallery.length === 0) {
        return;
    }

    currentIndex = Math.max(0, Math.min(index, currentGallery.length - 1));

    lightboxPreviouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    updateLightbox(false);
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
        closeBtn?.focus();
    });
}

function runLightboxSwap(renderFn, animate = true) {
    if (!lightbox) {
        return;
    }
    if (lightboxSwapRaf) {
        cancelAnimationFrame(lightboxSwapRaf);
        lightboxSwapRaf = null;
    }

    if (!animate || prefersReducedMotion) {
        lightbox.classList.remove('is-swapping');
        renderFn();
        return;
    }

    lightbox.classList.add('is-swapping');
    lightboxSwapRaf = requestAnimationFrame(() => {
        renderFn();
        lightboxSwapRaf = requestAnimationFrame(() => {
            lightbox.classList.remove('is-swapping');
            lightboxSwapRaf = null;
        });
    });
}

function updateLightbox(animate = true) {
    if (!lightbox) {
        return;
    }

    prevBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';

    const item = currentGallery[currentIndex];
    const itemSrc = item?.src || '';
    const itemCaption = item?.caption || '';
    const itemType = inferMediaType(itemSrc);

    caption.textContent = currentGallery.length > 1 ? `${currentIndex + 1} / ${currentGallery.length}  ${itemCaption}` : itemCaption;

    runLightboxSwap(() => {
        lightboxImg.classList.add('hidden');
        lightboxVid.classList.add('hidden');
        lightboxYT.classList.add('hidden');

        lightboxVid.pause();
        lightboxVid.removeAttribute('src');
        ytPlayer.src = '';

        if (itemType === 'video_yt') {
            lightboxYT.classList.remove('hidden');
            ytPlayer.src = `https://www.youtube.com/embed/${itemSrc}?autoplay=1`;
        } else if (itemType === 'video_local') {
            lightboxVid.classList.remove('hidden');
            lightboxVid.src = itemSrc;
            lightboxVid.play().catch(() => null);
        } else {
            lightboxImg.classList.remove('hidden');
            lightboxImg.src = itemSrc;
            lightboxImg.alt = itemCaption || 'Gallery image';
        }
    }, animate);
}

function showNext() {
    currentIndex = currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0;
    updateLightbox(true);
}

function showPrev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1;
    updateLightbox(true);
}

function closeLightbox() {
    if (!lightbox) {
        return;
    }
    lightbox.classList.add('hidden');
    lightbox.classList.remove('is-swapping');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxVid.pause();
    ytPlayer.src = '';
    if (lightboxPreviouslyFocused && typeof lightboxPreviouslyFocused.focus === 'function') {
        lightboxPreviouslyFocused.focus();
    }
    lightboxPreviouslyFocused = null;
}

function trapLightboxFocus(event) {
    if (event.key !== 'Tab' || lightbox.classList.contains('hidden')) {
        return;
    }

    const focusableElements = Array.from(lightbox.querySelectorAll(LIGHTBOX_FOCUSABLE_SELECTOR))
        .filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1 && (element.offsetParent !== null || element === document.activeElement));
    if (focusableElements.length === 0) {
        event.preventDefault();
        return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
    } else if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
    }
}

function initLightboxEvents() {
    if (!lightbox || !closeBtn || !prevBtn || !nextBtn) {
        return;
    }

    document.body.addEventListener('click', (event) => {
        if (galleryDidDrag) {
            galleryDidDrag = false;
            return;
        }
        const timelineItem = event.target.closest('.tm-content[data-gallery-key]');
        const imanPosterItem = event.target.closest('.iman-poster[data-gallery-key]');
        const visualItem = event.target.closest('.scroll-item[data-gallery-index]');
        const videoItem = event.target.closest('.video-card[data-gallery-index]');

        if (timelineItem) {
            openGallery(timelineItem.dataset.galleryKey);
            return;
        }

        if (imanPosterItem) {
            openGallery(imanPosterItem.dataset.galleryKey);
            return;
        }

        if (visualItem) {
            openGallery('visuals', Number(visualItem.dataset.galleryIndex));
            return;
        }

        if (videoItem) {
            openGallery('videos', Number(videoItem.dataset.galleryIndex));
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        showPrev();
    });
    nextBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        showNext();
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (lightbox.classList.contains('hidden')) {
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            closeLightbox();
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            showNext();
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPrev();
        }
        trapLightboxFocus(event);
    });
}

function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const next = document.getElementById('testimonials-next');
    const prev = document.getElementById('testimonials-prev');
    if (!track || slides.length === 0 || !next || !prev) {
        return;
    }

    let current = 0;
    let autoTimer = null;

    const render = () => {
        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === current);
            slide.setAttribute('aria-hidden', index === current ? 'false' : 'true');
        });
        track.style.transform = `translateX(${current * -100}%)`;
    };

    const stopAuto = () => {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    };

    const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(() => {
            current = (current + 1) % slides.length;
            render();
        }, 5600);
    };

    next.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        render();
        startAuto();
    });

    prev.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        render();
        startAuto();
    });

    render();
    startAuto();
}

function initServiceWorker() {
    window.addEventListener('load', () => {
        registerServiceWorker('/sw.js');
    }, { once: true });
}

function initSectionReveals() {
    const heroSection = document.getElementById('sec-hero');
    if (heroSection) {
        heroSection.classList.add('revealed');
    }

    if (prefersReducedMotion) {
        document.querySelectorAll('section').forEach((section) => section.classList.add('revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('revealed');
            const nodes = entry.target.querySelectorAll('.reveal-up');
            if (nodes.length) {
                gsap.to(nodes, {
                    y: 0,
                    opacity: 1,
                    stagger: MOTION.revealStagger,
                    duration: MOTION.revealDuration,
                    ease: MOTION.revealEase,
                    overwrite: 'auto'
                });
            }
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('section').forEach((section) => revealObserver.observe(section));
}

function initTimelineNodeReveals() {
    const nodes = Array.from(document.querySelectorAll('#sec-history .timeline-node'));
    if (nodes.length === 0) {
        return;
    }

    // Keep the first timeline card readable on smaller viewports where the
    // observer threshold can miss the initial in-view element.
    nodes[0].classList.add('is-visible');

    if (prefersReducedMotion) {
        nodes.forEach((node) => node.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
        });
    }, {
        threshold: 0.28,
        rootMargin: '0px 0px -6% 0px'
    });

    nodes.forEach((node) => observer.observe(node));
}

function initMobileTextFocusMode() {
    const mobileTextQuery = window.matchMedia('(max-width: 768px)');
    const targets = ['#sec-profile', '#sec-history', '#sec-cred', '#sec-tech']
        .map((selector) => document.querySelector(selector))
        .filter(Boolean);

    if (targets.length === 0) {
        return;
    }

    if (!mobileTextQuery.matches) {
        document.body.classList.remove('text-focus-mobile');
        return;
    }

    const activeTargets = new Set();
    const syncClass = () => {
        document.body.classList.toggle('text-focus-mobile', activeTargets.size > 0);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeTargets.add(entry.target.id);
            } else {
                activeTargets.delete(entry.target.id);
            }
        });
        syncClass();
    }, {
        threshold: 0.38,
        rootMargin: '-8% 0px -12% 0px'
    });

    targets.forEach((section) => observer.observe(section));

    mobileTextQuery.addEventListener('change', (event) => {
        if (!event.matches) {
            activeTargets.clear();
            syncClass();
        }
    });
}

function initTechPreviewScroll() {
    const cards = Array.from(document.querySelectorAll('.tech-card'));
    if (cards.length === 0) {
        return;
    }

    const updatePan = (card) => {
        const frame = card.querySelector('.tech-shot');
        const img = card.querySelector('.tech-preview');
        if (!frame || !img || !img.naturalWidth || !img.naturalHeight) {
            return;
        }

        const frameWidth = frame.clientWidth;
        const frameHeight = frame.clientHeight;
        if (frameWidth <= 0 || frameHeight <= 0) {
            return;
        }

        const scale = 1.06;
        const renderedHeight = (frameWidth * (img.naturalHeight / img.naturalWidth)) * scale;
        const panDistance = Math.max(0, Math.min(renderedHeight - frameHeight - 8, 420));
        card.style.setProperty('--preview-pan-distance', `${panDistance.toFixed(1)}px`);
        card.classList.toggle('is-pan-ready', panDistance > 18);
    };

    const activate = (card) => {
        if (!card.classList.contains('is-pan-ready')) {
            return;
        }
        card.classList.add('is-panning');
    };

    const deactivate = (card) => {
        card.classList.remove('is-panning');
    };

    cards.forEach((card) => {
        const img = card.querySelector('.tech-preview');
        if (!img) {
            return;
        }

        const update = () => updatePan(card);
        if (img.complete && img.naturalWidth > 0) {
            update();
        }
        img.addEventListener('load', update);

        card.addEventListener('pointerenter', () => activate(card));
        card.addEventListener('pointerleave', () => deactivate(card));
        card.addEventListener('focusin', () => activate(card));
        card.addEventListener('focusout', () => deactivate(card));
    });

    window.addEventListener('resize', () => {
        cards.forEach(updatePan);
    });
}

function initProofCounters() {
    const counters = document.querySelectorAll('.proof-number[data-count-end]');
    if (counters.length === 0) {
        return;
    }

    const runCounter = (counter) => {
        if (counter.dataset.animated === 'true') {
            return;
        }
        counter.dataset.animated = 'true';

        const end = Number(counter.dataset.countEnd || 0);
        const prefix = counter.dataset.countPrefix || '';
        const suffix = counter.dataset.countSuffix || '';

        if (prefersReducedMotion) {
            counter.textContent = `${prefix}${end}${suffix}`;
            return;
        }

        const value = { current: 0 };
        gsap.to(value, {
            current: end,
            duration: MOTION.counterDuration,
            ease: 'power2.out',
            onUpdate: () => {
                counter.textContent = `${prefix}${Math.round(value.current)}${suffix}`;
            },
            onComplete: () => {
                counter.textContent = `${prefix}${end}${suffix}`;
            }
        });
    };

    const profileSection = document.getElementById('sec-profile');
    if (!profileSection) {
        counters.forEach(runCounter);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            counters.forEach(runCounter);
            obs.disconnect();
        });
    }, { threshold: 0.4 });

    observer.observe(profileSection);
}

function initTechThumbFallbacks() {
    const thumbs = document.querySelectorAll('.tech-preview');
    if (thumbs.length === 0) {
        return;
    }

    thumbs.forEach((img) => {
        const secondary = img.dataset.previewSecondary;
        const href = img.closest('.tech-card')?.getAttribute('href') || '';
        const fallbackLabel = img.dataset.site || href.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'WEB PREVIEW';
        const fallbackSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000' viewBox='0 0 1600 1000'>
                <defs>
                    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
                        <stop offset='0%' stop-color='#121212'/>
                        <stop offset='100%' stop-color='#070707'/>
                    </linearGradient>
                </defs>
                <rect width='1600' height='1000' fill='url(#g)' />
                <rect x='64' y='64' width='1472' height='872' fill='none' stroke='#2f2f2f' stroke-width='4' />
                <text x='120' y='214' fill='#e30613' font-size='34' font-family='Courier New, monospace' letter-spacing='4'>LIVE SITE PREVIEW</text>
                <text x='120' y='300' fill='#f2f2f2' font-size='72' font-family='Arial Black, Impact, sans-serif'>${fallbackLabel}</text>
                <text x='120' y='368' fill='#8f8f8f' font-size='30' font-family='Courier New, monospace'>Preview unavailable. Open link for live experience.</text>
            </svg>
        `)}`;

        const candidateSources = [];
        if (secondary) {
            candidateSources.push(secondary);
        }
        candidateSources.push(fallbackSvg);
        let candidateIndex = 0;

        const setFallbackFrame = (active) => {
            const frame = img.closest('.tech-shot');
            if (!frame) {
                return;
            }
            frame.classList.toggle('is-fallback', active);
        };

        const tryNextSource = () => {
            if (candidateIndex >= candidateSources.length) {
                return;
            }
            const nextSource = candidateSources[candidateIndex];
            candidateIndex += 1;
            if (nextSource === fallbackSvg) {
                setFallbackFrame(true);
            }
            img.src = nextSource;
        };

        img.addEventListener('load', () => {
            const isPortrait = img.naturalWidth > 0 && img.naturalHeight > img.naturalWidth;
            setFallbackFrame(img.src.startsWith('data:image/svg+xml') || isPortrait);
        });

        img.addEventListener('error', () => {
            tryNextSource();
        });

        if (img.complete && img.naturalWidth === 0) {
            tryNextSource();
        }
    });
}

function initBackgroundGradientAnimation() {
    const layer = document.getElementById('bg-gradient-animation');
    if (!layer) {
        return;
    }

    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafariBrowser) {
        layer.classList.add('is-safari');
    }
    layer.classList.add('is-static');
}

function initGalleryDrag() {
    const section = document.getElementById('sec-gallery');
    const slider = section?.querySelector('.gallery-scroll-container');
    const track = section?.querySelector('.gallery-scroll-track');
    const progressFill = section?.querySelector('.gallery-progress-fill');
    if (!slider || !track) {
        return;
    }

    if (typeof slider._galleryCleanup === 'function') {
        slider._galleryCleanup();
    }

    const originals = Array.from(track.children);
    const originalCount = originals.length;
    if (originalCount === 0) {
        return;
    }
    if (track.dataset.loopReady !== 'true') {
        originals.forEach((item) => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('tabindex', '-1');
            track.appendChild(clone);
        });
        track.dataset.loopReady = 'true';
    }

    slider.querySelectorAll('img').forEach((img) => {
        img.draggable = false;
    });

    let loopWidth = 1;
    let position = 0;
    let rafId = 0;
    let lastTime = performance.now();
    let isDragging = false;
    let hoverPause = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    const dragThreshold = 6;
    const baseSpeed = window.matchMedia('(max-width: 768px)').matches ? 0.22 : 0.34;

    const normalize = (value) => {
        if (!loopWidth) {
            return 0;
        }
        let next = value % loopWidth;
        if (next < 0) {
            next += loopWidth;
        }
        return next;
    };

    const recalcLoopWidth = () => {
        const first = track.children[0];
        const firstClone = track.children[originalCount];
        if (!first || !firstClone) {
            loopWidth = Math.max(1, track.scrollWidth / 2);
            return;
        }
        loopWidth = Math.max(1, firstClone.offsetLeft - first.offsetLeft);
        position = normalize(position);
    };

    const render = () => {
        track.style.transform = `translate3d(${-position}px, 0, 0)`;
        if (progressFill) {
            progressFill.style.width = `${Math.round((position / loopWidth) * 100)}%`;
        }
    };

    const tick = (time) => {
        const delta = Math.min(33, time - lastTime);
        lastTime = time;
        const isVisible = document.visibilityState === 'visible';
        const shouldMove = !prefersReducedMotion && !isDragging && !hoverPause && isVisible;
        if (shouldMove) {
            position = normalize(position + baseSpeed * (delta / 16.67));
            render();
        }
        rafId = requestAnimationFrame(tick);
    };

    const onPointerDown = (event) => {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartPos = position;
        galleryDidDrag = false;
        slider.classList.add('active');
        document.body.classList.add('gallery-dragging');
        slider.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
        if (!isDragging) {
            return;
        }
        const delta = event.clientX - dragStartX;
        if (Math.abs(delta) > dragThreshold) {
            galleryDidDrag = true;
        }
        if (!galleryDidDrag) {
            return;
        }
        event.preventDefault();
        position = normalize(dragStartPos - delta);
        render();
    };

    const releasePointer = () => {
        if (!isDragging) {
            return;
        }
        isDragging = false;
        slider.classList.remove('active');
        document.body.classList.remove('gallery-dragging');
        window.setTimeout(() => {
            galleryDidDrag = false;
        }, 120);
    };

    const onPointerEnter = () => {
        hoverPause = true;
    };

    const onPointerLeave = () => {
        hoverPause = false;
        releasePointer();
    };

    const onResize = () => {
        recalcLoopWidth();
        render();
    };

    const onVisibilityChange = () => {
        lastTime = performance.now();
    };

    slider.addEventListener('pointerdown', onPointerDown);
    slider.addEventListener('pointermove', onPointerMove, { passive: false });
    slider.addEventListener('pointerup', releasePointer);
    slider.addEventListener('pointercancel', releasePointer);
    slider.addEventListener('pointerleave', onPointerLeave);
    slider.addEventListener('pointerenter', onPointerEnter);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    recalcLoopWidth();
    render();
    rafId = requestAnimationFrame(tick);

    slider._galleryCleanup = () => {
        cancelAnimationFrame(rafId);
        slider.removeEventListener('pointerdown', onPointerDown);
        slider.removeEventListener('pointermove', onPointerMove);
        slider.removeEventListener('pointerup', releasePointer);
        slider.removeEventListener('pointercancel', releasePointer);
        slider.removeEventListener('pointerleave', onPointerLeave);
        slider.removeEventListener('pointerenter', onPointerEnter);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        slider.classList.remove('active');
        document.body.classList.remove('gallery-dragging');
    };
}

function initGalleryScrollLock() {
    document.body.classList.remove('gallery-locked');
    isGalleryPinned = false;
    galleryPinTrigger = null;
}

function initMinaInteractions() {
    if (!allow3D || prefersReducedMotion) {
        return;
    }
    const isInteractiveTarget = (element) => {
        return Boolean(element?.closest('a, button, input, textarea, select, iframe, video, .lightbox, .funnel-modal, .gallery-scroll-container'));
    };

    window.addEventListener('pointerdown', (event) => {
        if (isInteractiveTarget(event.target)) {
            return;
        }
        if (!camera || !mina) {
            return;
        }

        minaPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        minaPointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        minaRaycaster.setFromCamera(minaPointer, camera);
        const hits = minaRaycaster.intersectObject(mina, true);
        if (hits.length === 0) {
            return;
        }

        event.preventDefault();
        const now = Date.now();
        if (now - lastMinaSpinAt < 700) {
            return;
        }
        lastMinaSpinAt = now;

        if (navigator.vibrate) {
            navigator.vibrate([18, 28, 18]);
        }

        const heroSection = document.getElementById('sec-hero');
        const heroRect = heroSection?.getBoundingClientRect();
        const inHero = Boolean(heroRect && heroRect.top <= window.innerHeight * 0.35 && heroRect.bottom >= window.innerHeight * 0.45);
        const spinDuration = inHero ? 0.56 : 0.82;
        const zAmp = inHero ? 0.16 : 0.1;
        const yTurns = inHero ? Math.PI * 2.2 : Math.PI * 2;

        gsap.killTweensOf(mina.rotation);
        gsap.to(mina.rotation, {
            y: mina.rotation.y + yTurns,
            duration: spinDuration,
            ease: 'power2.inOut',
            overwrite: 'auto'
        });
        gsap.to(mina.rotation, {
            z: mina.rotation.z + zAmp,
            duration: inHero ? 0.16 : 0.2,
            repeat: 1,
            yoyo: true,
            ease: 'sine.inOut',
            overwrite: 'auto'
        });
    });
}

function init() {
    if (!prefersReducedMotion) {
        document.body.classList.add('motion-ready');
    }
    initContactActions();
    initHashAnchorNavigation();
    initBackgroundGradientAnimation();
    initJumpNavVisibility();
    initBackToTop();
    initFunnelModal();
    initLightboxEvents();
    initSectionReveals();
    syncTimelineSideLayout();
    initTimelineNodeReveals();
    initMobileTextFocusMode();
    initProofCounters();
    initTechThumbFallbacks();
    initTechPreviewScroll();
    initTestimonialsCarousel();
    initGalleryDrag();
    initGalleryScrollLock();
    initMinaInteractions();
    initServiceWorker();
    init3D();
    initSplash();
    window.addEventListener('hashchange', () => {
        scrollToHashTarget('smooth');
    });
    window.addEventListener('load', () => {
        if (window.location.hash) {
            setTimeout(() => scrollToHashTarget('auto'), 300);
        }
    }, { once: true });
}

init();
