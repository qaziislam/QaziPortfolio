import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPowerByCores = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
const lowPowerByMemory = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4;
const isLowPowerDevice = lowPowerByCores || lowPowerByMemory;
const allow3D = !prefersReducedMotion;
const lowDetail3D = isLowPowerDevice;
const MOTION = {
    splashMs: prefersReducedMotion ? 900 : 2400,
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
const SPLASH_SESSION_KEY = 'qazi_bismillah_seen_v1';
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
        { target: '#sec-hero', pos: { x: 3.0, y: -1.22, z: 0.46 }, rot: { x: 0.08, y: 0, z: 0 }, scale: 2.0, look: { x: -1.55, z: 3.1 } },
        { target: '#sec-profile', pos: { x: 2.75, y: -1.28, z: 0.22 }, rot: { x: 0.05, y: 0, z: 0.01 }, scale: 1.0, look: { x: -1.2, z: 2.15 } },
        { target: '#sec-gallery', pos: { x: 2.95, y: -1.02, z: 0.24 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 1.0, look: { x: 0.0, z: 2.05 } },
        { target: '#sec-history', pos: { x: 2.7, y: 0.18, z: 0.14 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.98, look: { x: -0.95, z: 1.75 } },
        { target: '#sec-iman', pos: { x: 2.9, y: -0.22, z: 0.32 }, rot: { x: 0.07, y: 0, z: -0.01 }, scale: 1.02, look: { x: -0.9, z: 1.82 } },
        { target: '#sec-video', pos: { x: -2.45, y: -0.55, z: 0.2 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 1.0, look: { x: 0.75, z: 1.95 } },
        { target: '#sec-clients', pos: { x: 2.35, y: -1.08, z: 0.15 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.98, look: { x: -0.82, z: 2.08 } },
        { target: '#sec-cred', pos: { x: 2.25, y: -0.28, z: 0.36 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.98, look: { x: -0.85, z: 2.26 } },
        { target: '#sec-tech', pos: { x: 2.3, y: -0.95, z: 0.22 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.98, look: { x: -0.92, z: 2.36 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.24, z: 0.44 }, rot: { x: 0.03, y: 0, z: 0 }, scale: 0.8, look: { x: 0.0, z: 4.55 } }
    ],
    laptop: [
        { target: '#sec-hero', pos: { x: 2.55, y: -1.16, z: 0.32 }, rot: { x: 0.08, y: 0, z: 0 }, scale: 1.72, look: { x: -1.35, z: 2.85 } },
        { target: '#sec-profile', pos: { x: 2.3, y: -1.2, z: 0.18 }, rot: { x: 0.05, y: 0, z: 0.01 }, scale: 0.96, look: { x: -1.0, z: 2.0 } },
        { target: '#sec-gallery', pos: { x: 2.45, y: -0.95, z: 0.2 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.96, look: { x: 0.0, z: 1.9 } },
        { target: '#sec-history', pos: { x: 2.3, y: 0.12, z: 0.1 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.94, look: { x: -0.85, z: 1.65 } },
        { target: '#sec-iman', pos: { x: 2.45, y: -0.18, z: 0.28 }, rot: { x: 0.07, y: 0, z: -0.01 }, scale: 0.98, look: { x: -0.8, z: 1.72 } },
        { target: '#sec-video', pos: { x: -2.15, y: -0.48, z: 0.16 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.96, look: { x: 0.7, z: 1.8 } },
        { target: '#sec-clients', pos: { x: 2.08, y: -1.0, z: 0.14 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.94, look: { x: -0.72, z: 1.92 } },
        { target: '#sec-cred', pos: { x: 2.02, y: -0.24, z: 0.3 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.94, look: { x: -0.78, z: 2.04 } },
        { target: '#sec-tech', pos: { x: 2.05, y: -0.88, z: 0.2 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.94, look: { x: -0.82, z: 2.15 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.22, z: 0.42 }, rot: { x: 0.03, y: 0, z: 0 }, scale: 0.78, look: { x: 0.0, z: 4.2 } }
    ],
    tablet: [
        { target: '#sec-hero', pos: { x: 1.45, y: -1.1, z: -0.15 }, rot: { x: 0.08, y: 0, z: 0 }, scale: 1.44, look: { x: -0.8, z: 2.4 } },
        { target: '#sec-profile', pos: { x: 1.5, y: -1.0, z: -1.1 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.92, look: { x: -0.62, z: 1.45 } },
        { target: '#sec-gallery', pos: { x: 1.65, y: -0.92, z: -1.18 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.92, look: { x: -0.06, z: 1.4 } },
        { target: '#sec-history', pos: { x: 1.65, y: 0.18, z: -1.08 }, rot: { x: 0.06, y: 0, z: 0 }, scale: 0.9, look: { x: -0.6, z: 1.2 } },
        { target: '#sec-iman', pos: { x: 1.75, y: -0.12, z: -0.94 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.96, look: { x: -0.55, z: 1.25 } },
        { target: '#sec-video', pos: { x: -1.6, y: -0.5, z: -1.14 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.92, look: { x: 0.52, z: 1.3 } },
        { target: '#sec-clients', pos: { x: 1.52, y: -0.9, z: -1.1 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.9, look: { x: -0.52, z: 1.35 } },
        { target: '#sec-cred', pos: { x: 1.5, y: -0.2, z: -0.88 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.9, look: { x: -0.52, z: 1.58 } },
        { target: '#sec-tech', pos: { x: 1.45, y: -0.82, z: -0.95 }, rot: { x: 0.06, y: 0, z: -0.01 }, scale: 0.9, look: { x: -0.48, z: 1.6 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.3, z: -0.42 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.82, look: { x: 0.0, z: 2.85 } }
    ],
    mobile: [
        { target: '#sec-hero', pos: { x: 1.06, y: -1.0, z: -0.86 }, rot: { x: 0.07, y: 0, z: 0 }, scale: 1.0, look: { x: -0.5, z: 2.7 } },
        { target: '#sec-profile', pos: { x: -0.72, y: -0.88, z: -2.22 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.86, look: { x: 0.24, z: 1.24 } },
        { target: '#sec-gallery', pos: { x: 0.78, y: -0.96, z: -2.3 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.86, look: { x: -0.06, z: 1.2 } },
        { target: '#sec-history', pos: { x: -0.74, y: 0.2, z: -2.08 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.84, look: { x: 0.24, z: 1.06 } },
        { target: '#sec-iman', pos: { x: 0.78, y: -0.1, z: -1.96 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.86, look: { x: -0.28, z: 1.14 } },
        { target: '#sec-video', pos: { x: -0.72, y: -0.56, z: -2.12 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.84, look: { x: 0.22, z: 1.08 } },
        { target: '#sec-clients', pos: { x: 0.72, y: 0.18, z: -2.04 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.84, look: { x: -0.22, z: 1.14 } },
        { target: '#sec-cred', pos: { x: -0.7, y: -0.04, z: -1.88 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.84, look: { x: 0.2, z: 1.3 } },
        { target: '#sec-tech', pos: { x: 0.72, y: -0.54, z: -1.9 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.84, look: { x: -0.18, z: 1.36 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.34, z: -1.08 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.8, look: { x: 0.0, z: 3.2 } }
    ],
    small_mobile: [
        { target: '#sec-hero', pos: { x: 0.92, y: -0.94, z: -0.86 }, rot: { x: 0.07, y: 0, z: 0 }, scale: 0.96, look: { x: -0.42, z: 2.38 } },
        { target: '#sec-profile', pos: { x: -0.64, y: -0.82, z: -2.12 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: 0.2, z: 1.12 } },
        { target: '#sec-gallery', pos: { x: 0.7, y: -0.92, z: -2.18 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.04, z: 1.08 } },
        { target: '#sec-history', pos: { x: -0.66, y: 0.2, z: -2.02 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.78, look: { x: 0.2, z: 0.98 } },
        { target: '#sec-iman', pos: { x: 0.72, y: -0.1, z: -1.9 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.8, look: { x: -0.22, z: 1.04 } },
        { target: '#sec-video', pos: { x: -0.64, y: -0.54, z: -2.04 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.78, look: { x: 0.18, z: 1.0 } },
        { target: '#sec-clients', pos: { x: 0.66, y: 0.18, z: -1.98 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.78, look: { x: -0.2, z: 1.06 } },
        { target: '#sec-cred', pos: { x: -0.62, y: -0.04, z: -1.84 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.78, look: { x: 0.18, z: 1.2 } },
        { target: '#sec-tech', pos: { x: 0.64, y: -0.5, z: -1.86 }, rot: { x: 0.05, y: 0, z: 0 }, scale: 0.78, look: { x: -0.16, z: 1.26 } },
        { target: '#sec-contact', pos: { x: 0.0, y: -0.26, z: -1.02 }, rot: { x: 0.04, y: 0, z: 0 }, scale: 0.74, look: { x: 0.0, z: 2.8 } }
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
        { src: 'assets/qazianddad.jpg', caption: 'Qazi and Dad' }
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

    const minSplashMs = hasSeenSplash ? (prefersReducedMotion ? 420 : 1200) : MOTION.splashMs;
    const minTime = new Promise((resolve) => setTimeout(resolve, minSplashMs));
    const loadTime = new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

    Promise.all([minTime, loadTime, modelLoadedPromise.catch(() => null)]).then(completeSplash);

    setTimeout(() => {
        completeSplash();
    }, hasSeenSplash ? 3200 : 6200);
}

function init3D() {
    if (!allow3D) {
        const stage = document.getElementById('mina-stage');
        if (stage) {
            stage.style.opacity = '0';
        }
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

function applyFramePose(frame, immediate = false) {
    if (!minaGroup || !mina) {
        return;
    }
    if (isGalleryPinned && frame.target !== '#sec-gallery') {
        return;
    }
    if (isMinaDocked && frame.target !== '#sec-contact') {
        return;
    }
    const duration = immediate ? 0 : 0.82;
    const frameLook = frame.look || DEFAULT_LOOK_TARGET;
    gsap.to(minaGroup.position, { x: frame.pos.x, y: frame.pos.y, z: frame.pos.z, duration, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(minaGroup.rotation, { x: frame.rot.x, z: frame.rot.z, duration, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(mina.scale, { x: frame.scale, y: frame.scale, z: frame.scale, duration, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(activeLookTarget, { x: frameLook.x, z: frameLook.z, duration, ease: 'power2.out', overwrite: 'auto' });
}

function createHistoryLaneTriggers() {
    if (viewportProfile === 'mobile' || viewportProfile === 'small_mobile') {
        return;
    }
    const cards = Array.from(document.querySelectorAll('#sec-history .tm-content[data-gallery-key]'));
    if (cards.length === 0) {
        return;
    }
    const historyFrame = findFrameByTarget('#sec-history') || currentKeyframes[3];
    if (!historyFrame) {
        return;
    }

    cards.forEach((card) => {
        const node = card.closest('.timeline-node');
        const contentOnRight = node?.classList.contains('right') ?? false;
        const key = card.dataset.galleryKey || '';
        const laneMap = {
            desktop: 2.9,
            laptop: 2.45,
            tablet: 1.7,
            mobile: 0.95,
            small_mobile: 0.82
        };
        const lookZMap = {
            desktop: 1.86,
            laptop: 1.72,
            tablet: 1.34,
            mobile: 1.16,
            small_mobile: 1.1
        };
        const laneX = laneMap[viewportProfile] ?? 2.35;
        const baseX = contentOnRight ? -laneX : laneX;
        const lookX = contentOnRight ? 0.95 : -0.95;
        const lookZ = lookZMap[viewportProfile] ?? 1.86;
        const profileOffsets = {
            desktop: {
                birth: { y: -0.06, z: 0.2, scale: 1.0, x: 0.96 },
                target: { y: 0.08, z: 0.16, scale: 0.99, x: 0.94 },
                lyrewood: { y: 0.16, z: 0.14, scale: 0.98, x: 1.02 },
                bangla: { y: 0.11, z: 0.15, scale: 0.98, x: 1.0 },
                bpa: { y: 0.04, z: 0.18, scale: 0.96, x: 0.96 },
                grind: { y: -0.02, z: 0.2, scale: 0.98, x: 1.02 },
                roots: { y: 0.02, z: 0.2, scale: 0.98, x: 0.98 },
                mina: { y: -0.1, z: 0.22, scale: 1.02, x: 1.0 },
                imageline: { y: -0.04, z: 0.24, scale: 0.96, x: 1.02 },
                cannaline: { y: 0.03, z: 0.2, scale: 0.94, x: 0.98 },
                mom: { y: 0.05, z: 0.18, scale: 0.96, x: 0.98 },
                cair: { y: -0.03, z: 0.22, scale: 0.96, x: 1.02 },
                oao: { y: 0.02, z: 0.18, scale: 0.94, x: 0.98 },
                topcrop: { y: -0.04, z: 0.2, scale: 0.94, x: 1.02 },
                now: { y: -0.08, z: 0.24, scale: 0.94, x: 1.0 }
            },
            laptop: {
                birth: { y: -0.04, z: 0.16, scale: 0.98, x: 0.96 },
                target: { y: 0.06, z: 0.14, scale: 0.97, x: 0.94 },
                lyrewood: { y: 0.13, z: 0.12, scale: 0.96, x: 1.02 },
                bangla: { y: 0.09, z: 0.13, scale: 0.96, x: 1.0 },
                bpa: { y: 0.03, z: 0.16, scale: 0.94, x: 0.96 },
                grind: { y: -0.01, z: 0.17, scale: 0.96, x: 1.02 },
                roots: { y: 0.02, z: 0.17, scale: 0.96, x: 0.98 },
                mina: { y: -0.08, z: 0.18, scale: 0.98, x: 1.0 },
                imageline: { y: -0.03, z: 0.2, scale: 0.94, x: 1.02 },
                cannaline: { y: 0.02, z: 0.17, scale: 0.92, x: 0.98 },
                mom: { y: 0.04, z: 0.16, scale: 0.94, x: 0.98 },
                cair: { y: -0.02, z: 0.19, scale: 0.94, x: 1.02 },
                oao: { y: 0.02, z: 0.16, scale: 0.92, x: 0.98 },
                topcrop: { y: -0.03, z: 0.17, scale: 0.92, x: 1.02 },
                now: { y: -0.06, z: 0.2, scale: 0.92, x: 1.0 }
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
                birth: { y: -0.02, z: -2.28, scale: 0.9, x: 0.94 },
                target: { y: 0.05, z: -2.26, scale: 0.88, x: 0.94 },
                lyrewood: { y: 0.1, z: -2.24, scale: 0.88, x: 1.0 },
                bangla: { y: 0.09, z: -2.24, scale: 0.88, x: 0.98 },
                bpa: { y: 0.03, z: -2.16, scale: 0.86, x: 0.95 },
                grind: { y: 0, z: -2.14, scale: 0.88, x: 1.0 },
                roots: { y: 0.04, z: -2.14, scale: 0.88, x: 0.96 },
                mina: { y: -0.05, z: -2.1, scale: 0.9, x: 0.98 },
                imageline: { y: -0.02, z: -2.06, scale: 0.86, x: 1.0 },
                cannaline: { y: 0.02, z: -2.1, scale: 0.84, x: 0.96 },
                mom: { y: 0.04, z: -2.14, scale: 0.86, x: 0.96 },
                cair: { y: -0.02, z: -2.06, scale: 0.86, x: 1.0 },
                oao: { y: 0.01, z: -2.08, scale: 0.84, x: 0.96 },
                topcrop: { y: -0.02, z: -2.06, scale: 0.84, x: 1.0 },
                now: { y: -0.06, z: -1.98, scale: 0.84, x: 0.98 }
            },
            small_mobile: {
                birth: { y: -0.02, z: -2.12, scale: 0.84, x: 0.94 },
                target: { y: 0.04, z: -2.1, scale: 0.82, x: 0.94 },
                lyrewood: { y: 0.09, z: -2.08, scale: 0.82, x: 1.0 },
                bangla: { y: 0.08, z: -2.08, scale: 0.82, x: 0.98 },
                bpa: { y: 0.03, z: -2.0, scale: 0.8, x: 0.95 },
                grind: { y: 0, z: -1.98, scale: 0.82, x: 1.0 },
                roots: { y: 0.04, z: -1.98, scale: 0.82, x: 0.96 },
                mina: { y: -0.05, z: -1.94, scale: 0.84, x: 0.98 },
                imageline: { y: -0.02, z: -1.9, scale: 0.8, x: 1.0 },
                cannaline: { y: 0.02, z: -1.94, scale: 0.78, x: 0.96 },
                mom: { y: 0.04, z: -1.98, scale: 0.8, x: 0.96 },
                cair: { y: -0.02, z: -1.9, scale: 0.8, x: 1.0 },
                oao: { y: 0.01, z: -1.92, scale: 0.78, x: 0.96 },
                topcrop: { y: -0.02, z: -1.9, scale: 0.78, x: 1.0 },
                now: { y: -0.06, z: -1.84, scale: 0.78, x: 0.98 }
            }
        };
        const tweak = profileOffsets[viewportProfile]?.[key] || {};
        const minaX = baseX * (tweak.x || 1);
        const sideFrame = {
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

        const trigger = ScrollTrigger.create({
            trigger: card,
            start: 'top 74%',
            end: 'bottom 34%',
            onEnter: () => {
                if (isGalleryPinned || isMinaDocked) {
                    return;
                }
                applyFramePose(sideFrame);
            },
            onEnterBack: () => {
                if (isGalleryPinned || isMinaDocked) {
                    return;
                }
                applyFramePose(sideFrame);
            }
        });
        minaMotionTriggers.push(trigger);
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
        x: hero.pos.x + (isMobile ? 0.16 : 0.35),
        y: hero.pos.y - (isMobile ? 0.08 : 0.14),
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

    updateLightbox(false);
    lightbox.classList.remove('hidden');
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
    lightboxVid.pause();
    ytPlayer.src = '';
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
            closeLightbox();
        }
        if (event.key === 'ArrowRight') {
            showNext();
        }
        if (event.key === 'ArrowLeft') {
            showPrev();
        }
    });
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
    const targets = ['#sec-hero', '#sec-profile', '#sec-history', '#sec-cred', '#sec-tech']
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

function initGalleryDrag() {
    const slider = document.querySelector('.gallery-scroll-container');
    if (!slider) {
        return;
    }
    slider.querySelectorAll('img').forEach((img) => {
        img.draggable = false;
    });

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let startScrollY = 0;
    const dragThreshold = 8;

    slider.addEventListener('pointerdown', (event) => {
        isDown = true;
        slider.classList.add('active');
        document.body.classList.add('gallery-dragging');
        startX = event.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        startScrollY = window.scrollY;
        galleryDidDrag = false;
        slider.setPointerCapture(event.pointerId);
    });

    const release = () => {
        isDown = false;
        slider.classList.remove('active');
        document.body.classList.remove('gallery-dragging');
    };

    slider.addEventListener('pointerup', release);
    slider.addEventListener('pointercancel', release);
    slider.addEventListener('pointerleave', release);

    slider.addEventListener('pointermove', (event) => {
        if (!isDown) {
            return;
        }
        const x = event.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.8;
        if (Math.abs(walk) > dragThreshold) {
            galleryDidDrag = true;
        }

        const isDesktop = !window.matchMedia('(max-width: 768px)').matches;
        const isPinned = isDesktop && document.body.classList.contains('gallery-locked') && galleryPinTrigger;
        if (isPinned) {
            if (!galleryDidDrag) {
                return;
            }
            event.preventDefault();
            const nextY = THREE.MathUtils.clamp(startScrollY - walk * 1.2, galleryPinTrigger.start, galleryPinTrigger.end);
            window.scrollTo({ top: nextY });
            return;
        }
        if (!galleryDidDrag) {
            return;
        }
        event.preventDefault();
        slider.scrollLeft = scrollLeft - walk;
    });
}

function initGalleryScrollLock() {
    const section = document.getElementById('sec-gallery');
    const container = section?.querySelector('.gallery-scroll-container');
    const track = section?.querySelector('.gallery-scroll-track');
    const progressFill = section?.querySelector('.gallery-progress-fill');

    if (!section || !container || !track || prefersReducedMotion) {
        return;
    }

    const setPinnedState = (active) => {
        document.body.classList.toggle('gallery-locked', active);
        isGalleryPinned = active;
        if (active) {
            isMinaDocked = false;
            const galleryFrame = findFrameByTarget('#sec-gallery');
            if (galleryFrame) {
                applyFramePose(galleryFrame);
            }
        }
        if (progressFill && !active) {
            progressFill.style.width = '0%';
        }
        if (minaMaterial) {
            gsap.to(minaMaterial, {
                emissiveIntensity: active ? 0.42 : 0.2,
                duration: active ? 0.24 : 0.3,
                overwrite: 'auto',
                ease: 'power1.out'
            });
        }
        if (redKeyLight) {
            gsap.to(redKeyLight, {
                intensity: active ? redKeyLightBaseIntensity * 1.35 : redKeyLightBaseIntensity,
                duration: active ? 0.24 : 0.34,
                overwrite: 'auto',
                ease: 'power1.out'
            });
        }
    };

    ScrollTrigger.matchMedia({
        '(min-width: 769px)': () => {
            const horizontalDistance = () => Math.max(0, track.scrollWidth - container.clientWidth);
            const sweepDistance = () => horizontalDistance() * GALLERY_SCROLL_EXPERIENCE.desktopTravelRatio;
            const pinDistance = () => {
                const vhMin = window.innerHeight * GALLERY_SCROLL_EXPERIENCE.desktopPinVhMin;
                const vhMax = window.innerHeight * GALLERY_SCROLL_EXPERIENCE.desktopPinVhMax;
                const bySweep = window.innerHeight * 0.5 + sweepDistance() * 0.35;
                return Math.max(vhMin, Math.min(vhMax, bySweep));
            };

            const tween = gsap.to(track, {
                x: () => -sweepDistance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${pinDistance()}`,
                    pin: true,
                    scrub: GALLERY_SCROLL_EXPERIENCE.desktopScrub,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onEnter: () => setPinnedState(true),
                    onEnterBack: () => setPinnedState(true),
                    onLeave: () => setPinnedState(false),
                    onLeaveBack: () => setPinnedState(false),
                    onUpdate: (self) => {
                        galleryPinTrigger = self;
                        if (progressFill) {
                            progressFill.style.width = `${Math.round(self.progress * 100)}%`;
                        }
                    }
                }
            });
            galleryPinTrigger = tween.scrollTrigger || null;

            return () => {
                tween.scrollTrigger?.kill();
                tween.kill();
                galleryPinTrigger = null;
                gsap.set(track, { clearProps: 'transform' });
                setPinnedState(false);
            };
        }
    });
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
    initJumpNavVisibility();
    initBackToTop();
    initFunnelModal();
    initLightboxEvents();
    initSectionReveals();
    initTimelineNodeReveals();
    initMobileTextFocusMode();
    initProofCounters();
    initTechThumbFallbacks();
    initGalleryDrag();
    initGalleryScrollLock();
    initMinaInteractions();
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
