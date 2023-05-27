import Head from 'next/head'
import '@/styles/globals.css'
import esEs from 'antd/locale/es_ES'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ConfigProvider, Layout, App } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import type { ReactElement, ReactNode } from 'react'

export type AppLayout = (page: ReactElement) => ReactNode

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: AppLayout
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function _App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Content className="p-14">{page}</Layout.Content>
      </Layout>
    ))

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ConfigProvider locale={esEs}>
        <App>
          <StyleProvider hashPriority="high">
            {getLayout(<Component {...pageProps} />)}
          </StyleProvider>
        </App>
      </ConfigProvider>
    </div>
  )
}
