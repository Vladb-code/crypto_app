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
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
      }}
    >
      <AntdApp>
        <Layout className="app-layout">
          <Header />
          <PortfolioModal />
          <Content
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
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
