import { cache } from 'react';

const fetchStockData = cache(async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { symbol: 'AAPL', price: 150.25, change: 2.5 },
    { symbol: 'GOOGL', price: 2750.8, change: -1.2 },
    { symbol: 'MSFT', price: 305.15, change: 0.8 },
  ];
});

export default async function StockTicker() {
  const stocks = await fetchStockData();

  return (
    <div className="widget overflow-x-auto bg-black">
      <h2 className="widget-title text-indigo-600">Stock Ticker</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Symbol</th>
            <th className="text-left">Price</th>
            <th className="text-left">Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={`stock-${stock.symbol}`}>
              <td className="font-medium">{stock.symbol}</td>
              <td>${stock.price.toFixed(2)}</td>
              <td
                className={stock.change > 0 ? 'text-green-500' : 'text-red-500'}
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
