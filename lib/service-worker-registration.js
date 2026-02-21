export async function registerServiceWorker(swPath = '/sw.js') {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    try {
        return await navigator.serviceWorker.register(swPath, { scope: '/' });
    } catch (error) {
        console.warn('Service Worker registration failed:', error);
        return null;
    }
}
