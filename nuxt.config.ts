// https://nuxt.com/docs/api/configuration/nuxt-config
import Icons from 'unplugin-icons/vite'
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#171717' } // Replace with your desired color
      ]
    }
  },
  ssr: false,
  devtools: { enabled: true },
  css: ['/globals.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    plugins: [
      Icons({
        // the feature below is experimental ⬇️
        autoInstall: true
      })
    ]
  },


  compatibilityDate: '2024-08-02',
})