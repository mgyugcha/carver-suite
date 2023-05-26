import Image from "next/image";
import { Inter } from "next/font/google";
import { Button, Form, Input, Modal, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import $rules from "@/assets/$rules";
import { useUtils } from "@/assets/utils";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { showError } = useUtils();
  const [abrirModal, setAbrirModal] = useState(false);
  const [form] = Form.useForm();
  const [datos, setDatos] = useState([]);

  const init = async () => {
    const { data } = await axios.get("/api/projects");
    console.log("asd", data);
    setDatos(data);
  };

  const onSubmit = async (values) => {
    try {
      console.log("esto", values);
      // const { data } = await axios.post("/api/projects", values);
      form.resetFields()
      // await init();
    } catch (err) {
      showError(err);
    }
  };

  useEffect(() => {
    console.log("prrueabs");
    init();
  }, []);

  return (
    <div>
      <Modal
        title="Agregar proyecto"
        open={abrirModal}
        width={450}
        onOk={() => form.submit()}
        onCancel={() => setAbrirModal(false)}
      >
        <Form
          layout="horizontal"
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onSubmit}
        >
          <Form.Item label="Título" rules={[$rules.required()]} name="titulo">
            <Input placeholder="Ingresa el título del proeycto" />
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex justify-between">
        <Typography.Title>Proyectos</Typography.Title>
        <Button type="primary" onClick={() => setAbrirModal(true)}>
          Insertar
        </Button>
      </div>

      <Table
        dataSource={datos}
        rowKey="id"
        columns={[
          { title: "Identificador", dataIndex: "id" },
          { title: "Título", dataIndex: "titulo" },
        ]}
      />
    </div>
  );
}
