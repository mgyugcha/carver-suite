import axios from 'axios'
import { FC } from 'react'
import { Space, Typography } from 'antd'

const FolderInput: FC<{
  value?: string
  onChange?: (value: string) => void
}> = (props) => {
  const buscarDirectorio = async () => {
    const { data } = await axios.get<string>('/api/carpeta')
    console.log(data)
    props.onChange?.(data)
  }

  return (
    <Space>
      <Typography.Link onClick={buscarDirectorio}>
        Buscar carpeta
      </Typography.Link>
      {props.value || 'Carpeta no seleccionada'}
    </Space>
  )
}

export default FolderInput
