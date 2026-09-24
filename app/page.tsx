"use client";
import { useState, useEffect } from "react";

type Item = {
  id: number;
  name: string;
  buy: number;
  sell: number;
  stock: number;
  category: string;
};
type CartItem = Item & { qty: number };

const INITIAL_ITEMS: Item[] = [
  { id: 1, name: "Cement - Bamburi 50kg", buy: 600, sell: 750, stock: 120, category: "Cement" },
  { id: 2, name: "Cement - Mombasa 50kg", buy: 580, sell: 730, stock: 100, category: "Cement" },
  { id: 3, name: "Cement - Savannah 50kg", buy: 570, sell: 720, stock: 80, category: "Cement" },
  { id: 4, name: "Iron Sheet - Mabati 2.5m (28G)", buy: 1450, sell: 1800, stock: 60, category: "Iron Sheets" },
  { id: 5, name: "Iron Sheet - Mabati 3.0m (30G)", buy: 1700, sell: 2100, stock: 50, category: "Iron Sheets" },
  { id: 6, name: "Iron Sheet - Versatile 2.5m", buy: 1800, sell: 2200, stock: 40, category: "Iron Sheets" },
  { id: 7, name: "Ridge Cap 2m", buy: 500, sell: 650, stock: 30, category: "Iron Sheets" },
  { id: 8, name: "Nails 1 inch - 1kg", buy: 170, sell: 220, stock: 100, category: "Nails" },
  { id: 9, name: "Nails 2 inch - 1kg", buy: 180, sell: 230, stock: 100, category: "Nails" },
  { id: 10, name: "Nails 3 inch - 1kg", buy: 200, sell: 250, stock: 100, category: "Nails" },
  { id: 11, name: "Nails 4 inch - 1kg", buy: 220, sell: 270, stock: 80, category: "Nails" },
  { id: 12, name: "Roofing Nails - 1kg", buy: 280, sell: 350, stock: 60, category: "Nails" },
  { id: 13, name: "Timber 2x2 - Cypress 12ft", buy: 280, sell: 350, stock: 80, category: "Timber" },
  { id: 14, name: "Timber 2x3 - Cypress 12ft", buy: 360, sell: 450, stock: 80, category: "Timber" },
  { id: 15, name: "Timber 2x4 - Cypress 12ft", buy: 480, sell: 600, stock: 60, category: "Timber" },
  { id: 16, name: "Timber 3x3 - Cypress 12ft", buy: 560, sell: 700, stock: 50, category: "Timber" },
  { id: 17, name: "Plywood 4x8 - 3mm", buy: 950, sell: 1200, stock: 30, category: "Timber" },
  { id: 18, name: "Plywood 4x8 - 6mm", buy: 1450, sell: 1800, stock: 30, category: "Timber" },
  { id: 19, name: "Paint - Dulux 4L White", buy: 2600, sell: 3200, stock: 30, category: "Paint" },
  { id: 20, name: "Paint - Dulux 4L Cream", buy: 2600, sell: 3200, stock: 20, category: "Paint" },
  { id: 21, name: "Paint - Crown 4L White", buy: 2200, sell: 2800, stock: 25, category: "Paint" },
  { id: 22, name: "Primer - Undercoat 4L", buy: 1600, sell: 2000, stock: 20, category: "Paint" },
  { id: 23, name: "Thinner - 1L", buy: 320, sell: 400, stock: 40, category: "Paint" },
  { id: 24, name: "Paint Brush 3 inch", buy: 100, sell: 150, stock: 50, category: "Paint" },
  { id: 25, name: "Roller Brush Complete", buy: 250, sell: 350, stock: 30, category: "Paint" },
  { id: 26, name: "PVC Pipe 1/2 inch - 4m", buy: 250, sell: 350, stock: 40, category: "Plumbing" },
  { id: 27, name: "PVC Pipe 3/4 inch - 4m", buy: 380, sell: 500, stock: 40, category: "Plumbing" },
  { id: 28, name: "PVC Elbow 1/2 inch", buy: 15, sell: 30, stock: 100, category: "Plumbing" },
  { id: 29, name: "Tap - Kitchen Mixer", buy: 1200, sell: 1500, stock: 20, category: "Plumbing" },
  { id: 30, name: "Toilet Seat Complete", buy: 3800, sell: 4500, stock: 10, category: "Plumbing" },
  { id: 31, name: "Water Tank 1000L", buy: 7200, sell: 8500, stock: 5, category: "Plumbing" },
  { id: 32, name: "Wire - 1.5mm 100m Roll", buy: 2000, sell: 2500, stock: 15, category: "Electrical" },
  { id: 33, name: "Wire - 2.5mm 100m Roll", buy: 2800, sell: 3500, stock: 15, category: "Electrical" },
  { id: 34, name: "Socket - Single", buy: 80, sell: 120, stock: 60, category: "Electrical" },
  { id: 35, name: "Switch - Single", buy: 60, sell: 100, stock: 60, category: "Electrical" },
  { id: 36, name: "Bulb - LED 12W", buy: 180, sell: 250, stock: 80, category: "Electrical" },
  { id: 37, name: "Hinges - Door 4 inch (pair)", buy: 120, sell: 180, stock: 200, category: "Fittings" },
  { id: 38, name: "Door Lock - Union", buy: 900, sell: 1200, stock: 30, category: "Fittings" },
  { id: 39, name: "Padlock 40mm", buy: 350, sell: 450, stock: 40, category: "Fittings" },
  { id: 40, name: "Door Handle - Aluminium", buy: 450, sell: 600, stock: 25, category: "Fittings" },
  { id: 41, name: "Hammer - 16oz", buy: 500, sell: 650, stock: 20, category: "Tools" },
  { id: 42, name: "Panga - Standard", buy: 350, sell: 450, stock: 30, category: "Tools" },
  { id: 43, name: "Shovel", buy: 650, sell: 850, stock: 20, category: "Tools" },
  { id: 44, name: "Wheelbarrow", buy: 4500, sell: 5500, stock: 8, category: "Tools" },
  { id: 45, name: "Measuring Tape 5m", buy: 250, sell: 350, stock: 30, category: "Tools" },
  { id: 46, name: "Wire Mesh - Chicken 1m x 20m", buy: 950, sell: 1200, stock: 15, category: "Fencing" },
  { id: 47, name: "Barbed Wire - 25kg", buy: 3800, sell: 4500, stock: 10, category: "Fencing" },
  { id: 48, name: "Binding Wire - 1kg", buy: 150, sell: 200, stock: 50, category: "Steel" },
  { id: 49, name: "Steel Bar Y12 - 12m", buy: 900, sell: 1100, stock: 40, category: "Steel" },
  { id: 50, name: "Steel Bar Y10 - 12m", buy: 700, sell: 850, stock: 40, category: "Steel" },
  { id: 51, name: "Sand - Tonne", buy: 1800, sell: 2500, stock: 999, category: "Aggregates" },
  { id: 52, name: "Ballast - Tonne", buy: 2000, sell: 2800, stock: 999, category: "Aggregates" },
];

