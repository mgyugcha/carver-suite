import Link from 'next/link'
import { Layout, Menu } from 'antd'
import { useRouter } from 'next/router'
import type { AppLayout } from '@/pages/_app'

const ProyectoLayout: AppLayout = (page) => {
  const router = useRouter()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header className="flex items-center !bg-white sticky top-0 z-50">
        <div className="demo-logo-vertical" />
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['informacion']}
          items={[
            {
              key: 'informacion',
              label: <Link href={'/' + router.query.id}>Información</Link>,
            },
            {
              key: 'formulario',
              label: (
                <Link href={'/' + router.query.id + '/form'}>Formulario</Link>
              ),
            },
            {
              key: 'recuperar',
              label: (
                <Link href={'/' + router.query.id + '/recuperar'}>
                  Recuperar archivos
                </Link>
              ),
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
      </Layout.Header>

      <Layout>
        <div className="w-[720px] mx-auto py-16">{page}</div>
      </Layout>
    </Layout>
  )
}

export default ProyectoLayout
