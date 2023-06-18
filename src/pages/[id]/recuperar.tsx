import axios from 'axios'
import Image from 'next/image'
import $rules from '@/assets/$rules'
import type { Drive } from 'drivelist'
import { useUtils } from '@/assets/utils'
import { NextPageWithLayout } from '../_app'
import { FC, useEffect, useState } from 'react'
import FolderInput from '@/components/FolderInput'
import ProyectoLayout from '@/components/layouts/Proyecto'
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Modal,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd'

const ModalAyuda: FC = () => {
  const [abrirAyuda, setAbrirAyuda] = useState(false)

  return (
    <>
      <Tooltip title="Mostrar ayuda">
        <QuestionCircleOutlined onClick={() => setAbrirAyuda(true)} />
      </Tooltip>

      <Modal
        width={700}
        open={abrirAyuda}
        title="Recuperar archivos"
        onCancel={() => setAbrirAyuda(false)}
        footer={null}
      >
        <Typography.Paragraph>
          En esta vista se le ayudará con el proceso de recuperación de la
          información. Para esto usted debe seleccionar el carver que desea
          utilizar, el dispositivo de almacenamiento y la carpeta de salida.
          Recuerde que si llena el formulario con el estado de su dispositivo de
          almacenamiento, <b>Carver Suite</b> le da una sugerencia del carver
          que debe utilizar para una recuperación de datos mas eficiente. Cuando
          el carver empiece a ejecutarse generará un PID y al finalizar un
          estado de finalización.
        </Typography.Paragraph>

        <div className="grid grid-cols-2 gap-5 mb-3">
          <div>
            <Typography.Paragraph strong>PID</Typography.Paragraph>
            <Tag>pid: 5658</Tag>
            <div>
              Es el número identificador del proceso, sirve para detener el
              proceso en caso de que el usuario así lo requiera.
            </div>
          </div>
          <div>
            <Typography.Paragraph strong>Estado final</Typography.Paragraph>
            <Tag>status final: 0</Tag>
            <Tag>status final: 255</Tag>
            <div>
              Si el estado es <code>0</code> entonces finalizó correctamente,
              caso contrario quiere decir que ocurrió algún problema.
            </div>
          </div>
        </div>
        <Typography.Paragraph strong>Consideraciones</Typography.Paragraph>
        <Typography.Paragraph>
          Tanto Scalpel como Foremost generan <i>logs</i> que ayudan al usuario
          a saber como está el proceso de recuperación de la información. Sin
          embargo en algunas ocasiones estos <i>logs</i> se tornan en caracteres
          extraños como se muestra en la figura de abajo. Cuando esto sucede no
          quiere decir que haya ocurrido un error en el proceso, usted puede
          seguir esperando con tranquilidad que concluya.
        </Typography.Paragraph>
        <div className="text-center">
          <Image
            src="/bad-logs.png"
            alt="url"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </Modal>
    </>
  )
}

const Recuperar: NextPageWithLayout = () => {
  const { showError } = useUtils()

  const [drivers, setDrivers] = useState<Drive[]>([])
  const [carvers, setCarvers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deshabilitarCancel, setDeshabilitarCancel] = useState(false)
  const [conProblemas, setConProblemas] = useState(false)

  const init = async () => {
    try {
      const { data: dataDrivers } = await axios.get<Drive[]>('/api/drivers')
      setDrivers(dataDrivers.filter((item) => item.description))
      const { data: dataCarvers } = await axios.get('/api/carvers')
      setCarvers(dataCarvers)
    } catch (err) {
      showError(err)
    }
  }

  const onSubmit = async (data: {
    carver: string
    drive: string
    outputdir: string
  }) => {
    console.log(data)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div>
      <div className="flex items-center mb-5 gap-4">
        <Typography.Title className="!mb-0">
          Recuperar archivos
        </Typography.Title>
        <ModalAyuda />
      </div>

      <Form
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Seleccionar carver"
          rules={[$rules.required()]}
          name="carver"
        >
          <Select
            placeholder="Ingrese el título del proyecto"
            options={carvers.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Seleccionar dispositivo"
          rules={[$rules.required()]}
          name="drive"
        >
          <Select
            placeholder="Seleccionar el dispositivo"
            options={drivers.map((item) => ({
              value: item.device,
              label: item.device + ' - ' + item.description,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Carpeta de salida"
          rules={[$rules.required()]}
          name="outputdir"
        >
          <FolderInput />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space>
            {/* {!conProblemas && (
              <Link href="clasificar">
                <Button>Clasificar archivos</Button>
              </Link>
            )} */}
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Recuperar datos
            </Button>
            {isLoading && (
              <Button danger disabled={deshabilitarCancel}>
                Cancelar recuperación de datos
              </Button>
            )}
            <Tooltip title="Volver a cargar carvers y dispositivos">
              <Button icon={<ReloadOutlined />} onClick={init} />
            </Tooltip>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

Recuperar.getLayout = ProyectoLayout

export default Recuperar
