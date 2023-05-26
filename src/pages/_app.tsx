import "@/styles/globals.css";
import { ConfigProvider, Layout, App } from "antd";
import type { AppProps } from "next/app";
import { StyleProvider } from "@ant-design/cssinjs";

export default function _App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <App>
        <StyleProvider hashPriority="high">
          <Layout>
            {/* <Header>Header</Header> */}
            <Layout.Content className="p-14">
              <Component {...pageProps} />
            </Layout.Content>
            {/* <Footer>Footer</Footer> */}
          </Layout>
        </StyleProvider>
      </App>
    </ConfigProvider>
  );
}
