import { Routes, Route } from "react-router-dom";
import { Layout, ConfigProvider, App as AntdApp } from "antd";
import Header from "./components/Header";
import PortfolioModal from "./components/PortfolioModal";
import CryptoTableRTK from "./components/CryptoTableRTK";
import CoinPage from "./components/CoinPage";

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00f2ff",
          colorBgBase: "#0f172a",
          colorBgContainer: "#1e293b",
          colorTextBase: "#f8fafc",
          borderRadius: 12,
        },
        components: {
          Table: {
            headerBg: "#1e293b",
            headerColor: "#94a3b8",
            colorBgContainer: "#1e293b",
          },
          Modal: {
            headerBg: "#1e293b",
            contentBg: "#1e293b",
          },
        },
      }}
    >
      <AntdApp>
        <Layout className="app-layout">
          <Header />
          <PortfolioModal />
          <Content
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<CryptoTableRTK />} />
                <Route path="/coin/:id" element={<CoinPage />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
