import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger, Flip);

// --- VARIABLES ---
let scene, camera, renderer, mina, minaGroup;
let isRevealed = false;
let mouse = new THREE.Vector2();
let targetRotation = { x: 0, y: 0 };

// Dynamic mobile detection
const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
let isMobile = mobileMediaQuery.matches;
mobileMediaQuery.addEventListener('change', (e) => {
    isMobile = e.matches;
    // You might want to re-evaluate activeKeyframes or other mobile-dependent logic here
    // e.g., adjust 3D scene details or animation behavior
});

// --- SPAM PROTECTION (Anti-Bot Mailto) ---
const contactLink = document.getElementById('secure-contact-link');
if(contactLink) {
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        const u = 'qazi';
        const d = 'imagelinestudios.com';
        window.location.href = `mailto:${u}@${d}`;
    });
}

// --- FUNNEL MODAL EMAILS (Event Delegation) ---
const funnelModal = document.getElementById('funnel-modal');
if (funnelModal) {
    funnelModal.addEventListener('click', function(e) {
        const targetBtn = e.target.closest('.funnel-btn');
        if (targetBtn && targetBtn.dataset.subject) {
            e.preventDefault();
            const subject = targetBtn.dataset.subject;
            const u = 'qazi';
            const d = 'imagelinestudios.com';
            window.location.href = `mailto:${u}@${d}?subject=${encodeURIComponent(subject)}`;
        }
    });
}

