'use client'
import { useState } from 'react'

export default function Page() {
  const [cart, setCart] = useState([])
  
  const products = [
    { name: "Cement Bamburi", price: 750 },
    { name: "Iron Sheet", price: 1850 },
    { name: "Paint Crown 20L", price: 4200 },
  ]

  const add = (p) => setCart([...cart, p])
  const total = cart.reduce((s, i) => s + i.price, 0)

  return (
    <div style={{padding:20, fontFamily:"sans-serif", background:"#f5f7f3", minHeight:"100vh"}}>
      <h1 style={{fontWeight:"bold", fontSize:24}}>DukaPulse Pro - Hardware POS</h1>
      <p style={{color:"green", fontWeight:"bold"}}>● OFFLINE MODE ACTIVE</p>
      
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20}}>
        {products.map((p, i) => (
          <div key={i} style={{background:"white", padding:16, borderRadius:12}}>
            <b>{p.name}</b><br/>KSH {p.price}<br/>
            <button onClick={() => add(p)} style={{marginTop:8, background:"#0f2e2a", color:"white", padding:"6px 12px", borderRadius:6}}>Add</button>
          </div>
        ))}
      </div>

      <div style={{background:"white", padding:16, borderRadius:12, marginTop:20}}>
        <b>Cart: {cart.length} items</b><br/>Total: KSH {total}
      </div>
    </div>
  )
}
