import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: { Authorization: `Bearer ${API_KEY}` },
});

export const fetchAssets = createAsyncThunk(
  "crypto/fetchAssets",
  async ({ limit = 10, offset = 0 }) => {
    const response = await api.get(`?limit=${limit}&offset=${offset}`);
    return response.data.data;
  },
);

export const fetchCoinHistory = createAsyncThunk(
  "crypto/fetchCoinHistory",
  async (id) => {
    const response = await api.get(`/${id}/history`, {
      params: { interval: "m15" },
    });
    return response.data.data;
  },
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    items: [],
    history: [],
    status: "idle",
    pagination: { currentPage: 1, limit: 10 },
    portfolio: JSON.parse(localStorage.getItem("crypto_portfolio")) || [],
    isPortfolioModalOpen: false,
  },
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
      const numPrice = parseFloat(priceUsd);

      if (exiting) {
        exiting.amount += numAmount;
      } else {
        state.portfolio.push({
          id,
          symbol,
          name,
          priceAtPurchase: numPrice,
          amount: numAmount,
        });
      }
      localStorage.setItem("crypto_portfolio", JSON.stringify(state.portfolio));
    },
    removeFromPortfolio: (state, action) => {
      state.portfolio = state.portfolio.filter(
        (item) => item.id !== action.payload,
      );
      localStorage.setItem("crypto_portfolio", JSON.stringify(state.portfolio));
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
export default cryptoSlice.reducer;
