import { writable, derived } from 'svelte/store';

// Check if code is running in browser
const isBrowser = typeof window !== 'undefined';

// Device state store
export const windowWidth = writable(isBrowser ? window.innerWidth : 1920);
export const windowHeight = writable(isBrowser ? window.innerHeight : 1080);

// Update window dimensions on resize
if (isBrowser) {
  window.addEventListener('resize', () => {
    windowWidth.set(window.innerWidth);
    windowHeight.set(window.innerHeight);
  });
}

// Derived store for device type
export const deviceType = derived(
  windowWidth,
  ($width) => {
    if ($width < 640) return 'mobile';
    if ($width < 1024) return 'tablet';
    return 'desktop';
  }
);

// Detect if device is actually a mobile device (not just small viewport)
export function isTouchDevice() {
  if (!isBrowser) return false;
  return ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0)
}

// Check if device is an actual mobile device
export const isActualMobileDevice = writable(isBrowser ? isTouchDevice() : false);

// Check if device is Apple Silicon Mac
export function isAppleSilicon() {
  if (!isBrowser) return false;
  const userAgent = navigator.userAgent;
  const isMac = /Mac/.test(userAgent);
  return isMac && /arm64|aarch64/i.test(userAgent);
}

// Check if device is macOS
export function isMacOS() {
  if (!isBrowser) return false;
  return /Mac/.test(navigator.userAgent);
}