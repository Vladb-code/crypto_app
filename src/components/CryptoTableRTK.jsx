import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, InputNumber, Typography, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fetchAssets, buyCoin, setPage } from "../store/cryptoSlice";
import { App } from "antd";
import {
  CURRENCY_DIGITS_TABLE,
  CURRENCY_DIGITS_DEFAULT,
  PERCENT_DIGITS,
} from "../constants";
import {
  selectCryptoItems,
  selectCryptoStatus,
  selectCryptoPagination,
} from "../store/cryptoSlice";
const { Text } = Typography;

const CryptoTableRTK = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [buyTarget, setBuyTarget] = useState(null);
  const [amount, setAmount] = useState(null);

  const items = useSelector(selectCryptoItems);
  const status = useSelector(selectCryptoStatus);
  const pagination = useSelector(selectCryptoPagination);

  useEffect(() => {
    const offset = (pagination.currentPage - 1) * pagination.limit;
    dispatch(fetchAssets({ limit: pagination.limit, offset }));
  }, [dispatch, pagination.currentPage, pagination.limit]);

  const formatCurrency = (value, digits = CURRENCY_DIGITS_DEFAULT) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits,
    }).format(value);
  };

  const handleQuickBuy = () => {
    if (!amount || amount <= 0) return;
    dispatch(buyCoin({ ...buyTarget, amount }));
    message.success(`Куплено: ${buyTarget.name}`);

    setBuyTarget(null);
    setAmount(null);
  };

  const columns = [
    { title: "№", dataIndex: "rank", key: "rank", width: 30 },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Text strong>
          {record.name} <Text type="secondary">{record.symbol}</Text>
        </Text>
      ),
    },
    {
      title: "VWAP (24ч)",
      dataIndex: "vwap24Hr",
      render: (val) => formatCurrency(val),
    },
    {
      title: "Change (24Hr)",
      dataIndex: "changePercent24Hr",
      render: (val) => (
        <Tag color={val >= 0 ? "green" : "red"}>
          {Number(val).toFixed(PERCENT_DIGITS)}%
        </Tag>
      ),
    },
    {
      title: "Market Cap",
      dataIndex: "marketCapUsd",
      responsive: ["sm", "md", "lg", "xl", "xxl"],
      render: (val) => formatCurrency(val, 0),
    },
    {
      title: "Price",
      dataIndex: "priceUsd",
      render: (val) => formatCurrency(val, CURRENCY_DIGITS_TABLE),
    },
    {
      key: "action",

      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            setBuyTarget(record);
          }}
        />
      ),
    },
  ];

  return (
    <div className="table-container">
      <Table
        className="crypto-table"
        scroll={{
          y: "calc(100vh - 300px)",
          x: "100%",
        }}
        dataSource={items.slice(0, pagination.limit)}
        columns={columns}
        rowKey="id"
        loading={status === "loading"}
        onRow={(record) => ({
          onClick: () => navigate(`/coin/${record.id}`),
        })}
        pagination={{
          placement: "bottomCenter",

          current: pagination.currentPage,
          pageSize: pagination.limit,
          total: 100,
          onChange: (page) => dispatch(setPage(page)),
          showSizeChanger: false,
        }}
      />

      <Modal
        title={`Купить ${buyTarget?.name}`}
        open={!!buyTarget}
        onOk={handleQuickBuy}
        onCancel={() => setBuyTarget(null)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <div style={{ padding: "10px 0" }}>
          <Text style={{ display: "block", marginBottom: 8 }}>
            Введите количество:
          </Text>
          <InputNumber
            style={{ width: "100%" }}
            autoFocus
            value={amount}
            onChange={setAmount}
            placeholder="0.00"
            min={0}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CryptoTableRTK;
