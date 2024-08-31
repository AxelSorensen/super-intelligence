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
  modules: ['nuxt-vuefire'],
  vuefire: {
    config: {
      apiKey: "AIzaSyDL1PVXP2XSULQ-KydfEnM7kY9ftaFkVFs",
      authDomain: "superintelligence-6c928.firebaseapp.com",
      projectId: "superintelligence-6c928",
      storageBucket: "superintelligence-6c928.appspot.com",
      messagingSenderId: "638161926835",
      appId: "1:638161926835:web:0868951fc3fb20a7764ec6",
      measurementId: "G-D22XZ9J862"
    },
  },
})