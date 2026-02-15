import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger, Flip);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPowerByCores = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
const lowPowerByMemory = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4;
const isLowPowerDevice = lowPowerByCores || lowPowerByMemory;
const allow3D = !prefersReducedMotion && !isLowPowerDevice;
const MOTION = {
    splashMs: prefersReducedMotion ? 450 : 980,
    modelEntranceMs: 0.82,
    revealStagger: 0.085,
    revealDuration: 0.66,
    revealEase: 'power3.out',
    counterDuration: 0.95,
    scrollScrub: 0.12
};
const SPLASH_SESSION_KEY = 'qazi_bismillah_seen_v1';

const mobileQuery = window.matchMedia('(max-width: 767px)');
let isMobile = mobileQuery.matches;
mobileQuery.addEventListener('change', (event) => {
    isMobile = event.matches;
});

const KEYFRAMES = {
    desktop: [
        { target: '#sec-hero', pos: { x: 0, y: -4, z: 0 }, rot: { x: 0.2, y: 0, z: 0 }, scale: 2.8 },
        { target: '#sec-profile', pos: { x: 2.5, y: -2, z: 0 }, rot: { x: 0, y: -0.8, z: 0 }, scale: 1.2 },
        { target: '#sec-history', pos: { x: 0, y: 2, z: -2 }, rot: { x: 0.3, y: 0, z: 0 }, scale: 1.0 },
        { target: '#sec-video', pos: { x: -3, y: 0, z: 0 }, rot: { x: 0, y: 0.5, z: 0 }, scale: 1.2 },
        { target: '#sec-gallery', pos: { x: 3, y: 0, z: 0 }, rot: { x: 0, y: -0.5, z: 0 }, scale: 1.2 },
        { target: '#sec-clients', pos: { x: -3, y: -2, z: 0 }, rot: { x: 0, y: 0.5, z: 0 }, scale: 1.2 },
        { target: '#sec-tech', pos: { x: 2.5, y: -1.5, z: 1 }, rot: { x: 0.1, y: -0.5, z: -0.1 }, scale: 1.2 },
        { target: '#sec-contact', pos: { x: 0, y: -1.5, z: 0 }, rot: { x: 0, y: 0, z: 0 }, scale: 0.35 }
    ],
    mobile: [
        { target: '#sec-hero', pos: { x: 0, y: -2, z: -1 }, rot: { x: 0.2, y: 0, z: 0 }, scale: 1.5 },
        { target: '#sec-profile', pos: { x: 0, y: 1, z: -4 }, rot: { x: 0, y: -0.5, z: 0 }, scale: 1.0 },
        { target: '#sec-history', pos: { x: 0, y: 2, z: -4 }, rot: { x: -0.2, y: 0, z: 0 }, scale: 1.0 },
        { target: '#sec-video', pos: { x: 0, y: -4, z: -4 }, rot: { x: -0.2, y: 0, z: 0 }, scale: 1.0 },
        { target: '#sec-gallery', pos: { x: 0, y: -4, z: -4 }, rot: { x: -0.2, y: 0, z: 0 }, scale: 1.0 },
        { target: '#sec-clients', pos: { x: 0, y: 2, z: -4 }, rot: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { target: '#sec-tech', pos: { x: 0, y: 1, z: -3 }, rot: { x: 0.1, y: -0.3, z: 0 }, scale: 1.0 },
        { target: '#sec-contact', pos: { x: 0, y: -1, z: -1 }, rot: { x: 0, y: 0, z: 0 }, scale: 0.35 }
    ]
};

const GALLERY_DATA = {
    birth: [
        { src: 'assets/qazibirth.jpg', caption: 'Qazi Islam: The Origin Point' },
        { src: 'assets/okcdowntown.jpg', caption: 'OKC Downtown' }
    ],
    lyrewood: [
        { src: 'assets/lyrewoodlane.png', caption: '7015 Lyrewood Lane' },
        { src: 'assets/qazibrothers.jpg', caption: 'The Brothers' }
    ],
    bangla: [
        { src: 'assets/banglabazaar_outside.jpg', caption: 'Bangla Bazaar Exterior' },
        { src: 'assets/qazi_bangladesh.jpg', caption: 'Qazi in Bangladesh' }
    ],
    grind: [
        { src: 'VgfP2XjQL_A', caption: 'Wedding Videography Reel' },
        { src: 'assets/sabah_vape_photography.jpg', caption: 'Sabah Vape Photography' },
        { src: 'assets/okcdowntown.jpg', caption: 'OKC Downtown Night' }
    ],
    mina: [
        { src: 'assets/minayellowbg.jpg', caption: 'Mina with Yellow Background' },
        { src: 'assets/minaonthehunt.jpg', caption: 'Mina on the Hunt' }
    ],
    agencies: [
        { src: 'assets/cannalinemarketing_spherex.jpg', caption: 'Cannaline Marketing Spherex' },
        { src: 'assets/cannalinemarketing.jpg', caption: 'Cannaline Marketing Branding' },
        { src: 'tF120629k3A', caption: 'Roots Project' },
        { src: 'assets/alterra_cannabis_greenery.jpg', caption: 'Alterra Cannabis Greenery' }
    ],
    mom: [
        { src: 'assets/maaportrait.jpg', caption: 'Portrait of Maa' },
        { src: 'assets/mom_homemovies.mp4', caption: 'Maa Home Movies' },
        { src: 'assets/mompoloroid.jpg', caption: 'Maa Polaroid' },
        { src: 'assets/babyqaziandmom.jpg', caption: 'Baby Qazi and Mom' }
    ],
    cair: [
        { src: 'pqaHFMtrNHY', caption: 'IMAN Documentary Trailer' },
        { src: 'assets/cairbeyondtheballet.jpg', caption: 'CAIR: Beyond the Ballet' },
        { src: 'assets/imandocumentaryposter.jpg', caption: 'IMAN Documentary Poster' },
        { src: 'vBpGV5GUhPM', caption: 'IMAN Documentary Clip' },
        { src: 'assets/foodbankcair.jpg', caption: 'CAIR Food Bank Event' }
    ],
    oao: [
        { src: 'assets/oaolandrally.jpg', caption: 'OAO Land Rally' },
        { src: 'assets/foodbankcair.jpg', caption: 'OAO Food Bank' }
    ],
    topcrop: [
        { src: 'assets/cananbisflower.jpg', caption: 'Cannabis Flower' },
        { src: 'assets/alterra_cannabis_greenery.jpg', caption: 'Alterra Cannabis Greenery' },
        { src: 'assets/sabah_vape_photography.jpg', caption: 'Sabah Vape Photography' }
    ],
    now: [
        { src: 'assets/qazi_noice.png', caption: 'Qazi: Big Dawg Era' },
        { src: 'assets/qaziminanicole.jpg', caption: 'Qazi, Mina, Nicole' },
        { src: 'assets/qazianddad.jpg', caption: 'Qazi and Dad' }
    ]
};

const VISUAL_GALLERY_DATA = [
    { src: 'assets/lilwayne.jpg', caption: 'Lil Wayne Concert' },
    { src: 'assets/smokeyqazi.jpg', caption: 'Smokey Qazi' },
    { src: 'assets/tianasoylent.jpg', caption: 'Tiana Soylent' },
    { src: 'assets/cananbisflower.jpg', caption: 'Cannabis Flower Close-up' },
    { src: 'assets/alexeppler.jpg', caption: 'Alex Eppler Portrait' },
    { src: 'assets/qaziseattleforrest.jpg', caption: 'Qazi in Seattle Forest' },
    { src: 'assets/foodbankcair.jpg', caption: 'CAIR Food Bank' },
    { src: 'assets/repturner.jpg', caption: 'Representative Turner' },
    { src: 'assets/mompoloroid.jpg', caption: 'Mom Polaroid' },
    { src: 'assets/qazianddad.jpg', caption: 'Qazi and Dad' },
    { src: 'assets/alterra_cannabis_greenery.jpg', caption: 'Alterra Cannabis Greenery' },
    { src: 'assets/bangladesh_dronepicture.jpg', caption: 'Bangladesh Drone View' },
    { src: 'assets/imandocumentaryposter.jpg', caption: 'IMAN Documentary Poster' },
    { src: 'assets/jabee_runthejewels.jpg', caption: 'Jabee with Run The Jewels' },
    { src: 'assets/jabee_thunderarena.jpg', caption: 'Jabee at Thunder Arena' },
    { src: 'assets/okcdowntown.jpg', caption: 'OKC Downtown' },
    { src: 'assets/pokuxshopgood%202.jpg', caption: 'Pokux Shopgood' }
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
let targetRotation = { x: 0, y: 0 };
let currentKeyframes = isMobile ? KEYFRAMES.mobile : KEYFRAMES.desktop;
let modelLoadedPromise = Promise.resolve();
let rafId = null;

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
let activeThumbnail = null;

function initContactActions() {
    const secureContactLink = document.getElementById('secure-contact-link');
    if (secureContactLink) {
        secureContactLink.addEventListener('click', (event) => {
            event.preventDefault();
            const user = 'qazi';
            const domain = 'imagelinestudios.com';
            window.location.href = `mailto:${user}@${domain}`;
        });
    }

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

function initFunnelModal() {
    const funnel = document.getElementById('funnel-modal');
    const funnelClose = document.querySelector('.funnel-close');
    const triggerButtons = document.querySelectorAll('.js-initiate');

    if (!funnel || !funnelClose || triggerButtons.length === 0) {
        return;
    }

    triggerButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            funnel.classList.remove('hidden');
        });
    });

    funnelClose.addEventListener('click', () => {
        funnel.classList.add('hidden');
    });

    funnel.addEventListener('click', (event) => {
        if (event.target === funnel) {
            funnel.classList.add('hidden');
        }
    });
}

