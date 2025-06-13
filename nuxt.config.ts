// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui'],
  ui: {
    fonts: false
  },
  app: {
    baseURL: "/generate/",
    head: {
      title: 'IIFE Generate',
      meta: [
        { name: 'description', content: 'Generate is a tool that converts ES modules into Immediately Invoked Function Expression (IIFE).' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.svg' }
      ]
    },
  }
})
