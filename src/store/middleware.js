const persistenceMiddleware = (store) => (next) => (action) => {
  const portfolioActions = ["crypto/buyCoin", "crypto/removeFromPortfolio"];

  const result = next(action);

  if (portfolioActions.includes(action.type)) {
    const state = store.getState();
    localStorage.setItem(
      "crypto_portfolio",
      JSON.stringify(state.crypto.portfolio),
    );
  }

  return result;
};
