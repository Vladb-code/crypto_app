import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Typography, Space, Flex, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  togglePortfolioModal,
  removeFromPortfolio,
} from "../store/cryptoSlice";
import {
  selectPortfolio,
  selectIsPortfolioModalOpen,
  selectCryptoItems,
} from "../store/cryptoSlice";
import { CURRENCY_DIGITS_DEFAULT } from "../constants";
const { Text, Title } = Typography;

const PortfolioModal = () => {
  const dispatch = useDispatch();
  const portfolio = useSelector(selectPortfolio);
  const isPortfolioModalOpen = useSelector(selectIsPortfolioModalOpen);
  const items = useSelector(selectCryptoItems);

  const fmtCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0);
  };

  const totalValue = portfolio.reduce((sum, item) => {
    const asset = items.find((a) => a.id === item.id);
    const currentPrice = asset
      ? parseFloat(asset.priceUsd)
      : Number(item.priceAtPurchase);
    return sum + Number(item.amount) * currentPrice;
  }, 0);

  return (
    <Modal
      title={<Title level={3}>Ваш Портфель</Title>}
      open={isPortfolioModalOpen}
      onCancel={() => dispatch(togglePortfolioModal())}
      footer={[
        <div key="footer" className="modal-footer">
          <Text strong className="text-18">
            ИТОГО:
          </Text>
          <Text strong type="primary" className="text-18">
            $
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: CURRENCY_DIGITS_DEFAULT,
            })}
          </Text>
        </div>,
      ]}
      width={600}
    >
      <Flex vertical gap="middle" className="portfolio-list">
        {portfolio.length === 0 ? (
          <Text
            type="secondary"
            className="w-100"
            style={{ textAlign: "center" }}
          >
            Портфель пока пуст
          </Text>
        ) : (
          portfolio.map((item) => {
            const asset = items.find((a) => a.id === item.id);
            const currentPrice = asset
              ? parseFloat(asset.priceUsd)
              : Number(item.priceAtPurchase);
            return (
              <React.Fragment key={item.id}>
                <Flex align="center" justify="space-between">
                  <Flex vertical>
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">
                      {Number(item.amount).toFixed(4)} {item.symbol}
                    </Text>
                    <Text italic className="font-12">
                      курс: ${currentPrice.toFixed(CURRENCY_DIGITS_DEFAULT)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="large">
                    <Text strong>
                      $
                      {(item.amount * currentPrice).toFixed(
                        CURRENCY_DIGITS_DEFAULT,
                      )}
                    </Text>
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => dispatch(removeFromPortfolio(item.id))}
                    />
                  </Flex>
                </Flex>
                <Divider style={{ margin: "8px 0" }} />
              </React.Fragment>
            );
          })
        )}
      </Flex>
    </Modal>
  );
};

export default PortfolioModal;
