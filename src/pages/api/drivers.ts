import { list } from 'drivelist'
import type { NextApiResponse } from 'next'

export default async function handler(_: never, res: NextApiResponse) {
  const drivers = await list()
  res.status(200).send(drivers)
}
