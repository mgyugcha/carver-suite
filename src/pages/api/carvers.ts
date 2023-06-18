import commandExists from 'command-exists'
import type { NextApiResponse } from 'next'

export default async function handler(_: never, res: NextApiResponse) {
  const carvers: string[] = []
  commandExists('scalpel', (err, success1) => {
    if (success1) carvers.push('scalpel')
    commandExists('foremost', (err, success2) => {
      if (success2) carvers.push('foremost')
      res.json(carvers)
    })
  })
}