function revealSite() {
    const splash = document.getElementById('splash-screen');
    if (!splash || splash.dataset.revealed === 'true') {
        return;
    }

    splash.dataset.revealed = 'true';
    splash.classList.add('is-exiting');

    setTimeout(() => {
        document.body.classList.remove('no-scroll');
        splash.classList.add('hidden');
        splash.style.display = 'none';
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

    const minSplashMs = hasSeenSplash ? (prefersReducedMotion ? 120 : 320) : MOTION.splashMs;
    const minTime = new Promise((resolve) => setTimeout(resolve, minSplashMs));
    const loadTime = new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

    Promise.all([minTime, loadTime, modelLoadedPromise.catch(() => null)]).then(completeSplash);

    setTimeout(() => {
        completeSplash();
    }, hasSeenSplash ? 2200 : 4500);
}

function init3D() {
    if (!allow3D) {
        const stage = document.getElementById('mina-stage');
        if (stage) {
            stage.style.opacity = '0.12';
        }
        return;
    }

    const canvas = document.getElementById('mina-canvas');
    if (!canvas) {
        return;
    }

    currentKeyframes = isMobile ? KEYFRAMES.mobile : KEYFRAMES.desktop;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    minaGroup = new THREE.Group();
    scene.add(minaGroup);

    const redLight = new THREE.SpotLight(0xe30613, isMobile ? 45 : 34);
    redLight.position.set(-5, 2, -2);
    scene.add(redLight);

    const blueLight = new THREE.SpotLight(0xaaccff, isMobile ? 24 : 16);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, isMobile ? 1.6 : 1.2);
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
            mina.scale.set(startFrame.scale, startFrame.scale, startFrame.scale);
            minaGroup.position.set(startFrame.pos.x, startFrame.pos.y, startFrame.pos.z);
            minaGroup.rotation.set(startFrame.rot.x, startFrame.rot.y, startFrame.rot.z);

            minaGroup.add(mina);
            initScrollAnimations();
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
            mina.position.y = Math.sin(time) * 0.05;

            if (isMobile) {
                mina.rotation.y += 0.003;
            } else {
                mina.rotation.y += (targetRotation.y - mina.rotation.y) * 0.08;
                mina.rotation.x += (targetRotation.x - mina.rotation.x) * 0.08;
            }
        }

        renderer.render(scene, camera);
    };

    renderFrame();
}

