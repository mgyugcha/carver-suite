import { dialog } from 'electron'
import type { NextApiResponse } from 'next'

export default async function handler(_: never, res: NextApiResponse) {
  const folder = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  })
  res.status(200).send(folder.canceled ? '' : folder.filePaths[0])
}
