const path = require('path')
const Events = require('events')
const moment = require('moment')
const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')
const sorter = require('./sorter')
const spawn = require('child_process').spawn
const express = require('express')
const router = express.Router()
const drivelist = require('drivelist')
const sqlite3 = require('sqlite3').verbose()
const commandExists = require('command-exists')
const fs = require('fs')
const { app } = require('electron')
const dbPath = process.env.NODE_ENV === 'DEV'
  ? ':memory:' : path.resolve(app.getPath('userData'), 'database.db')
const db = new sqlite3.Database(dbPath)
const templatedir = path.resolve(__dirname, 'informe-plantilla.docx')
const sqldatabase = fs.readFileSync(__dirname + '/database.sql', 'utf-8')
db.run(sqldatabase)

router.route('/projects')
  .get((req, res, next) => {
    const sql = 'SELECT id, titulo FROM recover'
    db.all(sql, (error, rows) => {
      if (error) return next(error)
      res.json(rows)
    })
  })
  .post((req, res, next) => {
    const sql = 'INSERT INTO recover(titulo) VALUES(?)'
    const { titulo } = req.body
    db.run(sql, [titulo], function (error) {
      if (error) return next(error)
      res.json({ id: this.lastID })
    })
  })

router.route('/projects/:id')
  .get((req, res, next) => {
    const sql = 'SELECT * FROM recover WHERE id=?'
    db.get(sql, [req.params.id], (error, row) => {
      if (error) return next(error)
      if (!row) {
        res.status(404).send('No se encontró ese proyecto')
      } else {
        res.json(row)
      }
    })
  })
  .put((req, res, next) => {
    const sql = `UPDATE recover SET
titulo=?,
propietario=?,
fechaDeIngreso=?,
horaDeIngreso=?,
diagnosticoExpress=?,
requerimientosDelUsuario=?,
especialista=?,
fechaDeEntrega=?,
horaDeEntrega=?,
novedadesFinales=?,
observacionesFinales=?
WHERE id=?`
    const data = [
      req.body.titulo,
      req.body.propietario,
      req.body.fechaDeIngreso,
      req.body.horaDeIngreso,
      req.body.diagnosticoExpress,
      req.body.requerimientosDelUsuario,
      req.body.especialista,
      req.body.fechaDeEntrega,
      req.body.horaDeEntrega,
      req.body.novedadesFinales,
      req.body.observacionesFinales,
      req.params.id
    ]
    db.run(sql, data, error => {
      if (error) return next(error)
      res.send('success')
    })
  })
  .delete((req, res, next) => {
    const sql = 'DELETE FROM recover WHERE id=?'
    db.run(sql, [req.params.id], error => {
      if (error) return next(error)
      res.send('success')
    })
  })

router.route('/projects/:id/recover')
  .get((req, res, next) => {
    const sql = 'SELECT stdout, code FROM recover WHERE id=?'
    db.get(sql, [req.params.id], (error, row) => {
      if (error) return next(error)
      res.json(row)
    })
  })
  .post((req, res, next) => {
    const { id } = req.params
    const sql = `UPDATE recover
 SET carver=?, outputFolderRecover=?, pid=NULL, code=NULL
 WHERE id=?`
    db.run(sql, [req.body.carver, req.body.outputdir, id], error => {
      if (error) return next(error)
      let args
      if (req.body.carver === 'scalpel') {
        args = [req.body.drive, '-o', req.body.outputdir]
      } else {
        args = ['-t', 'all', '-i', req.body.drive, '-o', req.body.outputdir]
      }
      let output = ''
      const child = spawn(req.body.carver, args)

      child.on('close', code => {
        db.run('UPDATE recover SET code=? WHERE id=?', [code, id])
      })

      child.stdout.on('data', data => {
        output += data.toString()
        output = output.replace(/(.*)\r/gm, '')
        db.run('UPDATE recover SET stdout=? WHERE id=?', [output, id])
      })

      child.stderr.on('data', data => {
        output += data.toString()
        output = output.replace(/(.*)\r/gm, '')
        db.run('UPDATE recover SET stdout=? WHERE id=?', [output, id])
      })

      db.run('UPDATE recover SET pid=? WHERE id=?', [child.pid, id])
      res.json({ pid: child.pid })
    })
  })
  .delete((req, res, next) => {
    const sql = 'SELECT code, pid FROM recover WHERE id=?'
    db.get(sql, [req.params.id], (error, row) => {
      if (error) return next(error)
      try {
        if (row.code === null) process.kill(row.pid)
        const sql2 = 'UPDATE recover SET pid=NULL, code=NULL WHERE id=?'
        db.run(sql2, [req.params.id], error => {
          if (error) return next(error)
          res.send('success')
        })
      } catch (err) {
        next(err)
      }
    })
  })

