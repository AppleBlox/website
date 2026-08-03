import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

function injectAnalytics(env: Record<string, string>): Plugin {
  const tags: HtmlTagDescriptor[] = []

  if (env.VITE_UMAMI_WEBSITE_ID) {
    tags.push({
      tag: 'script',
      attrs: {
        defer: true,
        src: 'https://cloud.umami.is/script.js',
        'data-website-id': env.VITE_UMAMI_WEBSITE_ID,
      },
      injectTo: 'head',
    })
  }

  if (env.VITE_ADSENSE_CLIENT_ID) {
    tags.push({
      tag: 'script',
      attrs: {
        async: true,
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.VITE_ADSENSE_CLIENT_ID}`,
        crossorigin: 'anonymous',
      },
      injectTo: 'head',
    })
  }

  return {
    name: 'inject-analytics',
    transformIndexHtml: () => tags,
    generateBundle() {
      if (!env.VITE_ADSENSE_CLIENT_ID) return

      const publisherId = env.VITE_ADSENSE_CLIENT_ID.replace(/^ca-/, '')

      this.emitFile({
        type: 'asset',
        fileName: 'ads.txt',
        source: `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [svelte(), injectAnalytics(loadEnv(mode, '.', 'VITE_'))],
}))
