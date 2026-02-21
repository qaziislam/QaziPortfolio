import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.resolve(__dirname, '../index.html');

describe('Service worker registration', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'navigator', {
            configurable: true,
            value: {
                serviceWorker: {
                    register: jest.fn().mockResolvedValue({ scope: '/' })
                }
            }
        });
    });

    test('registerServiceWorker resolves with registration', async () => {
        const { registerServiceWorker } = await import('../lib/service-worker-registration.js');
        const registration = await registerServiceWorker('/sw.js');
        expect(window.navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
        expect(registration).toEqual({ scope: '/' });
    });
});

describe('Image lazy-loading coverage', () => {
    test('gallery images include loading=lazy', () => {
        const html = fs.readFileSync(indexPath, 'utf8');
        document.open();
        document.write(html);
        document.close();

        const galleryImages = document.querySelectorAll('#sec-gallery img');
        const lazyGalleryImages = document.querySelectorAll('#sec-gallery img[loading="lazy"]');

        expect(galleryImages.length).toBeGreaterThan(0);
        expect(lazyGalleryImages.length).toBe(galleryImages.length);
    });
});