let globalpromise

router.route('/projects/:id/sorter')
  .get((req, res, next) => {
    const sql = 'SELECT percent, statistics FROM recover WHERE id=?'
    db.get(sql, [req.params.id], (error, row) => {
      if (error) return next(error)
      res.json(row)
    })
  })
  .post((req, res, next) => {
    res.send('@mgyugcha')
    const { id } = req.params
    const emitter = new Events()
    const { inputdir, outputdir } = req.body
    db.run(
      'UPDATE recover SET percent=0, statistics=NULL, outputFolderSorter=? WHERE id=?',
      [outputdir, id]
    )
    emitter.on('chunck', percent => {
      db.run('UPDATE recover SET percent=? WHERE id=?', [percent, id])
    })
    globalpromise = sorter({ emitter, inputdir, outputdir })
    globalpromise.then(statistics => {
      db.run(
        'UPDATE recover SET percent=1, statistics=? WHERE id=?',
        [JSON.stringify(statistics), id]
      )
    }).catch(err => {
      db.run(
        'UPDATE recover SET statistics=NULL WHERE id=?', [id]
      )
    }).finally(() => globalpromise = undefined)
  })
  .delete((req, res, next) => {
    if (globalpromise) {
      const { id } = req.params
      db.run('UPDATE recover SET statistics=NULL WHERE id=?', [id])
      globalpromise.cancel()
      globalpromise = undefined
    }
    res.send('end')
  })

router.post('/projects/:id/informe', (req, res, next) => {
  const sql = 'SELECT * FROM recover WHERE id=?'
  db.get(sql, [req.params.id], (error, row) => {
    if (error) return next(error)
    const content = fs.readFileSync(templatedir, 'binary')
    const zip = new JSZip(content)
    const doc = new Docxtemplater()
    doc.loadZip(zip)
    row.statistics = JSON.parse(row.statistics)
    row.good = row.statistics.good
    row.bad = row.statistics.bad
    row.unknown = row.statistics.unknown
    row.fechaDeIngreso = getFecha(row.fechaDeIngreso)
    row.horaDeIngreso = getHora(row.horaDeIngreso)
    row.fechaDeEntrega = getFecha(row.fechaDeEntrega)
    row.horaDeEntrega = getHora(row.horaDeEntrega)
    doc.setData(row)
    try {
      doc.render()
    } catch (error) {
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      }
      console.error(JSON.stringify({ error: e }))
      res.status(400).send('No se pudo generar el informe')
    }
    const fileinforme = path.resolve(row.outputFolderSorter, 'informe.docx')
    const buf = doc.getZip().generate({ type: 'nodebuffer' })
    fs.writeFileSync(fileinforme, buf)
    res.send(fileinforme)
  })
})

router.get('/get-drives', (req, res) => {
  drivelist.list((error, drives) => {
    if (error) throw error
    res.json(drives)
  })
})

router.get('/get-carvers', (req, res) => {
  const carvers = []
  commandExists('scalpel', (err, success1) => {
    if (success1) carvers.push('scalpel')
    commandExists('foremost', (err, success2) => {
      if (success2) carvers.push('foremost')
      res.json(carvers)
    })
  })
})

function getFecha (fecha) {
  return fecha ? moment(fecha).format('DD/MM/YYYY') : fecha
}

function getHora (fecha) {
  return fecha ? moment(fecha).format('LT') : fecha
}

module.exports = router