function initScrollAnimations() {
    if (!allow3D || !minaGroup) {
        return;
    }

    ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars && trigger.vars.trigger === '#scroll-stream') {
            trigger.kill();
        }
    });

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#scroll-stream',
            start: 'top top',
            end: 'bottom bottom',
            scrub: MOTION.scrollScrub
        }
    });

    currentKeyframes.forEach((frame, index) => {
        if (index === 0) {
            return;
        }
        timeline.to(minaGroup.position, { x: frame.pos.x, y: frame.pos.y, z: frame.pos.z, duration: 1, ease: 'none' }, index - 0.5);
        timeline.to(minaGroup.rotation, { x: frame.rot.x, y: frame.rot.y, z: frame.rot.z, duration: 1, ease: 'none' }, index - 0.5);
        timeline.to(mina.scale, { x: frame.scale, y: frame.scale, z: frame.scale, duration: 1, ease: 'none' }, index - 0.5);
    });
}

function onMouseMove(event) {
    if (!allow3D || isMobile) {
        return;
    }
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotation.y = x * 0.5;
    targetRotation.x = y * 0.25;
}

function onResize() {
    if (!allow3D || !camera || !renderer) {
        return;
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

function openGallery(source, index = 0, element = null) {
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
    activeThumbnail = element ? element.querySelector('img') : null;

    updateLightbox(false);
    lightbox.classList.remove('hidden');

    if (activeThumbnail && source === 'visuals' && !prefersReducedMotion) {
        const state = Flip.getState(activeThumbnail);
        lightboxImg.classList.remove('hidden');
        Flip.from(state, {
            targets: lightboxImg,
            duration: 0.5,
            ease: 'power2.inOut',
            scale: true
        });
    }
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

    if (animate && !prefersReducedMotion) {
        [lightboxImg, lightboxVid, lightboxYT].forEach((node) => node.classList.add('fade-out'));
    }

    setTimeout(() => {
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

        [lightboxImg, lightboxVid, lightboxYT].forEach((node) => node.classList.remove('fade-out'));
    }, animate && !prefersReducedMotion ? 200 : 0);
}

function showNext() {
    currentIndex = currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0;
    activeThumbnail = null;
    updateLightbox(true);
}

function showPrev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1;
    activeThumbnail = null;
    updateLightbox(true);
}

function closeLightbox() {
    if (!lightbox) {
        return;
    }
    lightbox.classList.add('hidden');
    lightboxVid.pause();
    ytPlayer.src = '';
    activeThumbnail = null;
}

function initLightboxEvents() {
    if (!lightbox || !closeBtn || !prevBtn || !nextBtn) {
        return;
    }

    document.body.addEventListener('click', (event) => {
        const timelineItem = event.target.closest('.tm-content[data-gallery-key]');
        const visualItem = event.target.closest('.scroll-item[data-gallery-index]');
        const videoItem = event.target.closest('.video-card[data-gallery-index]');

        if (timelineItem) {
            openGallery(timelineItem.dataset.galleryKey);
            return;
        }

        if (visualItem) {
            openGallery('visuals', Number(visualItem.dataset.galleryIndex), visualItem);
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

function initGalleryDrag() {
    const slider = document.querySelector('.gallery-scroll-container');
    if (!slider) {
        return;
    }

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener('pointerdown', (event) => {
        isDown = true;
        slider.classList.add('active');
        startX = event.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.setPointerCapture(event.pointerId);
    });

    slider.addEventListener('pointerup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('pointerleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('pointermove', (event) => {
        if (!isDown) {
            return;
        }
        event.preventDefault();
        const x = event.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.8;
        slider.scrollLeft = scrollLeft - walk;
    });
}

function init() {
    if (!prefersReducedMotion) {
        document.body.classList.add('motion-ready');
    }
    initContactActions();
    initFunnelModal();
    initLightboxEvents();
    initSectionReveals();
    initProofCounters();
    initGalleryDrag();
    init3D();
    initSplash();
}

init();
