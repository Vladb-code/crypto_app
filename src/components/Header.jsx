import { useSelector, useDispatch } from "react-redux";
import { Layout, Space, Typography, Statistic, Badge } from "antd";
import {
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { togglePortfolioModal } from "../store/cryptoSlice";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, portfolio } = useSelector((state) => state.crypto);
  const topThree = items.slice(0, 3);

  const stats = portfolio.reduce(
    (acc, item) => {
      const currentAsset = items.find((a) => a.id === item.id);
      const currentPrice = currentAsset
        ? Number(currentAsset.priceUsd)
        : Number(item.priceAtPurchase);
      const initialPrice = Number(item.priceAtPurchase) || 0;
      const amount = Number(item.amount) || 0;
      acc.currentTotal += amount * currentPrice;
      acc.initialTotal += amount * initialPrice;
      return acc;
    },
    { currentTotal: 0, initialTotal: 0 },
  );

  const diff = stats.currentTotal - stats.initialTotal;
  const diffPercent =
    stats.initialTotal > 0 ? (diff / stats.initialTotal) * 100 : 0;

  return (
    <AntHeader className="header-container">
      <Space
        size="large"
        className="header-clickable"
        onClick={() => navigate("/")}
      >
        <Text strong>ТОП-3:</Text>
        {topThree.map((c) => (
          <Badge
            key={c.id}
            color="blue"
            text={`${c.symbol}: $${Number(c.priceUsd).toFixed(2)}`}
          />
        ))}
      </Space>

      <div
        className="header-portfolio"
        onClick={() => dispatch(togglePortfolioModal())}
      >
        <Space size="middle">
          <Statistic
            title="Ваш портфель"
            value={stats.currentTotal}
            precision={2}
            prefix={<WalletOutlined />}
            suffix="$"
            className="statistic-small"
          />
          <Statistic
            value={diffPercent}
            precision={2}
            className="statistic-small"
            prefix={diff >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="%"
          />
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
