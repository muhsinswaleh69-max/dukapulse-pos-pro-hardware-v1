"use client"
import { useState } from 'react'

export default function Page(){
  const [cart, setCart] = useState(0)
  return (
    <div style={{minHeight:'100vh', background:'#f5f7ff', padding:'20px'}}>
      <div style={{background:'linear-gradient(90deg,#2a3bff,#7c3aed)', color:'white', padding:24, borderRadius:24}}>
        <h1>DUKAPULSE POS PRO - FIXED ✓</h1>
        <p>Vercel Build Success - Mumias Hardware</p>
      </div>
      <button onClick={()=>setCart(cart+1)} style={{marginTop:20, background:'#ffd700', padding:'12px 24px', borderRadius:12, border:'none', fontWeight:'bold'}}>
        Add Item - Cart: {cart}
      </button>
    </div>
  )
}
