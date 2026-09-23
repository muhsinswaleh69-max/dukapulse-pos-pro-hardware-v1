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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const filtered = INITIAL_ITEMS.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const addToCart = (item: Item) => {
    setCart(prev => {
      const f = prev.find(p=>p.id===item.id);
      if(f) return prev.map(p=>p.id===item.id?{...p, qty:p.qty+1}:p);
      return [...prev, {...item, qty:1}];
    });
  };
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  const handleSale = async () => {
    if(cart.length===0) return alert("Cart empty!");
    if(!mpesaPhone || mpesaPhone.length < 10) {
      // Cash sale
      if(!confirm("No M-Pesa phone. Process as CASH sale?")) return;
      setReceipt({ id:"RCPT-"+Date.now().toString().slice(-6), date:new Date().toLocaleString(), cart:[...cart], total, phone:"CASH", method:"CASH" });
      setTimeout(()=>window.print(), 300);
      return;
    }
    setLoading(true);
    setStatus("Sending STK Push to "+mpesaPhone+"...");
    try {
      const res = await fetch("/api/mpesa", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ phone: mpesaPhone, amount: total })
      });
      const data = await res.json();
      setStatus("✅ STK Push Sent! Ask customer to enter PIN on phone: "+mpesaPhone);
      // Simulate payment success after 3 sec
      setTimeout(()=>{
        setReceipt({ id:"RCPT-"+Date.now().toString().slice(-6), date:new Date().toLocaleString(), cart:[...cart], total, phone:mpesaPhone, method:"M-PESA", checkoutId: data.checkoutId });
        setLoading(false);
        setStatus("✅ M-Pesa Paid! Printing receipt...");
        setTimeout(()=>window.print(), 500);
      }, 3000);
    } catch(e){
      setLoading(false);
      setStatus("❌ Failed. Try again. But you can still print cash receipt.");
      alert("M-Pesa API error, but we can still print cash receipt");
    }
  };

  const closeReceipt = () => { setReceipt(null); setCart([]); setMpesaPhone(""); setStatus(""); };

  return (
    <main style={{fontFamily:"system-ui", padding:16, maxWidth:1200, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <style>{`@media print {.no-print{display:none!important}.print-only{display:block!important}} @media screen {.print-only{display:none}}`}</style>
      <div className="no-print" style={{background:"linear-gradient(135deg,#2563eb,#1e40af)", color:"white", padding:20, borderRadius:16, marginBottom:16}}>
        <h1 style={{margin:0, fontSize:24, fontWeight:800}}>DUKAPULSE POS PRO - MUMIAS HARDWARE - LEVEL 2 M-PESA</h1>
        <p style={{opacity:0.9, margin:"4px 0 0 0"}}>API: /api/mpesa ✅ Ready ● {status || "Enter phone for STK Push"}</p>
      </div>

      <div className="no-print" style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:16}}>
        <div style={{background:"white", borderRadius:12, padding:12}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:"100%", padding:12, borderRadius:8, border:"1px solid #ddd", marginBottom:12}}/>
          <div style={{display:"grid", gap:8}}>
            {filtered.map(item=>(
              <div key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:12, border:"1px solid #eee", borderRadius:8}}>
                <div><b>{item.name}</b><br/><small>KES {item.price} • Stock {item.stock}</small></div>
                <button onClick={()=>addToCart(item)} style={{background:"#facc15", border:"none", padding:"8px 14px", borderRadius:8, fontWeight:700, cursor:"pointer"}}>Add +</button>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"white", borderRadius:12, padding:12, height:"fit-content"}}>
          <h3>Cart: {cart.reduce((s,i)=>s+i.qty,0)} items</h3>
          {cart.map(c=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:6}}><span>{c.name} x{c.qty}</span><span>KES {c.price*c.qty}</span></div>))}
          <hr/>
          <h2>Total: KES {total.toLocaleString()}</h2>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="M-Pesa 07xxxxxxxx or leave empty for CASH" style={{width:"100%", padding:12, borderRadius:8, border:"2px solid #16a34a", margin:"8px 0"}}/>
          {status && <div style={{background:"#dcfce7", padding:8, borderRadius:8, fontSize:13, marginBottom:8}}>{status}</div>}
          <button disabled={loading} onClick={handleSale} style={{width:"100%", background: loading?"#9ca3af":"#16a34a", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:800, fontSize:16, cursor:"pointer"}}>
            {loading? "⏳ PROCESSING..." : "LIPA NA M-PESA / CASH"}
          </button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:8, background:"#e5e7eb", border:"none", padding:10, borderRadius:10, cursor:"pointer"}}>Clear</button>
        </div>
      </div>

      {receipt && (
        <>
          <div className="print-only" style={{background:"white", padding:20, maxWidth:320, margin:"0 auto", fontFamily:"monospace", fontSize:12, color:"black"}}>
            <div style={{textAlign:"center", borderBottom:"2px dashed black", paddingBottom:10, marginBottom:10}}>
              <h3 style={{margin:0}}>MUMIAS HARDWARE</h3><div>DukaPulse POS PRO - LEVEL 2</div><div>Mumias Town</div>
            </div>
            <div>Receipt: {receipt.id}<br/>Date: {receipt.date}<br/>Pay: {receipt.phone}<br/>Method: {receipt.method}<br/>{receipt.checkoutId && `Trans: ${receipt.checkoutId}`}</div>
            <div style={{borderTop:"1px dashed black", borderBottom:"1px dashed black", margin:"10px 0", padding:"8px 0"}}>
              {receipt.cart.map((c:any)=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between"}}><span>{c.name} x{c.qty}</span><span>{c.price*c.qty}</span></div>))}
            </div>
            <div style={{display:"flex", justifyContent:"space-between", fontWeight:"bold", fontSize:14}}><span>TOTAL</span><span>KES {receipt.total}</span></div>
            <div style={{textAlign:"center", marginTop:15, borderTop:"2px dashed black", paddingTop:10}}>ASANTE SANA! Karibu Tena<br/>Paid via {receipt.method}</div>
          </div>

          <div className="no-print" style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
            <div style={{background:"white", padding:20, borderRadius:12, maxWidth:360, width:"100%", fontFamily:"monospace"}}>
              <h3 style={{textAlign:"center", margin:0}}>PAYMENT SUCCESS ✅</h3>
              <div style={{fontSize:12, margin:"10px 0"}}>ID: {receipt.id}<br/>{receipt.date}<br/>Method: {receipt.method}<br/>Phone: {receipt.phone}</div>
              <hr/>
              {receipt.cart.map((c:any)=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:13}}><span>{c.name} x{c.qty}</span><span>{c.price*c.qty}</span></div>))}
              <hr/>
              <div style={{display:"flex", justifyContent:"space-between", fontWeight:800}}><span>TOTAL</span><span>KES {receipt.total}</span></div>
              <button onClick={()=>window.print()} style={{width:"100%", background:"black", color:"white", padding:12, borderRadius:8, marginTop:12, border:"none", fontWeight:700}}>🖨️ PRINT RECEIPT</button>
              <button onClick={closeReceipt} style={{width:"100%", background:"#16a34a", color:"white", padding:10, borderRadius:8, marginTop:8, border:"none"}}>New Sale</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