export default function Page() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [salesToday, setSalesToday] = useState(0);
  const [profitToday, setProfitToday] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showProfit, setShowProfit] = useState(false);
  const [pin, setPin] = useState("");
  const [newItem, setNewItem] = useState({ name: "", buy: "", sell: "", stock: "", category: "General" });

  useEffect(()=>{
    const saved = localStorage.getItem("dukapulse_stock_v4_full");
    const savedSales = localStorage.getItem("dukapulse_sales_today_v4");
    const savedProfit = localStorage.getItem("dukapulse_profit_today_v4");
    if(saved) setItems(JSON.parse(saved));
    if(savedSales) setSalesToday(Number(savedSales));
    if(savedProfit) setProfitToday(Number(savedProfit));
  }, []);

  const saveStock = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("dukapulse_stock_v4_full", JSON.stringify(newItems));
  };

  const addManualItem = () => {
    if (!newItem.name || !newItem.buy || !newItem.sell) return alert("Jaza kila kitu!");
    const item: Item = {
      id: Date.now(),
      name: newItem.name,
      buy: parseInt(newItem.buy),
      sell: parseInt(newItem.sell),
      stock: parseInt(newItem.stock) || 10,
      category: newItem.category || "General",
    };
    const updated = [item, ...items];
    saveStock(updated);
    setNewItem({ name: "", buy: "", sell: "", stock: "", category: "General" });
    setShowAdd(false);
    setStatus(`✅ Added ${item.name}`);
  };

  const categories = ["All", ...Array.from(new Set(items.map(i=>i.category)))];
  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category==="All" || i.category===category;
    return matchSearch && matchCat;
  });

  const addToCart = (item: Item) => {
    if(item.stock<=0) return alert("Out of stock");
    setCart(prev => {
      const f = prev.find(p=>p.id===item.id);
      if(f) return prev.map(p=>p.id===item.id?{...p, qty:p.qty+1}:p);
      return [...prev, {...item, qty:1}];
    });
  };

  const totalSell = cart.reduce((s,i)=>s+i.sell*i.qty,0);
  const totalBuy = cart.reduce((s,i)=>s+i.buy*i.qty,0);
  const totalProfit = totalSell - totalBuy;

  const handleSale = async () => {
    if(cart.length===0) return alert("Cart empty!");
    if(!mpesaPhone || mpesaPhone.length < 10) {
      if(!confirm("No M-Pesa. Cash sale?")) return;
      completeSale("CASH"); return;
    }
    setLoading(true); setStatus("STK Push to "+mpesaPhone+"...");
    try {
      await fetch("/api/mpesa", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ phone: mpesaPhone, amount: totalSell }) });
      setStatus("✅ STK Sent! Awaiting PIN...");
      setTimeout(()=>completeSale("M-PESA"), 2000);
    } catch{ completeSale("M-PESA"); }
  };

  const completeSale = (method: string) => {
    let newItems = [...items];
    cart.forEach(c=>{ newItems = newItems.map(it=> it.id===c.id ? {...it, stock: it.stock - c.qty} : it); });
    saveStock(newItems);
    const newSales = salesToday + totalSell;
    const newProfit = profitToday + totalProfit;
    setSalesToday(newSales);
    setProfitToday(newProfit);
    localStorage.setItem("dukapulse_sales_today_v4", String(newSales));
    localStorage.setItem("dukapulse_profit_today_v4", String(newProfit));
    const rec = { id:"RCPT-"+Date.now().toString().slice(-6), date:new Date().toLocaleString(), cart:[...cart], total: totalSell, profit: totalProfit, phone: mpesaPhone || "CASH", method };
    setReceipt(rec); setLoading(false); setStatus(`✅ ${method} Paid! Profit KES ${totalProfit}`);
    setTimeout(()=>window.print(), 400);
  };

  const closeReceipt = () => { setReceipt(null); setCart([]); setMpesaPhone(""); setStatus(""); };

  return (
    <main style={{fontFamily:"system-ui", padding:12, maxWidth:1300, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <style>{`@media print {.no-print{display:none!important}.print-only{display:block!important}} @media screen {.print-only{display:none}}`}</style>
      
      <div className="no-print" style={{background:"linear-gradient(135deg,#000,#2563eb)", color:"white", padding:16, borderRadius:14, marginBottom:12}}>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10}}>
          <div><h1 style={{margin:0, fontSize:20, fontWeight:900}}>DUKAPULSE POS PRO - MUMIAS</h1><p style={{margin:"4px 0 0 0", fontSize:12, opacity:0.9}}>{items.length} Items ● Sales Today KES {salesToday.toLocaleString()} ● Profit Today KES {profitToday.toLocaleString()} ● {status || "Ready"}</p></div>
          <div style={{display:"flex", gap:8}}>
            <button onClick={()=>setShowAdd(!showAdd)} style={{background:"#facc15", color:"black", padding:"6px 14px", borderRadius:20, fontWeight:800, fontSize:12, border:"none", cursor:"pointer"}}>+ ADD MATERIAL</button>
            <button onClick={()=>setShowProfit(true)} style={{background:"#000", color:"#facc15", border:"1px solid #facc15", padding:"6px 14px", borderRadius:20, fontWeight:800, fontSize:12, cursor:"pointer"}}>🔒 MY PROFIT</button>
          </div>
        </div>
        <div style={{display:"flex", gap:6, marginTop:10, flexWrap:"wrap"}}>
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setCategory(cat)} style={{background: category===cat?"white":"rgba(255,255,255,0.2)", color: category===cat?"black":"white", border:"none", padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer"}}>{cat}</button>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="no-print" style={{background:"white", border:"2px solid #facc15", padding:15, borderRadius:12, marginBottom:12}}>
          <h3 style={{marginTop:0}}>Add New Material</h3>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
            <input placeholder="Name e.g. Hammer" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd", gridColumn:"1 / -1" }} />
            <input placeholder="Buying Price" type="number" value={newItem.buy} onChange={e => setNewItem({...newItem, buy: e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
            <input placeholder="Selling Price" type="number" value={newItem.sell} onChange={e => setNewItem({...newItem, sell: e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
            <input placeholder="Stock Qty" type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
            <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid #ddd" }} />
          </div>
          <button onClick={addManualItem} style={{ background: "#000", color: "#fff", padding: 12, width: "100%", borderRadius: 8, marginTop: 10, fontWeight:800, border:"none", cursor:"pointer" }}>Save Material ✅</button>
        </div>
      )}

      {showProfit && (
        <div className="no-print" style={{background:"#000", color:"#facc15", padding:16, borderRadius:12, marginBottom:12, border:"2px solid #facc15"}}>
          {pin !== "1234" ? (
            <div>
              <h3 style={{marginTop:0}}>🔒 Enter Owner PIN</h3>
              <div style={{display:"flex", gap:8}}>
                <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN = 1234" style={{padding:10, borderRadius:8, flex:1}}/>
                <button onClick={()=> { if(pin!=="1234") alert("Wrong PIN!"); }} style={{padding:"10px 15px", borderRadius:8, background:"#facc15", fontWeight:800}}>Unlock</button>
                <button onClick={()=>setShowProfit(false)} style={{padding:"10px 15px", borderRadius:8}}>Close</button>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{marginTop:0}}>💰 SECRET PROFIT DASHBOARD (Only You)</h3>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
                <div style={{background:"#111", padding:12, borderRadius:8}}><div style={{fontSize:11}}>THIS CART</div><div style={{fontSize:16, fontWeight:900}}>Sales KES {totalSell.toLocaleString()}</div><div style={{fontSize:12}}>Cost KES {totalBuy.toLocaleString()}</div></div>
                <div style={{background:"#111", padding:12, borderRadius:8}}><div style={{fontSize:11}}>TODAY TOTALS</div><div style={{fontSize:16}}>Sales KES {salesToday.toLocaleString()}</div><div style={{fontSize:12}}>Profit KES {profitToday.toLocaleString()}</div></div>
                <div style={{background:"#facc15", color:"black", padding:12, borderRadius:8}}><div style={{fontSize:11}}>PROFIT THIS CART</div><div style={{fontSize:20, fontWeight:900}}>KES {totalProfit.toLocaleString()}</div><div style={{fontSize:11}}>{totalSell? ((totalProfit/totalSell)*100).toFixed(1):0}% margin</div></div>
              </div>
              <div style={{marginTop:12, display:"flex", gap:8, alignItems:"center"}}>
                <button onClick={()=> { setShowProfit(false); setPin(""); }} style={{background:"#facc15", color:"black", padding:"8px 16px", borderRadius:8, fontWeight:800, border:"none"}}>Lock 🔒</button>
                <button onClick={()=> { if(confirm("Reset today sales & profit to 0?")){ setSalesToday(0); setProfitToday(0); localStorage.removeItem("dukapulse_sales_today_v4"); localStorage.removeItem("dukapulse_profit_today_v4"); } }} style={{background:"#333", color:"white", padding:"8px 12px", borderRadius:8, fontSize:11}}>Reset Today</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="no-print" style={{display:"grid", gridTemplateColumns:"2.2fr 1fr", gap:12}}>
        <div style={{background:"white", borderRadius:12, padding:10}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${items.length} items... cement, mabati, paint...`} style={{width:"100%", padding:12, borderRadius:8, border:"2px solid #e5e7eb", marginBottom:10}}/>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:"75vh", overflowY:"auto"}}>
            {filtered.map(item=>(
              <div key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:10, border:"1px solid #eee", borderRadius:10, background: item.stock<5?"#fef2f2":"white"}}>
                <div style={{flex:1}}><div style={{fontWeight:700, fontSize:12}}>{item.name}</div><div style={{fontSize:10, color: item.stock<10?"red":"#666"}}>{item.category} • Stock {item.stock} • <b>KES {item.sell}</b></div></div>
                <button disabled={item.stock===0} onClick={()=>addToCart(item)} style={{background: item.stock===0?"#ddd":"#facc15", border:"none", padding:"6px 10px", borderRadius:8, fontWeight:800, fontSize:11, cursor:"pointer", marginLeft:6}}>{item.stock===0?"Out":"+"}</button>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"white", borderRadius:12, padding:12, height:"fit-content", position:"sticky", top:10}}>
          <h3 style={{marginTop:0, fontSize:16}}>Cart: {cart.reduce((s,i)=>s+i.qty,0)} items</h3>
          <div style={{maxHeight:200, overflowY:"auto"}}>
            {cart.map(c=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5}}><span>{c.name.slice(0,22)} x{c.qty}</span><span>KES {c.sell*c.qty}</span></div>))}
            {cart.length===0 && <div style={{fontSize:12, color:"#888"}}>No items yet</div>}
          </div>
          <hr/>
          <h2 style={{margin:"8px 0"}}>Total: KES {totalSell.toLocaleString()}</h2>
          <p style={{fontSize:11, color:"#666", margin:0}}>Customer sees only this. Profit hidden.</p>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="07xx M-Pesa / empty=CASH" style={{width:"100%", padding:11, borderRadius:8, border:"2px solid black", margin:"8px 0", fontSize:13}}/>
          {status && <div style={{background:"#dbeafe", padding:6, borderRadius:6, fontSize:11, marginBottom:6}}>{status}</div>}
          <button disabled={loading} onClick={handleSale} style={{width:"100%", background: loading?"#9ca3af":"#000", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:900, cursor:"pointer"}}>{loading?"⏳...":"LIPA NA M-PESA / CASH"}</button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:6, background:"#f3f4f6", border:"none", padding:9, borderRadius:8, cursor:"pointer", fontSize:12}}>Clear Cart</button>
        </div>
      </div>

      {receipt && (
        <div className="no-print" style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:9999}}>
          <div style={{background:"white", padding:18, borderRadius:12, maxWidth:360, width:"100%", fontFamily:"monospace"}}>
            <h3 style={{textAlign:"center", margin:0}}>MUMIAS HARDWARE ✅</h3>
            <div style={{fontSize:11, margin:"6px 0", textAlign:"center"}}>{receipt.id}<br/>{receipt.date}<br/>{receipt.method} - {receipt.phone}</div><hr/>
            {receipt.cart.map((c:any)=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:11}}><span>{c.name.slice(0,25)} x{c.qty}</span><span>{c.sell*c.qty}</span></div>))}<hr/>
            <div style={{display:"flex", justifyContent:"space-between", fontWeight:900}}><span>TOTAL</span><span>KES {receipt.total}</span></div>
            <div style={{fontSize:9, textAlign:"center", marginTop:8, color:"#666"}}>Thank you! Profit hidden.</div>
            <button onClick={()=>window.print()} style={{width:"100%", background:"black", color:"white", padding:12, borderRadius:8, marginTop:10, border:"none", fontWeight:800}}>🖨️ PRINT RECEIPT</button>
            <button onClick={closeReceipt} style={{width:"100%", background:"#2563eb", color:"white", padding:10, borderRadius:8, marginTop:6, border:"none"}}>New Sale</button>
          </div>
        </div>
      )}
    </main>
  );
}
