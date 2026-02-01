import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { DEFAULT_PAGE_LIMIT, CHART_HISTORY_INTERVAL } from "../constants";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: { Authorization: `Bearer ${API_KEY}` },
});

export const fetchAssets = createAsyncThunk(
  "crypto/fetchAssets",
  async ({ limit = DEFAULT_PAGE_LIMIT, offset = 0 }) => {
    const response = await api.get(`?limit=${limit}&offset=${offset}`);
    return response.data.data;
  },
);

export const fetchCoinHistory = createAsyncThunk(
  "crypto/fetchCoinHistory",
  async (id) => {
    const response = await api.get(`/${id}/history`, {
      params: { interval: CHART_HISTORY_INTERVAL },
    });
    return response.data.data;
  },
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {},
  reducers: {
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
      state.status = "idle";
    },
    togglePortfolioModal: (state) => {
      state.isPortfolioModalOpen = !state.isPortfolioModalOpen;
    },
    buyCoin: (state, action) => {
      const { id, symbol, name, priceUsd, amount } = action.payload;
      const exiting = state.portfolio.find((item) => item.id === id);
      const numAmount = parseFloat(amount);

      if (exiting) {
        exiting.amount += numAmount;
      } else {
        state.portfolio.push({
          id,
          symbol,
          name,
          priceAtPurchase: parseFloat(priceUsd),
          amount: numAmount,
        });
      }
    },
    removeFromPortfolio: (state, action) => {
      state.portfolio = state.portfolio.filter(
        (item) => item.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCoinHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { setPage, buyCoin, removeFromPortfolio, togglePortfolioModal } =
  cryptoSlice.actions;
export const selectCryptoItems = (state) => state.crypto.items;
export const selectCryptoStatus = (state) => state.crypto.status;
export const selectCryptoPagination = (state) => state.crypto.pagination;
export const selectPortfolio = (state) => state.crypto.portfolio;
export const selectIsPortfolioModalOpen = (state) =>
  state.crypto.isPortfolioModalOpen;
export const selectCoinHistory = (state) => state.crypto.history;

export default cryptoSlice.reducer;
