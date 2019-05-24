const { app: appe, BrowserWindow } = require('electron')

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const config = require('../nuxt.config.js')
const routes = require('./routes')
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production')

io.on('connection', function (socket){
  socket.on('chat', function(msg){
    console.log('message: ' + msg)
  })
})

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use(bodyParser.json())
  app.use('/api', routes)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  http.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  const _NUXT_URL_ = `http://${host}:${port}`
  console.log(`Nuxt working on ${_NUXT_URL_}`)

  /*
  ** Electron
  */
  function createWindow () {
    console.log('llego aca el mierda')
    // Create the browser window.
    const win = new BrowserWindow({})
    win.maximize()
    // and load the index.html of the app.
    win.loadURL(_NUXT_URL_)
    // win.loadFile('index.html')
  }
  appe.on('ready', createWindow)

  // let win = null
  // const electron = require('electron')
  // const path = require('path')
  // const appelectron = electron.app
  // const newWin = () => {
  //   win = new electron.BrowserWindow({
  //     icon: path.join(__dirname, 'static/icon.png')
  //   })
  //   win.maximize()
  //   win.on('closed', () => win = null)
  //   win.loadURL(_NUXT_URL_)
  // }
  // appelectron.on('ready', newWin)
  // appelectron.on('window-all-closed', () => appelectron.quit())
  // appelectron.on('activate', () => win === null && newWin())
}

start()
