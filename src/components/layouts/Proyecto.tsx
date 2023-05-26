import Link from 'next/link'
import { Layout, Menu } from 'antd'
import { useRouter } from 'next/router'
import type { AppLayout } from '@/pages/_app'

const ProyectoLayout: AppLayout = (page) => {
  const router = useRouter()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
      // collapsed={collapsed}
      // onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={[
            {
              key: 'informacion',
              label: 'Información',
            },
            {
              key: 'formulario',
              label: (
                <Link href={'/' + router.query.id + '/form'}>Formulario</Link>
              ),
            },
            {
              key: 'recuperar',
              label: 'Recuperar archivos',
            },
            {
              key: 'clasificar',
              label: 'Clasificar archivos',
            },
            {
              key: 'volver',
              label: <Link href="/">Volver al inicio</Link>,
            },
          ]}
        />
      </Layout.Sider>

      <Layout className="px-14 py-5">{page}</Layout>
    </Layout>
  )
}

export default ProyectoLayout
