module.exports = {
  mode: 'spa',
  head: {title: 'carvers-suite'}, // Headers of the page
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
  css: [
    '@/assets/css/global.css'
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
    '/api/': 'http://localhost:4333',
    // '/api/': {
    //   target: `http://localhost:4333`,
    //   pathRewrite: { '^/api/': '' }
    // },
  },
}
