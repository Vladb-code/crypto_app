import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Typography,
  InputNumber,
  Card,
  Descriptions,
  Statistic,
  Row,
  Col,
  Breadcrumb,
  App,
  Flex,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { fetchCoinHistory, fetchAssets, buyCoin } from "../store/cryptoSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  BILLION_THRESHOLD,
  MILLION_THRESHOLD,
  CURRENCY_DIGITS_TABLE,
  CURRENCY_DIGITS_DEFAULT,
  PERCENT_DIGITS,
} from "../constants";

const { Text, Title, Link } = Typography;

const CoinPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const [amount, setAmount] = useState(null);
  const { items, history } = useSelector((state) => state.crypto);
  const coin = items.find((c) => c.id === id);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchAssets({ limit: 50, offset: 0 }));
    dispatch(fetchCoinHistory(id));
  }, [id, dispatch, items.length]);

  if (!coin) return <Card loading title="Загрузка данных монеты..." />;

  const chartData = history.map((p) => ({
    ...p,
    priceUsd: parseFloat(p.priceUsd),
    timeFormatted: new Date(p.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const handleBuy = () => {
    if (amount > 0) {
      dispatch(buyCoin({ ...coin, amount }));
      setAmount(null);
      message.success(`Вы успешно купили ${coin.name}!`);
    }
  };

  const formatLargeNumber = (value) => {
    if (!value) return "N/A";
    const num = parseFloat(value);
    if (num >= BILLION_THRESHOLD) {
      return (num / BILLION_THRESHOLD).toFixed(2) + " млрд";
    }
    if (num >= MILLION_THRESHOLD) {
      return (num / MILLION_THRESHOLD).toFixed(2) + " млн";
    }
    return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(
      num,
    );
  };

  const formatNumber = (value, digits = CURRENCY_DIGITS_DEFAULT) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(parseFloat(value));
  };

  return (
    <div className="coin-page-wrapper">
      <Breadcrumb
        className="margin-b-16"
        items={[
          {
            title: (
              <span onClick={() => navigate("/")} className="row-pointer">
                <ArrowLeftOutlined /> Список монет
              </span>
            ),
          },
          { title: coin.name },
        ]}
      />

      <Row gutter={[24, 24]} style={{ flex: 1 }}>
        <Col xs={24} md={16}>
          <Card title="Данные о монете" className="margin-b-24">
            <Descriptions
              column={1}
              size="small"
              styles={{
                label: {
                  fontWeight: "bold",
                  color: "rgba(0, 0, 0, 0.65)",
                  width: "60%",
                },
                content: { textAlign: "right", width: "40%" },
              }}
            >
              <Descriptions.Item label="Доступное предложение для торговли">
                {formatLargeNumber(coin.supply)}
              </Descriptions.Item>
              <Descriptions.Item label="Общее кол-во выпущенных активов">
                {formatLargeNumber(coin.supply)}
              </Descriptions.Item>
              <Descriptions.Item label="Объем торгов за последние 24 часа">
                ${formatLargeNumber(coin.volumeUsd24Hr)}
              </Descriptions.Item>
              <Descriptions.Item label="Средняя цена по объему за последние 24 часа">
                ${formatNumber(coin.vwap24Hr, CURRENCY_DIGITS_TABLE)}
              </Descriptions.Item>
              <Descriptions.Item label="Процентные изменения цены за последние 24 часа">
                <Text type={coin.changePercent24Hr >= 0 ? "success" : "danger"}>
                  {Number(coin.changePercent24Hr).toFixed(PERCENT_DIGITS)}%
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Сайт">
                <Link href={coin.explorer} target="_blank">
                  <GlobalOutlined /> Ссылка
                </Link>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card>
            <Row align="middle" justify="space-between" gutter={16}>
              <Col>
                <Title level={2}>
                  {coin.name}{" "}
                  <Text level={4} type="secondary">
                    {coin.symbol}
                  </Text>
                </Title>
              </Col>
              <Col>
                <Statistic
                  value={coin.priceUsd}
                  precision={CURRENCY_DIGITS_TABLE}
                  prefix="$"
                  styles={{ content: { color: "#1890ff" } }}
                />
              </Col>
            </Row>

            <div className="chart-wrapper">
              <Title level={5}>История цен (24ч)</Title>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="99%" height={350}>
                  <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="timeFormatted"
                      tick={{ fontSize: 10 }}
                      minTickGap={30}
                    />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toFixed(CURRENCY_DIGITS_TABLE)}`,
                        "Цена",
                      ]}
                      labelStyle={{ color: "#888" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="priceUsd"
                      stroke="#00f2ff"
                      strokeWidth={3}
                      dot={false}
                      filter="drop-shadow(0px 0px 8px rgba(0, 242, 255, 0.5))"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-loading">
                  <Text>Загрузка графика...</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Flex vertical gap="large" style={{ width: "100%" }}>
            <Card title="Купить актив">
              <Flex vertical gap="middle" style={{ width: "100%" }}>
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  value={amount}
                  onChange={setAmount}
                  placeholder="Кол-во монет"
                  min={0}
                />
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<ShoppingCartOutlined />}
                  onClick={handleBuy}
                  disabled={!amount}
                >
                  Купить
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default CoinPage;
