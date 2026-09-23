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
  const [receipt, setReceipt] = useState<{id:string, date:string, cart:CartItem[], total:number, phone:string} | null>(null);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const addToCart = (item: Item) => {
    setCart(prev => {
      const f = prev.find(p=>p.id===item.id);
      if(f) return prev.map(p=>p.id===item.id?{...p, qty:p.qty+1}:p);
      return [...prev, {...item, qty:1}];
    });
  };
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  const handleSale = () => {
    if(cart.length===0) return alert("Cart empty!");
    const rec = {
      id: "RCPT-" + Date.now().toString().slice(-6),
      date: new Date().toLocaleString(),
      cart: [...cart],
      total,
      phone: mpesaPhone || "CASH"
    };
    setReceipt(rec);
    setTimeout(()=>{ window.print(); }, 300);
  };

  const closeReceipt = () => { setReceipt(null); setCart([]); setMpesaPhone(""); };

  return (
    <main style={{fontFamily:"system-ui", padding:16, maxWidth:1200, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <style>{`@media print {.no-print{display:none!important}.print-only{display:block!important} body{background:white} } @media screen {.print-only{display:none} }`}</style>

      <div className="no-print" style={{background:"linear-gradient(135deg,#2563eb,#1e40af)", color:"white", padding:20, borderRadius:16, marginBottom:16}}>
        <h1 style={{margin:0, fontSize:26, fontWeight:800}}>DUKAPULSE POS PRO - MUMIAS HARDWARE</h1>
        <p style={{opacity:0.9, margin:"4px 0 0 0"}}>Live: {receipt? receipt.id : "Ready"} ● Stock: {items.length} items ● Pole Pole Level 1: Receipt</p>
      </div>

      <div className="no-print" style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:16}}>
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
          {cart.map(c=>(
            <div key={c.id} style={{display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:14}}>
              <span>{c.name} x {c.qty}</span><span>KES {c.price*c.qty}</span>
            </div>
          ))}
          <hr/>
          <h2>Total: KES {total.toLocaleString()}</h2>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="M-Pesa Phone 07..." style={{width:"100%", padding:10, borderRadius:8, border:"1px solid #ddd", margin:"8px 0"}}/>
          <button onClick={handleSale} style={{width:"100%", background:"#16a34a", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:800, fontSize:16, cursor:"pointer"}}>COMPLETE SALE & PRINT RECEIPT</button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:8, background:"#e5e7eb", border:"none", padding:10, borderRadius:10, cursor:"pointer"}}>Clear</button>
        </div>
      </div>

      {/* RECEIPT */}
      {receipt && (
        <div className="print-only" style={{background:"white", padding:20, maxWidth:320, margin:"0 auto", fontFamily:"monospace", fontSize:13, color:"black"}}>
          <div style={{textAlign:"center", borderBottom:"2px dashed black", paddingBottom:10, marginBottom:10}}>
            <h2 style={{margin:0}}>MUMIAS HARDWARE</h2>
            <div>DukaPulse POS PRO</div>
            <div>Mumias Town, Kakamega Road</div>
            <div>Tel: 07XX XXX XXX</div>
          </div>
          <div>Receipt: <b>{receipt.id}</b><br/>Date: {receipt.date}<br/>Cashier: Admin<br/>Payment: {receipt.phone}</div>
          <div style={{borderTop:"1px dashed black", borderBottom:"1px dashed black", margin:"10px 0", padding:"8px 0"}}>
            {receipt.cart.map(c=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between"}}><span>{c.name} x{c.qty}</span><span>{c.price*c.qty}</span></div>))}
          </div>
          <div style={{display:"flex", justifyContent:"space-between", fontWeight:"bold", fontSize:16}}><span>TOTAL</span><span>KES {receipt.total}</span></div>
          <div style={{textAlign:"center", marginTop:15, borderTop:"2px dashed black", paddingTop:10}}>
            <div>*** ASANTE SANA! ***</div>
            <div>Karibu Tena</div>
            <div style={{marginTop:10, fontSize:10}}>Powered by DukaPulse</div>
          </div>
          <div className="no-print" style={{display:"flex", gap:8, marginTop:20}}>
             <button onClick={()=>window.print()} style={{flex:1, background:"black", color:"white", padding:12, borderRadius:8, border:"none", fontWeight:700}}>Print Again</button>
             <button onClick={closeReceipt} className="no-print" style={{flex:1, background:"#e5e7eb", padding:12, borderRadius:8, border:"none"}}>Close & New Sale</button>
          </div>
        </div>
      )}

      {receipt && (
        <div className="no-print" style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
          <div style={{background:"white", padding:20, borderRadius:12, maxWidth:360, width:"100%", fontFamily:"monospace"}}>
            <h3 style={{textAlign:"center", marginTop:0}}>MUMIAS HARDWARE RECEIPT</h3>
            <div style={{fontSize:12}}>ID: {receipt.id}<br/>{receipt.date}<br/>Pay: {receipt.phone}</div>
            <hr/>
            {receipt.cart.map(c=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:13}}><span>{c.name} x{c.qty}</span><span>{c.price*c.qty}</span></div>))}
            <hr/>
            <div style={{display:"flex", justifyContent:"space-between", fontWeight:800}}><span>TOTAL</span><span>KES {receipt.total}</span></div>
            <button onClick={()=>window.print()} style={{width:"100%", background:"black", color:"white", padding:12, borderRadius:8, marginTop:12, border:"none", fontWeight:700}}>🖨️ PRINT RECEIPT</button>
            <button onClick={closeReceipt} style={{width:"100%", background:"#f3f4f6", padding:10, borderRadius:8, marginTop:8, border:"none"}}>Close & New Sale</button>
          </div>
        </div>
      )}
    </main>
  );
}
