declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export type Arch = 'arm64' | 'x64' | 'universal';

function track(event: string, data?: Record<string, unknown>) {
  try {
    window.umami?.track(event, data);
  } catch {}
}

export function trackDownload(arch: Arch, version: string) {
  track('download', { arch, version });
}
