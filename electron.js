// const { app, BrowserWindow } = require('electron')

// const createWindow = () => {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//   });

//   win.loadFile("index.html");
// };

// app.whenReady().then(() => {
//   createWindow();
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });

// cargamos los módulos de electron que vamos a usar
const { app, BrowserWindow, ipcMain } = require('electron')

// cargamos la función para crear un servidor HTTP
const { createServer } = require('http')
// cargamos Next.js
const next = require('next')

// verificamos si estamos en modo desarrollo
const dev = process.env.NODE_ENV !== 'production'

// crearmos nuestra app de Next.js
const nextApp = next({ dev })
// obtenermos la función para manejar peticiones a Next.js
const handler = nextApp.getRequestHandler()

// en esta variable vamos a guardar la instancia de nuestra UI
let win

function createWindow() {
  // iniciamos la app de Next.js
  nextApp.prepare().then(() => {
    // una vez lista creamos un servidor HTTP que use nuestro
    // handler para ruteas todas las peticiones HTTP
    // que reciba Next.js
    const server = createServer((req, res) => {
      // si recibimos una petición por fuera de Electron
      // respondemos con un 404
      // if (req.headers['user-agent'].indexOf('Electron') === -1) {
      //   res.writeHead(404)
      //   res.end()
      //   return
      // }

      res.setHeader('Access-Control-Request-Method', 'GET')

      // solo permitimos peticiones GET
      // if (req.method !== "GET") {
      //   res.writeHead(405);
      //   res.end("Method Not Allowed");
      //   return;
      // }

      // dejamos que Next maneje las peticiones
      return handler(req, res)
    })

    // empezamos a escuchar el puerto 3000 con el servidor HTTP
    server.listen(3000, (error) => {
      if (error) throw error

      // una vez iniciamos el servidor creamos una nueva ventana
      win = new BrowserWindow({
        height: 768,
        width: 1024,
      })

      // y abrimos la URL local del servidor HTTP que creamos
      win.loadURL('http://localhost:3000')

      win.on('close', () => {
        // cuando el usuario cierra la ventana borramo `win`
        // y paramos el servidor HTTP
        win = null
        server.close()
      })
    })
  })
}

// una vez la app esté lista iniciamos una ventana nueva
app.on('ready', createWindow)

// si todas las ventanas se cerraros matamos la aplicación
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
