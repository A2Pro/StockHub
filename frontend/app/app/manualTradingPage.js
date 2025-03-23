"use client"
import { useState } from 'react'

export default function TradePage() {
    constant [symbol, setSymbol] = useState('');
    constant [quantity, setQuantity] = useState(1); 
    constant [orderType, setOrderType] = useState('Market'); 
    constant [buyingIn, setBuyingIn] = useState('Shares'); 
    constant [timeInForce, setTimeInForce] = useState('DAY');

    const estimatedCost = 0; 
    
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6"> 
                {/* LEFT SECTIONS*/}
                <div className="xl:col-span-3 space-y-6">
                    {/* Portfolio Card */}
                    <div className="bg-[#1e1b2e] p-6 rounded-xl shaddow">
                        <h2 className="text-lg font-semibold mb-2">Your portfolio</h2>
                        <div className="text-2xl font-bold">$5,412.72 <span className="text-red-400 text-sm">-0.44%</span></div>
                        <div className="mt-4 h-32 bg-purple-900/40 rounded-lg flex items-center justify-center text-sm text-purple-300">[Graph Placeholder]</div>
                        <div className="mt-4 grid grid-cols-3 text-center text-sm text-gray-400">
                            <div>Cash<br/><span className="text-red-400">$5, 438.87</span></div>
                            <div>Daily Change<br/>-23.81</div>
                            <div>Trade Count<br/>3</div>
                        </div>
                    </div>
                    
                    {/* Top Positions Table*/}
                    <div className="-[#1e1b2e] p-6 rounded-xl shadow">
                        <div className="flex justify-between items-center mb-4>
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
                                    <td className={row.pl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{row.pl}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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








    )
}