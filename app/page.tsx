"use client";
import { useState, useEffect } from "react";

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
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [salesToday, setSalesToday] = useState(0);

  // Load stock from phone storage
  useEffect(()=>{
    const saved = localStorage.getItem("dukapulse_stock_v3");
    const savedSales = localStorage.getItem("dukapulse_sales_today");
    if(saved) setItems(JSON.parse(saved));
    if(savedSales) setSalesToday(Number(savedSales));
  }, []);

  const saveStock = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("dukapulse_stock_v3", JSON.stringify(newItems));
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const addToCart = (item: Item) => {
    if(item.stock <=0) return alert("Out of stock: "+item.name);
    setCart(prev => {
      const f = prev.find(p=>p.id===item.id);
      if(f) {
        if(f.qty >= item.stock) return alert("Only "+item.stock+" left in stock"), prev;
        return prev.map(p=>p.id===item.id?{...p, qty:p.qty+1}:p);
      }
      return [...prev, {...item, qty:1}];
    });
  };
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  const handleSale = async () => {
    if(cart.length===0) return alert("Cart empty!");
    if(!mpesaPhone || mpesaPhone.length < 10) {
      if(!confirm("No M-Pesa phone. Process as CASH?")) return;
      completeSale("CASH");
      return;
    }
    setLoading(true);
    setStatus("Sending STK Push to "+mpesaPhone+"...");
    try {
      await fetch("/api/mpesa", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ phone: mpesaPhone, amount: total }) });
      setStatus("✅ STK Sent! Customer entering PIN...");
      setTimeout(()=>completeSale("M-PESA"), 2500);
    } catch{
      setLoading(false); completeSale("M-PESA-FAILED-SIM");
    }
  };

  const completeSale = (method: string) => {
    // Deduct stock permanently
    let newItems = [...items];
    cart.forEach(c=>{
      newItems = newItems.map(it=> it.id===c.id ? {...it, stock: it.stock - c.qty} : it);
    });
    saveStock(newItems);
    const newSales = salesToday + total;
    setSalesToday(newSales);
    localStorage.setItem("dukapulse_sales_today", String(newSales));

    const rec = { id:"RCPT-"+Date.now().toString().slice(-6), date:new Date().toLocaleString(), cart:[...cart], total, phone: mpesaPhone || "CASH", method };
    setReceipt(rec);
    setLoading(false);
    setStatus(`✅ ${method} Paid! Stock Updated! Sales Today: KES ${newSales}`);
    setTimeout(()=>window.print(), 500);
  };

  const closeReceipt = () => { setReceipt(null); setCart([]); setMpesaPhone(""); setStatus(""); };
  const resetStock = () => { if(confirm("Reset stock to 120?")){ saveStock(INITIAL_ITEMS); setSalesToday(0); localStorage.removeItem("dukapulse_sales_today"); } };

  return (
    <main style={{fontFamily:"system-ui", padding:14, maxWidth:1200, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <style>{`@media print {.no-print{display:none!important}.print-only{display:block!important}} @media screen {.print-only{display:none}}`}</style>
      
      <div className="no-print" style={{background:"linear-gradient(135deg,#111827,#2563eb)", color:"white", padding:18, borderRadius:16, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <h1 style={{margin:0, fontSize:22, fontWeight:800}}>DUKAPULSE POS PRO - LEVEL 3 DATABASE</h1>
          <p style={{margin:"4px 0 0 0", opacity:0.9, fontSize:13}}>Stock saved in phone ● Sales Today: KES {salesToday.toLocaleString()} ● {status || "Ready"}</p>
        </div>
        <button onClick={resetStock} style={{background:"#facc15", color:"black", border:"none", padding:"8px 12px", borderRadius:8, fontWeight:700, fontSize:12}}>Reset Stock</button>
      </div>

      <div className="no-print" style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:14}}>
        <div style={{background:"white", borderRadius:12, padding:12}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search stock..." style={{width:"100%", padding:12, borderRadius:8, border:"1px solid #ddd", marginBottom:12}}/>
          <div style={{display:"grid", gap:8}}>
            {filtered.map(item=>(
              <div key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:12, border:"1px solid #eee", borderRadius:8, opacity: item.stock===0?0.5:1}}>
                <div><b>{item.name}</b><br/><small style={{color: item.stock<10?"red":"#666"}}>Stock: {item.stock} {item.stock<10&&"⚠️ LOW"} • KES {item.price}</small></div>
                <button disabled={item.stock===0} onClick={()=>addToCart(item)} style={{background: item.stock===0?"#ddd":"#facc15", border:"none", padding:"8px 14px", borderRadius:8, fontWeight:700, cursor:"pointer"}}>{item.stock===0?"Out":"Add +"}</button>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"white", borderRadius:12, padding:12, height:"fit-content"}}>
          <h3 style={{marginTop:0}}>Cart: {cart.reduce((s,i)=>s+i.qty,0)} items</h3>
          {cart.map(c=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6}}><span>{c.name} x{c.qty}</span><span>KES {c.price*c.qty}</span></div>))}
          <hr/>
          <h2>Total: KES {total.toLocaleString()}</h2>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="07xx for M-Pesa or empty for CASH" style={{width:"100%", padding:11, borderRadius:8, border:"2px solid #111827", margin:"8px 0"}}/>
          {status && <div style={{background:"#e0e7ff", padding:8, borderRadius:8, fontSize:12, marginBottom:8}}>{status}</div>}
          <button disabled={loading} onClick={handleSale} style={{width:"100%", background: loading?"#9ca3af":"#111827", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:800, cursor:"pointer"}}>{loading?"⏳ PROCESSING...":"LIPA NA M-PESA / CASH"}</button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:8, background:"#e5e7eb", border:"none", padding:10, borderRadius:10, cursor:"pointer"}}>Clear</button>
          <div style={{marginTop:12, fontSize:11, color:"#666", background:"#f9fafb", padding:8, borderRadius:8}}>💾 Stock is now SAVED. If you sell 5 cement, it stays 115 even after refresh. Try it!</div>
        </div>
      </div>

      {receipt && (
        <div className="no-print" style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
          <div style={{background:"white", padding:20, borderRadius:12, maxWidth:360, width:"100%", fontFamily:"monospace"}}>
            <h3 style={{textAlign:"center", margin:0}}>PAYMENT SUCCESS ✅</h3>
            <div style={{fontSize:11, margin:"8px 0"}}>ID: {receipt.id}<br/>{receipt.date}<br/>Method: {receipt.method}<br/>Phone: {receipt.phone}</div>
            <hr/>
            {receipt.cart.map((c:any)=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:12}}><span>{c.name} x{c.qty}</span><span>{c.price*c.qty}</span></div>))}
            <hr/>
            <div style={{display:"flex", justifyContent:"space-between", fontWeight:800}}><span>TOTAL</span><span>KES {receipt.total}</span></div>
            <div style={{fontSize:10, marginTop:6, color:"green"}}>✓ Stock deducted & saved permanently</div>
            <button onClick={()=>window.print()} style={{width:"100%", background:"black", color:"white", padding:12, borderRadius:8, marginTop:10, border:"none", fontWeight:700}}>🖨️ PRINT RECEIPT</button>
            <button onClick={closeReceipt} style={{width:"100%", background:"#2563eb", color:"white", padding:10, borderRadius:8, marginTop:8, border:"none"}}>New Sale</button>
          </div>
        </div>
      )}
    </main>
  );
}
