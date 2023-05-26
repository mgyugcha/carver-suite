import axios from 'axios'
import dayjs from 'dayjs'
import Link from 'next/link'
import $rules from '@/assets/$rules'
import { useRouter } from 'next/router'
import { useUtils } from '@/assets/utils'
import { Project } from '@/types/Projects'
import { useEffect, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import ProyectoLayout from '@/components/layouts/Proyecto'
import { Button, DatePicker, Form, Input, Space, Typography, App } from 'antd'

const endpoint = '/api/projects'

const ProyectoPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { showError } = useUtils()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [isLoading, setIsLoading] = useState(false)

  const init = async () => {
    try {
      const { data: project } = await axios.get(endpoint, {
        params: { id: router.query.id },
      })
      if (project.fechaDeIngreso)
        project.fechaDeIngreso = dayjs(project.fechaDeIngreso)
      if (project.horaDeIngreso)
        project.horaDeIngreso = dayjs(project.horaDeIngreso)
      if (project.fechaDeEntrega)
        project.fechaDeEntrega = dayjs(project.fechaDeEntrega)
      if (project.horaDeEntrega)
        project.horaDeEntrega = dayjs(project.horaDeEntrega)
      form.setFieldsValue(project)
    } catch (err) {
      showError(err)
    }
  }

  const onSubmit = async (data: Project) => {
    setIsLoading(true)
    if (isLoading) return
    try {
      await axios.put(endpoint, data, {
        params: { id: router.query.id },
      })
      message.success('Guardado correctamente')
    } catch (err) {
      showError(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <Typography.Title>Proyecto #{router.query.id}</Typography.Title>
      <Typography.Paragraph type="secondary">
        Ingrese el título del proyecto, los datos de ingreso y cuando el proceso
        de clasificación de datos haya terminado puede llenar los datos de
        entrega. Esta información servirá para generar un <b>informe</b> al
        final del proceso.
      </Typography.Paragraph>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 6 }}
        onFinish={onSubmit}
      >
        <Form.Item label="Título" rules={[$rules.required()]} name="titulo">
          <Input placeholder="Ingrese el título del proyecto" />
        </Form.Item>

        <Typography.Title level={4}>Datos de ingreso</Typography.Title>

        <Form.Item label="Nombre del propietario" name="propietario">
          <Input placeholder="Ingrese el nombre del propietario" />
        </Form.Item>

        <Form.Item label="Fecha y hora de ingreso" name="fechaDeIngreso">
          <DatePicker showTime />
        </Form.Item>

        <Form.Item label="Diagnóstico express" name="diagnosticoExpress">
          <Input.TextArea
            rows={4}
            placeholder="Describa una breve reseña del estado de ingreso del dispositivo"
          />
        </Form.Item>

        <Form.Item
          label="Requerimiento del usuario"
          name="requerimientosDelUsuario"
        >
          <Input.TextArea
            rows={4}
            placeholder="Describa en una o mas lineas cuales son los requerimientos del usuario"
          />
        </Form.Item>

        <Typography.Title level={4}>Datos de entrega</Typography.Title>

        <Form.Item label="Nombre del especialista" name="especialista">
          <Input placeholder="Especialista que atendió el requerimiento" />
        </Form.Item>

        <Form.Item label="Fecha y hora de entrega" name="fechaDeEntrega">
          <DatePicker showTime />
        </Form.Item>

        <Form.Item label="Novedades finales" name="novedadesFinales">
          <Input.TextArea
            rows={4}
            placeholder="Ingrese las novedades finales"
          />
        </Form.Item>

        <Form.Item label="Observaciones finales" name="observacionesFinales">
          <Input.TextArea
            rows={4}
            placeholder="Ingrese las observaciones finales"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 8 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Guardar
            </Button>
            <Link href="/">
              <Button>Regresar</Button>
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

ProyectoPage.getLayout = ProyectoLayout

export default ProyectoPage
