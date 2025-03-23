// "use client"
// import { useState } from 'react'

// export default function TradePage() {
//     constant [symbol, setSymbol] = useState('');
//     constant [quantity, setQuantity] = useState(1); 
//     constant [orderType, setOrderType] = useState('Market'); 
//     constant [buyingIn, setBuyingIn] = useState('Shares'); 
//     constant [timeInForce, setTimeInForce] = useState('DAY');

//     const estimatedCost = 0; 
    
//     return (
//         <div className="min-h-screen bg-black text-white p-6">
//             <div className="grid grid-cols-1 xl:grid-cols-4 gap-6"> 
//                 {/* LEFT SECTIONS*/}
//                 <div className="xl:col-span-3 space-y-6">
//                     {/* Portfolio Card */}
//                     <div className="bg-[#1e1b2e] p-6 rounded-xl shaddow">
//                         <h2 className="text-lg font-semibold mb-2">Your portfolio</h2>
//                         <div className="text-2xl font-bold">$5,412.72 <span className="text-red-400 text-sm">-0.44%</span></div>
//                         <div className="mt-4 h-32 bg-purple-900/40 rounded-lg flex items-center justify-center text-sm text-purple-300">[Graph Placeholder]</div>
//                         <div className="mt-4 grid grid-cols-3 text-center text-sm text-gray-400">
//                             <div>Cash<br/><span className="text-red-400"
//                 </div>
//             </div>
//         </div>
//     )
// }