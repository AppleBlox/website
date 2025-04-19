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
export const deviceType = derived(windowWidth, ($width) => {
  if ($width < 640) return 'mobile';
  if ($width < 1024) return 'tablet';
  return 'desktop';
});

// Detect if device is actually a mobile device (not just small viewport)
export function isTouchDevice() {
  if (!isBrowser) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Store for whether the device is an actual mobile device
export const isActualMobileDevice = writable(isBrowser ? isTouchDevice() : false);

// Check if device is Apple Silicon Mac
export function isAppleSilicon() {
  let result = false;
  try {
    const canvas = document.createElement('canvas');
    console.log('Canvas element created.');

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.log('WebGL not supported.');
    } else {
      console.log('WebGL context initialized.');

      // @ts-expect-error: Exists
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) {
        console.log('WEBGL_debug_renderer_info extension not supported.');
      } else {
        console.log('WEBGL_debug_renderer_info extension available.');
        // @ts-expect-error: Exists
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log('Renderer string: ' + renderer);

        result = /Apple M/i.test(renderer);
        console.log('Apple M GPU detected: ' + result);

        if (result) {
          console.log("WebGL says it is an Apple Silicon");
        }
      }
    }
  } catch (e) {
    console.log('Error during WebGL detection: ' + e);
  }

  if (!result) {
    const userAgent = navigator.userAgent;
    result = /Mac/.test(userAgent) && /arm64|aarch64/i.test(userAgent);
    console.log('Falling back to userAgent check: ' + result);
  }
  return result;
}

// Check if device is macOS
export function isMacOS() {
  if (!isBrowser) return false;

  // Use userAgentData if available (modern browsers)
  // @ts-expect-error: Exists
  if (navigator.userAgentData) {
    // @ts-expect-error: Exists
    return navigator.userAgentData.getHighEntropyValues(['platform']).then((data) => {
      return data.platform === 'macOS';
    });
  }

  // Fallback for older browsers
  const userAgent = navigator.userAgent.toLowerCase();
  return /macintosh|macintel|macppc|mac68k/.test(userAgent);
}