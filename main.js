const electron = require('electron')
const { dialog } = require('electron')
const path = require('path')
const http = require('http')
const commandExists = require('command-exists').sync
const appServer = require('express')()
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const routes = require('./server/routes.js')
const config = require('./nuxt.config.js')
config.rootDir = __dirname
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const httpServer = require('http').Server(appServer)
const io = require('socket.io')(httpServer)

if (config.dev) {
  builder.build().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

const _NUXT_URL_ = `http://localhost:${config.port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

appServer.use(bodyParser.json())
appServer.use('/api', routes(io))
appServer.use(nuxt.render)
httpServer.listen(config.port, () => {
  console.log('api corriendo por el puerto', config.port)
  const app = electron.app
  let win = null // Current window
  const newWin = () => {
    checkDependencies()
    win = new electron.BrowserWindow({
      icon: path.join(__dirname, '/static/icons/png/64x64.png'),
      webPreferences: {
        nodeIntegration: true
      }
    })
    win.maximize()
    win.on('closed', () => win = null)
    if (config.dev) {
      const { default: installExtension, VUEJS_DEVTOOLS } =
            require('electron-devtools-installer')
      installExtension(VUEJS_DEVTOOLS.id).then(name => {
        win.webContents.openDevTools()
      }).catch(err => console.log('An error occurred: ', err))
    }
    const pollServer = () => {
      http.get(_NUXT_URL_, res => {
        if (res.statusCode === 200) win.loadURL(_NUXT_URL_)
        else setTimeout(pollServer, 300)
      }).on('error', pollServer)
    }
    pollServer()
  }
  app.on('ready', newWin)
  app.on('window-all-closed', () => app.quit())
  app.on('activate', () => win === null && newWin())
})

function checkDependencies () {
  let dependencias = ''
  if (!commandExists('scalpel') || !commandExists('foremost')) {
    dependencias += `* Son necesarios los carvers scalpel y foremost\n`
  }
  if (!commandExists('ffmpeg')) {
    dependencias += `\
* Es necesario ffmpeg para clasificar audio y video. Puede utilizar \
 'apt install ffmpeg'\n`
  }
  if (!commandExists('unoconv')) {
    dependencias += `\
* Es necesario unoconv para clasificar los archivos de Office. Puede \
 utilizar 'apt install unoconv'. También es recomendable que tenga \
 instalado libreoffice.\n`
  }
  if (!commandExists('identify')) {
    dependencias += `* Es necesario imagemagick para clasificar imágenes\n`
  }
  if (dependencias !== '') {
    dependencias = 'Instale todas las dependencias para poder correr la aplicación:\n\n' + dependencias
    dialog.showMessageBox({
      type: 'error',
      buttons: ['Entiendo'],
      detail: dependencias,
      message: 'Problemas con las dependencias',
    })
    console.error(dependencias)
    process.exit(1)
  }
}
