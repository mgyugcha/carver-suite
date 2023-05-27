import { useState } from 'react'
import Pesos from '@/assets/bayes'
import $rules from '@/assets/$rules'
import type { NextPageWithLayout } from '../_app'
import ProyectoLayout from '@/components/layouts/Proyecto'
import {
  Button,
  Checkbox,
  Form,
  Progress,
  Select,
  Space,
  Typography,
} from 'antd'

interface IForm {
  hasCaida: boolean
  altura?: 'escritorio' | 'librero' | 'piso2' | 'piso3' | 'piso4'
  hasImpacto: boolean
  aplaztamiento?: 'cLiviano' | 'cMediano' | 'cPesado'
  hasHumedad: boolean
  humedad?: 'seg10' | 'seg30' | 'seg65'
  hasVoltaje: boolean
  voltios?: 'volt6' | 'volt7' | 'volt8' | 'volt9' | 'volt12'
  hasMagnetizmo: boolean
  magnetizmo?: 'seg10m' | 'seg15m' | 'seg20m'
}

const valoresIniciales = {
  hasCaida: false,
  hasImpacto: false,
  hasHumedad: false,
  hasVoltaje: false,
  hasMagnetizmo: false,
}

const FormularioPage: NextPageWithLayout = () => {
  const [form] = Form.useForm<IForm>()
  const [valorscalpel, setValorscalpel] = useState(0)
  const [valorfores, setValorfores] = useState(0)
  const [datos, setDatos] = useState<IForm>(valoresIniciales)

  const onSubmit = (values: IForm) => {
    const seleccionado = values.altura ? Pesos[values.altura] : undefined
    const seleccionado1 = values.aplaztamiento
      ? Pesos[values.aplaztamiento]
      : undefined
    const seleccionado2 = values.humedad ? Pesos[values.humedad] : undefined
    const seleccionado3 = values.voltios ? Pesos[values.voltios] : undefined
    const seleccionado4 = values.magnetizmo
      ? Pesos[values.magnetizmo]
      : undefined
    let valorfores = 0
    let valorscalpel = 0

    if (seleccionado && seleccionado1) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado1).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado1).valorS * 100).toFixed(2)
      )
    } else if (seleccionado && seleccionado2) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado2).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado2).valorS * 100).toFixed(2)
      )
    } else if (seleccionado && seleccionado3) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado3).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado3).valorS * 100).toFixed(2)
      )
    } else if (seleccionado && seleccionado4) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado4).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado, seleccionado4).valorS * 100).toFixed(2)
      )
    } else if (seleccionado1 && seleccionado2) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado1, seleccionado2).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado1, seleccionado2).valorS * 100).toFixed(2)
      )
    } else if (seleccionado1 && seleccionado3) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado1, seleccionado3).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado1, seleccionado3).valorS * 100).toFixed(2)
      )
    } else if (seleccionado2 && seleccionado3) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado2, seleccionado3).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado2, seleccionado3).valorS * 100).toFixed(2)
      )
    } else if (seleccionado2 && seleccionado4) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado2, seleccionado4).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado2, seleccionado4).valorS * 100).toFixed(2)
      )
    } else if (seleccionado3 && seleccionado4) {
      valorfores = parseFloat(
        (Pesos.inferir2(seleccionado3, seleccionado4).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir2(seleccionado3, seleccionado4).valorS * 100).toFixed(2)
      )
    } else if (seleccionado && seleccionado1 && seleccionado2) {
      valorfores = parseFloat(
        (
          Pesos.inferir3(seleccionado, seleccionado1, seleccionado2).valorF *
          100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir3(seleccionado, seleccionado1, seleccionado2).valorS *
          100
        ).toFixed(2)
      )
    } else if (seleccionado && seleccionado1 && seleccionado3) {
      valorfores = parseFloat(
        (
          Pesos.inferir3(seleccionado, seleccionado1, seleccionado3).valorF *
          100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir3(seleccionado, seleccionado1, seleccionado3).valorS *
          100
        ).toFixed(2)
      )
    } else if (seleccionado && seleccionado1 && seleccionado4) {
      valorfores = parseFloat(
        (
          Pesos.inferir3(seleccionado, seleccionado1, seleccionado4).valorF *
          100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir3(seleccionado, seleccionado1, seleccionado4).valorS *
          100
        ).toFixed(2)
      )
    } else if (seleccionado1 && seleccionado2 && seleccionado3) {
      valorfores = parseFloat(
        (
          Pesos.inferir3(seleccionado1, seleccionado2, seleccionado3).valorF *
          100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir3(seleccionado1, seleccionado2, seleccionado3).valorS *
          100
        ).toFixed(2)
      )
    } else if (seleccionado1 && seleccionado2 && seleccionado4) {
      valorfores = parseFloat(
        (
          Pesos.inferir3(seleccionado1, seleccionado2, seleccionado4).valorF *
          100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir3(seleccionado1, seleccionado2, seleccionado4).valorS *
          100
        ).toFixed(2)
      )
    } else if (seleccionado2 && seleccionado3 && seleccionado4) {
      valorfores = parseFloat(
        (
          Pesos.inferir3(seleccionado2, seleccionado3, seleccionado4).valorF *
          100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir3(seleccionado2, seleccionado3, seleccionado4).valorS *
          100
        ).toFixed(2)
      )
    } else if (
      seleccionado &&
      seleccionado1 &&
      seleccionado2 &&
      seleccionado3
    ) {
      valorfores = parseFloat(
        (
          Pesos.inferir4(
            seleccionado,
            seleccionado1,
            seleccionado2,
            seleccionado3
          ).valorF * 100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir4(
            seleccionado,
            seleccionado1,
            seleccionado2,
            seleccionado3
          ).valorS * 100
        ).toFixed(2)
      )
    } else if (
      seleccionado &&
      seleccionado1 &&
      seleccionado2 &&
      seleccionado4
    ) {
      valorfores = parseFloat(
        (
          Pesos.inferir4(
            seleccionado,
            seleccionado1,
            seleccionado2,
            seleccionado4
          ).valorF * 100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir4(
            seleccionado,
            seleccionado1,
            seleccionado2,
            seleccionado4
          ).valorS * 100
        ).toFixed(2)
      )
    } else if (
      seleccionado1 &&
      seleccionado2 &&
      seleccionado3 &&
      seleccionado4
    ) {
      valorfores = parseFloat(
        (
          Pesos.inferir4(
            seleccionado1,
            seleccionado2,
            seleccionado3,
            seleccionado4
          ).valorF * 100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir4(
            seleccionado1,
            seleccionado2,
            seleccionado3,
            seleccionado4
          ).valorS * 100
        ).toFixed(2)
      )
    } else if (
      seleccionado &&
      seleccionado1 &&
      seleccionado2 &&
      seleccionado3 &&
      seleccionado4
    ) {
      valorfores = parseFloat(
        (
          Pesos.inferir5(
            seleccionado,
            seleccionado1,
            seleccionado2,
            seleccionado3,
            seleccionado4
          ).valorF * 100
        ).toFixed(2)
      )
      valorscalpel = parseFloat(
        (
          Pesos.inferir5(
            seleccionado,
            seleccionado1,
            seleccionado2,
            seleccionado3,
            seleccionado4
          ).valorS * 100
        ).toFixed(2)
      )
    } else if (seleccionado) {
      valorfores = parseFloat(
        (Pesos.inferir(seleccionado).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir(seleccionado).valorS * 100).toFixed(2)
      )
    } else if (seleccionado1) {
      valorfores = parseFloat(
        (Pesos.inferir(seleccionado1).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir(seleccionado1).valorS * 100).toFixed(2)
      )
    } else if (seleccionado2) {
      valorfores = parseFloat(
        (Pesos.inferir(seleccionado2).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir(seleccionado2).valorS * 100).toFixed(2)
      )
    } else if (seleccionado3) {
      valorfores = parseFloat(
        (Pesos.inferir(seleccionado3).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir(seleccionado3).valorS * 100).toFixed(2)
      )
    } else if (seleccionado4) {
      valorfores = parseFloat(
        (Pesos.inferir(seleccionado4).valorF * 100).toFixed(2)
      )
      valorscalpel = parseFloat(
        (Pesos.inferir(seleccionado4).valorS * 100).toFixed(2)
      )
    }
    setValorfores(valorfores)
    setValorscalpel(valorscalpel)
  }

  return (
    <div>
      <Typography.Title>Formulario</Typography.Title>
      <Typography.Paragraph type="secondary" className="!mb-10">
        Contestar el siguiente formulario le ayudará a identificar cuál es el{' '}
        <b>carver</b> que puede recuperar la mayor cantidad de datos de acuerdo
        al tipo de daño del dispositivo de almacenamiento.
      </Typography.Paragraph>

      <Form
        form={form}
        initialValues={valoresIniciales}
        layout="vertical"
        onValuesChange={(_, values) => setDatos(values)}
        onFinish={onSubmit}
      >
        <Form.Item name="hasCaida" valuePropName="checked">
          <Checkbox>¿Su disco ha sufrido alguna caída?</Checkbox>
        </Form.Item>
        {datos.hasCaida && (
          <Form.Item
            name="altura"
            label="¿Desde que escenario podría ser la caída?"
            rules={[$rules.required()]}
          >
            <Select
              placeholder="Seleccione el escenario"
              options={[
                { value: 'escritorio', label: 'Escritorio' },
                { value: 'librero', label: 'Librero' },
                { value: 'piso2', label: 'Segundo piso' },
                { value: 'piso3', label: 'Tercer piso' },
                { value: 'piso4', label: 'Cuarto piso' },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item name="hasImpacto" valuePropName="checked">
          <Checkbox>
            ¿Su disco ha sufrido daño por aplastamiento o impacto?
          </Checkbox>
        </Form.Item>
        {datos.hasImpacto && (
          <Form.Item
            name="aplaztamiento"
            label="La fuerza de aplazmiento es similar a un:"
            rules={[$rules.required()]}
          >
            <Select
              placeholder="Seleccione un tipo de aplaztamiento"
              options={[
                { value: 'cLiviano', label: 'Vehículo liviano' },
                { value: 'cMediano', label: 'Vehículo mediano' },
                { value: 'cPesado', label: 'Vehículo pesado' },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item name="hasHumedad" valuePropName="checked">
          <Checkbox>
            ¿Su disco ha estado en contacto con el humedecimiento o derrame de
            líquidos?
          </Checkbox>
        </Form.Item>
        {datos.hasHumedad && (
          <Form.Item
            name="humedad"
            label="¿Cuánto tiempo ha permanecido humedecido el disco?"
            rules={[$rules.required()]}
          >
            <Select
              placeholder="Seleccione el tiempo de humedecimiento"
              options={[
                { value: 'seg10', label: '10 segundos' },
                { value: 'seg30', label: '30 segundos' },
                { value: 'seg65', label: '65 segundos' },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item name="hasVoltaje" valuePropName="checked">
          <Checkbox>¿Su disco ha recibido mayor voltaje de lo normal?</Checkbox>
        </Form.Item>
        {datos.hasVoltaje && (
          <Form.Item
            name="voltios"
            label="¿Cuál es el voltaje que ha recibido?"
            rules={[$rules.required()]}
          >
            <Select
              placeholder="Seleccione el voltaje recibido"
              options={[
                { value: 'volt6', label: '6 voltios' },
                { value: 'volt7', label: '7 voltios' },
                { value: 'volt8', label: '8 voltios' },
                { value: 'volt9', label: '9 voltios' },
                { value: 'volt12', label: '12 voltios' },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item name="hasMagnetizmo" valuePropName="checked">
          <Checkbox>¿Su disco ha sufrido procesos de magnetización?</Checkbox>
        </Form.Item>
        {datos.hasMagnetizmo && (
          <Form.Item
            name="voltios"
            label="¿Que tiempo ha estado su disco en el campo magnético?"
            rules={[$rules.required()]}
          >
            <Select
              placeholder="Seleccione el tiempo de magnetización"
              options={[
                { value: 'seg10m', label: '10 segundos' },
                { value: 'seg15m', label: '15 segundos' },
                { value: 'seg20m', label: '20 segundos' },
              ]}
            />
          </Form.Item>
        )}

        {valorfores && valorscalpel ? (
          <div className="grid grid-cols-2 text-center my-20">
            <div>
              <Typography.Title level={4}>Formost</Typography.Title>
              <Progress type="circle" percent={valorfores} />
            </div>
            <div>
              <Typography.Title level={4}>Scalpel</Typography.Title>
              <Progress type="circle" percent={valorscalpel} />
            </div>
          </div>
        ) : null}

        <Space className="mt-5">
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
          <Button
            onClick={() => {
              setValorfores(0)
              setValorscalpel(0)
              form.resetFields()
              setDatos(valoresIniciales)
            }}
          >
            Limpiar formulario
          </Button>
        </Space>
      </Form>
    </div>
  )
}

FormularioPage.getLayout = ProyectoLayout

export default FormularioPage
