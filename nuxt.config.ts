// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxt/ui', 'nuxt-monaco-editor'],
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    githubClientId: '',
    githubClientSecret: '',
    googleGeminiApiKey: '',
    dbFileName: 'file:local.db'
  },
  app: {
    head: {
      bodyAttrs: {
        class: 'h-full flex flex-col min-h-screen [&>*:is(.isolate)]:grow [&>*:is(.isolate)]:flex [&>*:is(.isolate)]:flex-col'
      }
    }
  },
  ui: {
    colorMode: false
  },
  devServer: {
    port: 3029
  },
  nitro: {
    preset: 'node-cluster',
    rollupConfig: {
      plugins: [vue()]
    },
  },
  build: {
    transpile: ['monaco-editor']
  },
  vite: {
    build: {
      sourcemap: false,
    },
    optimizeDeps: {
      include: ['monaco-editor']
    }
  },
  routeRules: {
    '/': { ssr: false }
  }
})