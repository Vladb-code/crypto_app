import { useSelector, useDispatch } from "react-redux";
import { Layout, Space, Typography, Statistic, Badge } from "antd";
import {
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { togglePortfolioModal } from "../store/cryptoSlice";
import { useNavigate } from "react-router-dom";
import {
  TOP_ASSETS_COUNT,
  CURRENCY_DIGITS_DEFAULT,
  PERCENT_DIGITS,
} from "../constants";
import { selectCryptoItems, selectPortfolio } from "../store/cryptoSlice";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCryptoItems);
  const portfolio = useSelector(selectPortfolio);
  const topThree = items.slice(0, TOP_ASSETS_COUNT);

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
        <Text strong>ТОП-{TOP_ASSETS_COUNT}:</Text>
        {topThree.map((c) => (
          <Badge
            key={c.id}
            color="blue"
            text={`${c.symbol}: $${Number(c.priceUsd).toFixed(CURRENCY_DIGITS_DEFAULT)}`}
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
            precision={CURRENCY_DIGITS_DEFAULT}
            prefix={<WalletOutlined />}
            suffix="$"
            className="statistic-small"
          />
          <Statistic
            value={diffPercent}
            precision={PERCENT_DIGITS}
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
