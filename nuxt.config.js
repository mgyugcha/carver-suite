const getPortSync = require('get-port-sync')
const port = getPortSync()

module.exports = {
  mode: 'spa',
  head: { title: 'carvers-suite' }, // Headers of the page
  loading: false, // Disable default loading bar
  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        // Run ESLint on save
        config.module.rules.push({
	  enforce: 'pre',
	  test: /\.(js|vue)$/,
	  loader: 'eslint-loader',
	  exclude: /(node_modules)/
        })
      }
      // Extend only webpack config for client-bundle
      if (isClient) { config.target = 'electron-renderer' }
    }
  },
  dev: process.env.NODE_ENV === 'DEV',
  port,
  css: [
    '@/assets/css/global.css'
  ],
  plugins: [
    '~/plugins/socket.io.js',
    '~/plugins/app.js',
  ],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    ['nuxt-buefy', {
      defaultNoticeQueue: false,
      defaultDayNames: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      defaultMonthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
    }],
  ],
  axios: { proxy: true },
  proxy: {
    '/api/': `http://localhost:${port}`,
  },
}
