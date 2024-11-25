import styles from './StockTicker.module.css';

const fetchStockData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { symbol: 'AAPL', price: 150.25, change: 2.5 },
    { symbol: 'GOOGL', price: 2750.8, change: -1.2 },
    { symbol: 'MSFT', price: 305.15, change: 0.8 },
  ];
};

export default async function StockTicker() {
  const stocks = await fetchStockData();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Stock Ticker</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td className={styles.symbol}>{stock.symbol}</td>
              <td>${stock.price.toFixed(2)}</td>
              <td
                className={stock.change > 0 ? styles.positive : styles.negative}
              >
                {stock.change > 0 ? '+' : ''}
                {stock.change}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
