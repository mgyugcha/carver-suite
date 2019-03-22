/*
**  Nuxt
*/
const http = require('http')
const commandExists = require('command-exists').sync
const express = require('express')
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const routes = require('./server/routes.js')
const config = require('./nuxt.config.js')
config.rootDir = __dirname // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)
// Build only in dev mode
if (config.dev) {
  builder.build().catch(err => {
    console.error(err) // eslint-disable-line no-console
    process.exit(1)
  })
}
// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

const appServer = express()
appServer.use(bodyParser.json())
appServer.use('/api', routes)
appServer.listen(config.port, () => {
  console.log('api corriendo por el puerto', config.port)
})

/*
** Electron
*/
let win = null // Current window
const electron = require('electron')
const { dialog } = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
  let dependencias = ''
  if (!commandExists('scalpel') || !commandExists('foremost')) {
    dependencias += `* Son necesarios los carvers scalpel y foremost\n`
  }
  if (!commandExists('ffmpeg')) {
    dependencias += `* Es necesario ffmpeg para clasificar audio y video\n`
  }
  if (!commandExists('unoconv')) {
    dependencias += `* Es necesario unoconv para clasificar los archivos de Office\n`
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
  win = new electron.BrowserWindow({
    icon: path.join(__dirname, 'static/icon.png')
  })
  win.maximize()
  win.on('closed', () => win = null)
  if (config.dev) {
    // Install vue dev tool and open chrome dev tools
    const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id).then(name => {
      console.log(`Added Extension:  ${name}`)
      win.webContents.openDevTools()
    }).catch(err => console.log('An error occurred: ', err))
    // Wait for nuxt to build
    const pollServer = () => {
      http.get(_NUXT_URL_, res => {
        if (res.statusCode === 200) { win.loadURL(_NUXT_URL_) } else { setTimeout(pollServer, 300) }
      }).on('error', pollServer)
    }
    pollServer()
  } else { return win.loadURL(_NUXT_URL_) }
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
