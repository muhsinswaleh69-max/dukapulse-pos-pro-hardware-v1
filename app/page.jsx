'use client'
import { useState } from 'react'

export default function DukaPulsePro() {
  
  const products = [
    { name: "Cement - Bamburi", price: 750, stock: 120, sku: "CEM-001" },
    { name: "Iron Sheet - MRM", price: 1850, stock: 45, sku: "IRON-02" },
    { name: "Paint - Crown 20L", price: 4200, stock: 22, sku: "PNT-20L" },
    { name: "Nails 3 inch - 1kg", price: 250, stock: 200, sku: "NAIL-3" },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex">
      {/* EduNexa Pro Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#2a3bff] to-[#7c3aed] text-white p-6 fixed h-full">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-8 bg-[#ffd700] rounded-full"></span> DUKAPULSE PRO
        </h1>
        <p className="text-xs opacity-60">Hardware • Mumias</p>
        <nav className="mt-10 space-y-2">
          {['Dashboard','Sell (POS)','Stock','M-Pesa','Receipts','Reports','Hardware'].map((i,idx)=>(
            <div key={i} className={`px-4 py-3 rounded-xl flex gap-3 ${idx===1?'bg-white/20 border border-white/20 backdrop-blur-md':''}`}>
              <div className="w-2 h-2 bg-[#ffd700] rounded-full mt-2"></div>{i}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-6 grid grid-cols-12 gap-6">
        {/* Products */}
        <div className="col-span-8 bg-white/70 backdrop-blur-xl rounded-[24px] p-6 shadow-lg border border-white">
          <div className="grid grid-cols-2 gap-4">
            {products.map(p=>(
              <div key={p.sku} onClick={()=>setCart([...cart,p])} className="bg-white rounded-2xl p-4 shadow hover:shadow-xl cursor-pointer hover:scale-[1.02] transition-all border">
                <p className="text-xs text-gray-400">{p.sku} • {p.stock} left</p>
                <h3 className="font-bold mt-1">{p.name}</h3>
                <p className="mt-2 text-[#2a3bff] font-bold">KES {p.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cart - Glassmorphism */}
        <div className="col-span-4 bg-gradient-to-b from-[#2a3bff] to-[#7c3aed] rounded-[24px] p-6 text-white shadow-2xl h-fit">
          <h2 className="font-bold text-lg flex items-center gap-2"><span className="w-2 h-2 bg-[#ffd700] rounded-full"></span>Cart • {cart.length}</h2>
          <div className="mt-4 space-y-2">
            {cart.map((c,i)=><div key={i} className="bg-white/10 backdrop-blur p-3 rounded-xl flex justify-between"><span>{c.name}</span><span>KES {c.price}</span></div>)}
          </div>
          <div className="mt-6 border-t border-white/20 pt-4">
            <p className="flex justify-between font-bold text-xl"><span>Total</span><span>KES {cart.reduce((s,i)=>s+i.price,0)}</span></p>
            <button className="mt-4 w-full bg-[#ffd700] text-black py-4 rounded-2xl font-bold shadow-lg">LIPA M-PESA + PRINT</button>
          </div>
        </div>
      </main>
    </div>
  )
}
