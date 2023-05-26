import { Project } from '@/types/Projects'
import { getDatabase } from '@/assets/database'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase()
  if (req.method === 'POST') {
    const sql = 'INSERT INTO recover(titulo) VALUES(?)'
    await new Promise<void>((resolve, reject) => {
      const { titulo } = req.body
      db.run(sql, [titulo], function (error) {
        if (error) return reject(error)
        res.status(200).json({ id: this.lastID })
        resolve()
      })
    })
  } else if (req.method === 'GET') {
    if (req.query.id) {
      const sql = 'SELECT * FROM recover WHERE id=?'
      await new Promise((resolve, reject) => {
        db.get(sql, [req.query.id], (error, row) => {
          if (error) return reject(error)
          if (!row) {
            res.status(404).send('No se encontró ese proyecto')
          } else {
            res.json(row)
          }
        })
      })
    } else {
      const sql = 'SELECT id, titulo FROM recover'
      await new Promise<void>((resolve, reject) => {
        db.all<Project>(sql, (error, rows) => {
          if (error) return reject(error)
          res.status(200).json(rows || [])
          resolve()
        })
      })
    }
  } else if (req.method === 'DELETE') {
    const sql = 'DELETE FROM recover WHERE id=?'
    await new Promise<void>((resolve, reject) => {
      db.run(sql, [req.query.id], (error) => {
        if (error) return reject(error)
        res.send('success')
        resolve()
      })
    })
  } else if (req.method === 'PUT') {
    const sql = `\
UPDATE recover SET
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
      req.query.id,
    ]
    await new Promise<void>((resolve, reject) => {
      db.run(sql, data, (error) => {
        if (error) return reject(error)
        res.send('success')
        resolve()
      })
    })
  } else {
    res.status(200).json({ name: 'John Doe' })
  }
}
