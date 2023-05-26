import axios from "axios";
import Link from "next/link";
import $rules from "@/assets/$rules";
import { Inter } from "next/font/google";
import { useUtils } from "@/assets/utils";
import { Project } from "@/types/Projects";
import { useEffect, useState } from "react";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { showError } = useUtils();
  const [abrirModal, setAbrirModal] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [datos, setDatos] = useState<Project[]>([]);

  const init = async () => {
    const { data } = await axios.get("/api/projects");
    setDatos(data);
  };

  const onSubmit = async (values: Project) => {
    try {
      const { data } = await axios.post<Project>("/api/projects", values);
      form.resetFields();
      router.push("/" + data.id);
    } catch (err) {
      showError(err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Modal
        title="Insertar"
        open={abrirModal}
        width={400}
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
          { title: "ID", align: "right", dataIndex: "id" },
          { title: "Título", dataIndex: "titulo" },
          {
            align: "center",
            width: 1,
            render: (_, row) => (
              <Space.Compact size="small">
                <Link href={"/" + row.id}>
                  <Button title="Ver proyecto" icon={<EyeOutlined />} />
                </Link>
                <Popconfirm
                  title="Eliminar proyecto"
                  description="¿Seguro que desea eliminar?"
                  onConfirm={async () => {
                    try {
                      await axios.delete("/api/projects", {
                        params: { id: row.id },
                      });
                      await init();
                    } catch (err) {
                      showError(err);
                    }
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button title="Eliminar" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space.Compact>
            ),
          },
        ]}
      />
    </div>
  );
}
