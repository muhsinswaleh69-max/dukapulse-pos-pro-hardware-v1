"use client";
import { useState } from "react";

type Item = { id: number; name: string; price: number; stock: number; category: string; };
type CartItem = Item & { qty: number };

const INITIAL_ITEMS: Item[] = [
  { id: 1, name: "Cement - Bamburi 50kg", price: 750, stock: 120, category: "Cement" },
  { id: 2, name: "Iron Sheet - Mabati 2.5m", price: 1800, stock: 60, category: "Iron Sheets" },
  { id: 3, name: "Nails 3 inch - 1kg", price: 250, stock: 100, category: "Nails" },
  { id: 4, name: "Timber 2x3 - Cypress", price: 450, stock: 80, category: "Timber" },
  { id: 5, name: "Paint - Dulux 4L White", price: 3200, stock: 30, category: "Paint" },
  { id: 6, name: "Hinges - Door 4 inch", price: 180, stock: 200, category: "Fittings" },
];

export default function Page() {
  const [items] = useState<Item[]>(INITIAL_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (item: Item) => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) return prev.map(p => p.id === item.id? {...p, qty: p.qty+1} : p);
      return [...prev, {...item, qty: 1}];
    });
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleSale = () => {
    if (cart.length === 0) return alert("Cart empty!");
    alert(`SALE SUCCESS!\nTotal: KES ${total}\nM-Pesa: ${mpesaPhone || "Cash"}\nReceipt printing...`);
    setCart([]);
  };

  return (
    <main style={{fontFamily:"system-ui", padding:16, maxWidth:1200, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#2563eb,#1e40af)", color:"white", padding:20, borderRadius:16, marginBottom:16}}>
        <h1 style={{margin:0, fontSize:28, fontWeight:800}}>DUKAPULSE POS PRO - MUMIAS HARDWARE</h1>
        <p style={{opacity:0.9, margin:"4px 0 0 0"}}>Live: dukapulse-pos-pro-hardware-v1 ● Ready ● Stock: {items.length} items</p>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:16}}>
        <div style={{background:"white", borderRadius:12, padding:12}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cement, mabati, nails..." style={{width:"100%", padding:12, borderRadius:8, border:"1px solid #ddd", marginBottom:12}}/>
          <div style={{display:"grid", gap:8}}>
            {filtered.map(item=>(
              <div key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:12, border:"1px solid #eee", borderRadius:8}}>
                <div><b>{item.name}</b><br/><small style={{color:"#666"}}>{item.category} • Stock: {item.stock} • KES {item.price}</small></div>
                <button onClick={()=>addToCart(item)} style={{background:"#facc15", border:"none", padding:"8px 14px", borderRadius:8, fontWeight:700, cursor:"pointer"}}>Add +</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"white", borderRadius:12, padding:12, height:"fit-content"}}>
          <h3 style={{marginTop:0}}>Cart: {cart.reduce((s,i)=>s+i.qty,0)} items</h3>
          {cart.length===0 && <p style={{color:"#888"}}>No items yet</p>}
          {cart.map(c=>(
            <div key={c.id} style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
              <span>{c.name} x {c.qty}</span><span>KES {c.price*c.qty}</span>
            </div>
          ))}
          <hr/>
          <h2>Total: KES {total.toLocaleString()}</h2>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="M-Pesa Phone 07..." style={{width:"100%", padding:10, borderRadius:8, border:"1px solid #ddd", margin:"8px 0"}}/>
          <button onClick={handleSale} style={{width:"100%", background:"#16a34a", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:800, fontSize:16, cursor:"pointer"}}>COMPLETE SALE - M-PESA / CASH</button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:8, background:"#e5e7eb", border:"none", padding:10, borderRadius:10, cursor:"pointer"}}>Clear Cart</button>
        </div>
      </div>
    </main>
  );
}
