const pdf = require('pdf-parse')
const ffmpeg = require('ffmpeg')
const unoconv = require('awesome-unoconv')
const fs = require('fs')
const path = require('path')
const Promise = require("bluebird")
const recursive = require('recursive-readdir')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const im = require('imagemagick')

Promise.config({
  cancellation: true
})

function sorter (args) {
  const { emitter, inputdir, outputdir } = args
  return new Promise((resolve, reject, onCancel) => {
    recursive(inputdir, (err, files) => {
      if (err) return reject(err)
      let i = 0
      let cancelled = false
      const length = files.length
      const statistics = { good: 0, bad: 0, unknown: 0 }
      onCancel(() => cancelled = true)
      Promise.map(files, file => {
        if (cancelled) throw new Error('Se detuvo')
        const buffer = readChunk.sync(file, 0, fileType.minimumBytes)
        const type = fileType(buffer)
        emitter.emit('chunck', i++ / length)
        return check_file(file, type, outputdir, statistics)
      }, { concurrency: 1 }).then(() => resolve(statistics)).catch(reject)
    })
  })
}

function check_file (file, type, outputdir, statistics) {
  return new Promise((resolve, reject) => {
    const ext = type ? type.ext : 'text'
    const good = () => {
      statistics.good++
      move('positivos')
    }
    const bad = () => {
      statistics.bad++
      move('falsos-positivos')
    }
    const move = folder => {
      const _tmp1 = path.join(outputdir, ext)
      const _tmp2 = path.join(outputdir, ext, folder)
      if (!fs.existsSync(outputdir)) fs.mkdirSync(outputdir)
      if (!fs.existsSync(_tmp1)) fs.mkdirSync(_tmp1)
      if (!fs.existsSync(_tmp2)) fs.mkdirSync(_tmp2)
      const basename = path.basename(file)
      const newfile = path.join(outputdir, ext, folder, basename)
      fs.renameSync(file, newfile)
      resolve()
    }
    const databuffer = fs.readFileSync(file)

    switch (ext) {
    case 'doc':
    case 'docx':
    case 'odt':
    case 'odt':
    case 'xls':
    case 'xlsx':
    case 'ods':
    case 'ppt':
    case 'pptx':
    case 'odp':
      unoconv
        .convert(file, { buffer: true, format: 'html' })
        .then(good)
        .catch(bad)
      break
    case 'pdf':
      pdf(databuffer).then(good).catch(bad)
      break
    case 'jpg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'jpeg':
      im.identify(file, (err, data) => {
        if (err) return bad()
        good()
      })
      break
    case 'mp3':
    case 'm4a':
    case 'acc':
    case 'wma':
    case 'avi':
    case 'wmv':
    case '3gp':
    case 'ogg':
    case 'mp4':
    case 'mov':
    case 'webm':
      (new ffmpeg(file)).then(good, bad)
      break
    default:
      // console.log(file, ext)
      statistics.unknown++
      resolve()
      break
    }
  })
}

module.exports = sorter
