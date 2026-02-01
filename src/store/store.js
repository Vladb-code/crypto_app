import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "./cryptoSlice";

const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith("crypto/")) {
    const state = store.getState();
    localStorage.setItem(
      "crypto_portfolio",
      JSON.stringify(state.crypto.portfolio),
    );
  }
  return result;
};

const savedPortfolio =
  JSON.parse(localStorage.getItem("crypto_portfolio")) || [];

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
  preloadedState: {
    crypto: {
      items: [],
      history: [],
      status: "idle",
      pagination: { currentPage: 1, limit: 10 },
      portfolio: savedPortfolio,
      isPortfolioModalOpen: false,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});