// --- GALLERY DATA ---
const GALLERY_DATA = {
    'birth': [
        { src: 'assets/qazibirth.jpg', caption: 'Qazi Islam: The Origin Point' },
        { src: 'assets/okcdowntown.jpg', caption: 'OKC Downtown' }
    ],
    'lyrewood': [
        { src: 'assets/lyrewoodlane.png', caption: '7015 Lyrewood Lane' },
        { src: 'assets/qazibrothers.jpg', caption: 'The Brothers' }
    ], 
    'bangla': [
        { src: 'assets/banglabazaar_outside.jpg', caption: 'Bangla Bazaar Exterior' },
        { src: 'assets/qazi_bangladesh.jpg', caption: 'Qazi in Bangladesh' }
    ],
    'grind': [
        { src: 'VgfP2XjQL_A', caption: 'Wedding Videography Reel' },
        { src: 'assets/sabah_vape_photography.jpg', caption: 'Sabah Vape Photography' },
        { src: 'assets/okcdowntown.jpg', caption: 'OKC Downtown Night' }
    ], 
    'mina': [
        { src: 'assets/minayellowbg.jpg', caption: 'Mina with Yellow Background' },
        { src: 'assets/minaonthehunt.jpg', caption: 'Mina on the Hunt' }
    ], 
    'agencies': [
        { src: 'assets/cannalinemarketing_spherex.jpg', caption: 'Cannaline Marketing Spherex' },
        { src: 'assets/cannalinemarketing.jpg', caption: 'Cannaline Marketing Branding' },
        { src: 'tF120629k3A', caption: 'Roots Project' },
        { src: 'assets/alterra_cannabis_greenery.jpg', caption: 'Alterra Cannabis Greenery' }
    ],
    'mom': [
        { src: 'assets/maaportrait.jpg', caption: 'Portrait of Maa' },
        { src: 'assets/mom_homemovies.mp4', caption: 'Maa Home Movies' },
        { src: 'assets/mompoloroid.jpg', caption: 'Maa Polaroid' },
        { src: 'assets/babyqaziandmom.jpg', caption: 'Baby Qazi and Mom' }
    ],
    'cair': [
        { src: 'pqaHFMtrNHY', caption: 'IMAN Documentary Trailer' },
        { src: 'assets/cairbeyondtheballet.jpg', caption: 'CAIR: Beyond the Ballet' },
        { src: 'assets/imandocumentaryposter.jpg', caption: 'IMAN Documentary Poster' },
        { src: 'vBpGV5GUhPM', caption: 'IMAN Documentary Clip' },
        { src: 'assets/foodbankcair.jpg', caption: 'CAIR Food Bank Event' }
    ],
    'oao': [
        { src: 'assets/oaolandrally.jpg', caption: 'OAO Land Rally' },
        { src: 'assets/foodbankcair.jpg', caption: 'OAO Food Bank' }
    ], 
    'topcrop': [
        { src: 'assets/cananbisflower.jpg', caption: 'Cannabis Flower' },
        { src: 'assets/alterra_cannabis_greenery.jpg', caption: 'Alterra Cannabis Greenery' },
        { src: 'assets/sabah_vape_photography.jpg', caption: 'Sabah Vape Photography' }
    ],
    'now': [
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

// --- SCROLL ANIMATION KEYFRAMES ---
const KEYFRAMES = {
    desktop: [
        { target: "#sec-hero",    pos: { x: 0, y: -4, z: 0 },     rot: { x: 0.2, y: 0, z: 0 }, scale: 2.8 },
        { target: "#sec-profile", pos: { x: 2.5, y: -2, z: 0 },   rot: { x: 0, y: -0.8, z: 0 }, scale: 1.2 },
        { target: "#sec-history", pos: { x: 0, y: 2, z: -2 },     rot: { x: 0.3, y: 0, z: 0 }, scale: 1.0 },
        { target: "#sec-video",   pos: { x: -3, y: 0, z: 0 },     rot: { x: 0, y: 0.5, z: 0 }, scale: 1.2 },
        { target: "#sec-gallery", pos: { x: 3, y: 0, z: 0 },      rot: { x: 0, y: -0.5, z: 0 }, scale: 1.2 },
        { target: "#sec-clients", pos: { x: -3, y: -2, z: 0 },    rot: { x: 0, y: 0.5, z: 0 }, scale: 1.2 },
        { target: "#sec-tech",    pos: { x: 2.5, y: -1.5, z: 1 }, rot: { x: 0.1, y: -0.5, z: -0.1 }, scale: 1.2 },
        { target: "#sec-contact", pos: { x: 0, y: -1.5, z: 0 },   rot: { x: 0, y: 0, z: 0 }, scale: 0.35 } 
    ],
    mobile: [
        { target: "#sec-hero",    pos: { x: 0, y: -2, z: -1 }, rot: { x: 0.2, y: 0, z: 0 }, scale: 1.5 },
        { target: "#sec-profile", pos: { x: 0, y: 1, z: -4 }, rot: { x: 0, y: -0.5, z: 0 }, scale: 1.0 },
        { target: "#sec-history", pos: { x: 0, y: 2, z: -4 }, rot: { x: -0.2, y: 0, z: 0 }, scale: 1.0 },
        { target: "#sec-video",   pos: { x: 0, y: -4, z: -4 }, rot: { x: -0.2, y: 0, z: 0 }, scale: 1.0 },
        { target: "#sec-gallery", pos: { x: 0, y: -4, z: -4 }, rot: { x: -0.2, y: 0, z: 0 }, scale: 1.0 },
        { target: "#sec-clients", pos: { x: 0, y: 2, z: -4 }, rot: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { target: "#sec-tech",    pos: { x: 0, y: 1, z: -3 }, rot: { x: 0.1, y: -0.3, z: 0 }, scale: 1.0 },
        { target: "#sec-contact", pos: { x: 0, y: -1, z: -1 }, rot: { x: 0, y: 0, z: 0 }, scale: 0.35 }
    ]
};
let activeKeyframes; // Declare here, define later

// --- SMART LOADER & SAFETY NET ---
let modelLoadedPromise; // Will hold the promise for GLTF model loading

function revealSite() {
    if (isRevealed) return;
    isRevealed = true;
    
    console.log("System: Launching...");
    const splash = document.getElementById('splash-screen');
    splash.style.transform = "translateY(-100%)";
    
    setTimeout(() => {
        document.body.classList.remove('no-scroll');
        splash.style.display = 'none';
        
        // If 3D model didn't load in time, try init again or just let site run
        if (!mina) {
            console.log("Late Model Init...");
            init3D(); // This is a fallback, modelLoadedPromise will not resolve here
        } else {
            // Animate Mina entrance
            gsap.from(mina.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 1.5, ease: "back.out(1.7)" });
        }
    }, 800);
}

// 1. Minimum Branding Wait (2.5s)
const minTime = new Promise(r => setTimeout(r, 2500));
// 2. Window Load Event (DOM + Assets)
const loadTime = new Promise(resolve => window.addEventListener('load', resolve));
// 3. Launch when all done
Promise.all([minTime, loadTime]).then(() => {
    // Only proceed if 3D initialization was attempted
    if (modelLoadedPromise) {
        modelLoadedPromise.then(revealSite).catch(revealSite); // Reveal even if model fails
    } else {
        // Fallback if 3D init didn't happen for some reason (e.g. no canvas)
        revealSite(); 
    }
});


// 4. SAFETY NET: If assets hang, force open in 5s
setTimeout(() => {
    if (!isRevealed) {
        console.warn("Safety Net: Forcing Entry...");
        revealSite();
    }
}, 5000);


// --- 3D ENGINE ---
function init3D() {
    activeKeyframes = isMobile ? KEYFRAMES.mobile : KEYFRAMES.desktop; // Define here

    const canvas = document.getElementById('mina-canvas');
    if (!canvas) {
        console.warn("No #mina-canvas found. Skipping 3D initialization.");
        modelLoadedPromise = Promise.reject("No canvas"); // Reject promise if no canvas
        return; 
    }

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    minaGroup = new THREE.Group();
    scene.add(minaGroup);

    // Lights
    const redLight = new THREE.SpotLight(0xE30613, isMobile ? 80 : 50);
    redLight.position.set(-5, 2, -2);
    scene.add(redLight);

    const blueLight = new THREE.SpotLight(0xaaccff, isMobile ? 40 : 20);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, isMobile ? 3 : 2);
    rimLight.position.set(0, 5, -5); 
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0x222222, 1.5);
    scene.add(ambient);

    // Material
    const platinumMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, metalness: 0.9, roughness: 0.2, emissive: 0x111111, emissiveIntensity: 0.2
    });

    // Loader
    const loader = new GLTFLoader();
    modelLoadedPromise = new Promise((resolve, reject) => { // Assign promise to global var
        loader.load('mina.glb', (gltf) => {
            mina = gltf.scene;
            mina.traverse((child) => { 
                if (child.isMesh) {
                    child.material = platinumMaterial;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            const baseScale = activeKeyframes[0].scale || 1.2;
            mina.scale.set(baseScale, baseScale, baseScale);
            minaGroup.add(mina);
            
            // Initial Pos
            const start = activeKeyframes[0];
            minaGroup.position.set(start.pos.x, start.pos.y, start.pos.z);
            minaGroup.rotation.set(start.rot.x, start.rot.y, start.rot.z);

            animate();
            initScrollAnimations();
            resolve(); // Resolve promise on success
        }, undefined, (error) => {
            console.error("Mina Error:", error);
            reject(error); // Reject promise on error
        });
    });

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
}

function initScrollAnimations() {
    const tl = gsap.timeline({
        scrollTrigger: { trigger: "#scroll-stream", start: "top top", end: "bottom bottom", scrub: 0.1 }
    });

    activeKeyframes.forEach((kf, i) => {
        if (i === 0) return;
        tl.to(minaGroup.position, { x: kf.pos.x, y: kf.pos.y, z: kf.pos.z, duration: 1, ease: "none" }, i - 0.5); 
        tl.to(minaGroup.rotation, { x: kf.rot.x, y: kf.rot.y, z: kf.rot.z, duration: 1, ease: "none" }, i - 0.5);
        if (kf.scale && mina) {
            tl.to(mina.scale, { x: kf.scale, y: kf.scale, z: kf.scale, duration: 1, ease: "none" }, i - 0.5);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (mina && minaGroup) {
        const time = Date.now() * 0.005;
        mina.position.y = Math.sin(time) * 0.05; 
        
        if (isMobile) {
            mina.rotation.y += 0.005; 
        } else {
            mina.rotation.y += (targetRotation.y - mina.rotation.y) * 0.1;
            mina.rotation.x += (targetRotation.x - mina.rotation.x) * 0.1;
        }
    }
    renderer.render(scene, camera);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotation.y = mouse.x * 0.5;
    targetRotation.x = mouse.y * 0.25;
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- LIGHTBOX ENGINE ---
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

// Combined and scoped gallery opening logic
function openGallery(gallery, index = 0, element = null) {
    let sourceData;
    let galleryKey = gallery; // e.g., 'birth', 'grind'

    if (gallery === 'visuals') {
        sourceData = VISUAL_DATA_IMAGES;
        galleryKey = index; // The index is the key
    } else if (gallery === 'videos') {
        sourceData = VIDEO_IDS;
        galleryKey = index;
    } else {
        sourceData = GALLERY_DATA[galleryKey];
    }
    
    if (!sourceData) return;

    currentGallery = sourceData;
    currentIndex = index;
    activeThumbnail = element ? element.querySelector('img') : null;
    
    updateLightbox(false);
    lightbox.classList.remove('hidden');

    if (activeThumbnail && gallery === 'visuals') {
        const state = Flip.getState(activeThumbnail);
        lightboxImg.style.display = 'block';
        lightboxImg.classList.remove('hidden');
        Flip.from(state, {
            targets: lightboxImg,
            duration: 0.6,
            ease: "power3.inOut",
            scale: true,
            onComplete: () => { lightboxImg.style.transform = ''; }
        });
    }
}

// Event delegation for all gallery triggers
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const timelineItem = e.target.closest('.tm-content[data-gallery-key]');
        const visualItem = e.target.closest('.scroll-item[data-gallery-index]');
        const videoItem = e.target.closest('.video-card[data-gallery-index]');

        if (timelineItem) {
            openGallery(timelineItem.dataset.galleryKey);
        } else if (visualItem) {
            openGallery('visuals', parseInt(visualItem.dataset.galleryIndex, 10), visualItem);
        } else if (videoItem) {
            openGallery('videos', parseInt(videoItem.dataset.galleryIndex, 10));
        }
    });
});

function updateLightbox(animate = true) {
    if (currentGallery.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        caption.innerText = `${currentIndex + 1} / ${currentGallery.length}`;
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        caption.innerText = '';
    }

    if (animate && !activeThumbnail) {
        lightboxImg.classList.add('fade-out');
        lightboxVid.classList.add('fade-out');
        lightboxYT.classList.add('fade-out');
    }

    const currentItem = currentGallery[currentIndex];
    let itemType = 'image';
    if (typeof currentItem === 'string') {
        if (currentItem.includes('.mp4')) itemType = 'video_local';
        else if (!currentItem.includes('/') && !currentItem.includes('.')) itemType = 'video_yt';
    }

    setTimeout(() => {
        lightboxImg.classList.add('hidden');
        lightboxVid.classList.add('hidden');
        lightboxYT.classList.add('hidden');
        lightboxVid.pause();
        ytPlayer.src = "";

        if (itemType === 'video_yt') {
            lightboxYT.classList.remove('hidden');
            ytPlayer.src = `https://www.youtube.com/embed/${currentItem}?autoplay=1`;
        } else if (itemType === 'video_local') {
            lightboxVid.classList.remove('hidden');
            lightboxVid.src = currentItem;
            lightboxVid.play();
        } else {
            lightboxImg.classList.remove('hidden');
            lightboxImg.src = currentItem;
        }

        if (animate) {
            requestAnimationFrame(() => {
                lightboxImg.classList.remove('fade-out');
                lightboxVid.classList.remove('fade-out');
                lightboxYT.classList.remove('fade-out');
            });
        }
    }, animate ? 300 : 0);
}

function showNext() {
    currentIndex = (currentIndex < currentGallery.length - 1) ? currentIndex + 1 : 0;
    activeThumbnail = null;
    updateLightbox(true);
}
function showPrev() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGallery.length - 1;
    activeThumbnail = null;
    updateLightbox(true);
}

prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxVid.pause();
    ytPlayer.src = "";
    activeThumbnail = null;
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// --- MODAL TRIGGERS ---
const funnelModal = document.getElementById('funnel-modal');
const funnelClose = document.querySelector('.funnel-close');
const initiateBtn = document.getElementById('initiate-btn');

initiateBtn.addEventListener('click', () => { funnelModal.classList.remove('hidden'); });
funnelClose.addEventListener('click', () => { funnelModal.classList.add('hidden'); });
funnelModal.addEventListener('click', (e) => { if (e.target === funnelModal) funnelModal.classList.add('hidden'); });

// --- SCROLL DRAG ---
const slider = document.querySelector('.gallery-scroll-container');
let isDown = false;
let startX;
let scrollLeft;

if(slider) {
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
    slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
    });
}

// Start (init3D will be triggered by Promise.all)
// init3D(); // Remove direct call here