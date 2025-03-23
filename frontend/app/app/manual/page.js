"use client";
import { useState } from 'react';

export default function TradePage() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1); 
  const [orderType, setOrderType] = useState('Market'); 
  const [buyingIn, setBuyingIn] = useState('Shares'); 
  const [timeInForce, setTimeInForce] = useState('DAY');

  const estimatedCost = 0;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* LEFT SECTION */}
        <div className="xl:col-span-3 space-y-6">
          {/* Portfolio Card */}
          <div className="bg-[#1e1b2e] p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Your portfolio</h2>
            <div className="text-2xl font-bold">
              $5,412.72 <span className="text-red-400 text-sm">-0.44%</span>
            </div>
            <div className="mt-4 h-32 bg-purple-900/40 rounded-lg flex items-center justify-center text-sm text-purple-300">
              [Graph Placeholder]
            </div>
            <div className="mt-4 grid grid-cols-3 text-center text-sm text-gray-400">
              <div>Cash<br/><span className="text-red-400">-$5,438.87</span></div>
              <div>Daily Change<br/>-23.81</div>
              <div>Trade Count<br/>3</div>
            </div>
          </div>

          {/* Top Positions Table */}
          <div className="bg-[#1e1b2e] p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Top Positions</h2>
              <button className="text-sm text-purple-400 hover:underline">View All</button>
            </div>
            <table className="w-full text-sm text-white">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th>Asset</th><th>Price</th><th>Qty</th><th>Value</th><th>Total P/L</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asset: 'AAPL', price: 180, qty: 2, value: 360, pl: '+$20.12' },
                  { asset: 'TSLA', price: 250, qty: 1, value: 250, pl: '-$10.30' },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-gray-800">
                    <td className="py-2">{row.asset}</td>
                    <td>${row.price}</td>
                    <td>{row.qty}</td>
                    <td>${row.value}</td>
                    <td className={row.pl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {row.pl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Trade Form + API Info */}
        <div className="space-y-6">

          {/* Trade Panel */}
          <div className="bg-[#1e1b2e] p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <button className="font-semibold text-purple-400">Buy</button>
              <button className="text-gray-500">Sell</button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label>Symbol</label>
                <input 
                  type="text"
                  className="w-full mt-1 px-3 py-2 bg-black text-white border border-gray-600 rounded"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. AAPL"
                />
              </div>

              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 bg-black text-white border border-gray-600 rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <label>Order Type</label>
                <select
                  className="w-full mt-1 px-3 py-2 bg-black text-white border border-gray-600 rounded"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="Market">Market</option>
                  <option value="Limit">Limit</option>
                </select>
              </div>

              <div>
                <label>Choose how to buy</label>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => setBuyingIn('Shares')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      buyingIn === 'Shares' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Shares
                  </button>
                  <button
                    onClick={() => setBuyingIn('Dollars')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      buyingIn === 'Dollars' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Dollars
                  </button>
                </div>
              </div>

              <div>
                <label>Time in Force</label>
                <select
                  className="w-full mt-1 px-3 py-2 bg-black text-white border border-gray-600 rounded"
                  value={timeInForce}
                  onChange={(e) => setTimeInForce(e.target.value)}
                >
                  <option value="DAY">DAY</option>
                  <option value="GTC">GTC</option>
                </select>
              </div>

              <div className="mt-4">
                <p className="text-gray-400">Estimated Cost: ${estimatedCost}</p>
                <button
                  className="mt-2 w-full bg-purple-600 text-white py-2 rounded disabled:opacity-50"
                  disabled={!symbol}
                >
                  Review Order
                </button>
              </div>
            </div>
          </div>

          {/* API Info */}
          <div className="bg-[#1e1b2e] p-4 rounded-xl shadow text-xs">
            <p className="mb-2 font-semibold text-white">API Keys</p>
            <p className="text-gray-400">Endpoint</p>
            <p className="break-all text-sm text-white">https://api.alpaca.markets</p>
            <p className="text-gray-400 mt-2">Key</p>
            <div className="bg-gray-800 p-2 rounded text-sm font-mono text-purple-300">
              AKIj30JM431CH005ASNTV
            </div>
            <button className="mt-2 text-purple-400 text-sm hover:underline">Regenerate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

    