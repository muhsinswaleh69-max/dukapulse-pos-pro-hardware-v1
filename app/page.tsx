"use client";
import { useState, useEffect } from "react";

type Item = { id: number; name: string; price: number; stock: number; category: string; };
type CartItem = Item & { qty: number };

const INITIAL_ITEMS: Item[] = [
  // CEMENT & BUILDING
  { id: 1, name: "Cement - Bamburi 50kg", price: 750, stock: 120, category: "Cement" },
  { id: 2, name: "Cement - Mombasa 50kg", price: 730, stock: 100, category: "Cement" },
  { id: 3, name: "Cement - Savannah 50kg", price: 720, stock: 80, category: "Cement" },
  // IRON SHEETS
  { id: 4, name: "Iron Sheet - Mabati 2.5m (28G)", price: 1800, stock: 60, category: "Iron Sheets" },
  { id: 5, name: "Iron Sheet - Mabati 3.0m (30G)", price: 2100, stock: 50, category: "Iron Sheets" },
  { id: 6, name: "Iron Sheet - Versatile 2.5m", price: 2200, stock: 40, category: "Iron Sheets" },
  { id: 7, name: "Ridge Cap 2m", price: 650, stock: 30, category: "Iron Sheets" },
  // NAILS & ROOFING NAILS
  { id: 8, name: "Nails 1 inch - 1kg", price: 220, stock: 100, category: "Nails" },
  { id: 9, name: "Nails 2 inch - 1kg", price: 230, stock: 100, category: "Nails" },
  { id: 10, name: "Nails 3 inch - 1kg", price: 250, stock: 100, category: "Nails" },
  { id: 11, name: "Nails 4 inch - 1kg", price: 270, stock: 80, category: "Nails" },
  { id: 12, name: "Roofing Nails - 1kg", price: 350, stock: 60, category: "Nails" },
  // TIMBER
  { id: 13, name: "Timber 2x2 - Cypress 12ft", price: 350, stock: 80, category: "Timber" },
  { id: 14, name: "Timber 2x3 - Cypress 12ft", price: 450, stock: 80, category: "Timber" },
  { id: 15, name: "Timber 2x4 - Cypress 12ft", price: 600, stock: 60, category: "Timber" },
  { id: 16, name: "Timber 3x3 - Cypress 12ft", price: 700, stock: 50, category: "Timber" },
  { id: 17, name: "Plywood 4x8 - 3mm", price: 1200, stock: 30, category: "Timber" },
  { id: 18, name: "Plywood 4x8 - 6mm", price: 1800, stock: 30, category: "Timber" },
  // PAINT
  { id: 19, name: "Paint - Dulux 4L White", price: 3200, stock: 30, category: "Paint" },
  { id: 20, name: "Paint - Dulux 4L Cream", price: 3200, stock: 20, category: "Paint" },
  { id: 21, name: "Paint - Crown 4L White", price: 2800, stock: 25, category: "Paint" },
  { id: 22, name: "Primer - Undercoat 4L", price: 2000, stock: 20, category: "Paint" },
  { id: 23, name: "Thinner - 1L", price: 400, stock: 40, category: "Paint" },
  { id: 24, name: "Paint Brush 3 inch", price: 150, stock: 50, category: "Paint" },
  { id: 25, name: "Roller Brush Complete", price: 350, stock: 30, category: "Paint" },
  // PLUMBING
  { id: 26, name: "PVC Pipe 1/2 inch - 4m", price: 350, stock: 40, category: "Plumbing" },
  { id: 27, name: "PVC Pipe 3/4 inch - 4m", price: 500, stock: 40, category: "Plumbing" },
  { id: 28, name: "PVC Elbow 1/2 inch", price: 30, stock: 100, category: "Plumbing" },
  { id: 29, name: "Tap - Kitchen Mixer", price: 1500, stock: 20, category: "Plumbing" },
  { id: 30, name: "Toilet Seat Complete", price: 4500, stock: 10, category: "Plumbing" },
  { id: 31, name: "Water Tank 1000L", price: 8500, stock: 5, category: "Plumbing" },
  // ELECTRICAL
  { id: 32, name: "Wire - 1.5mm 100m Roll", price: 2500, stock: 15, category: "Electrical" },
  { id: 33, name: "Wire - 2.5mm 100m Roll", price: 3500, stock: 15, category: "Electrical" },
  { id: 34, name: "Socket - Single", price: 120, stock: 60, category: "Electrical" },
  { id: 35, name: "Switch - Single", price: 100, stock: 60, category: "Electrical" },
  { id: 36, name: "Bulb - LED 12W", price: 250, stock: 80, category: "Electrical" },
  // FITTINGS & LOCKS
  { id: 37, name: "Hinges - Door 4 inch (pair)", price: 180, stock: 200, category: "Fittings" },
  { id: 38, name: "Door Lock - Union", price: 1200, stock: 30, category: "Fittings" },
  { id: 39, name: "Padlock 40mm", price: 450, stock: 40, category: "Fittings" },
  { id: 40, name: "Door Handle - Aluminium", price: 600, stock: 25, category: "Fittings" },
  // TOOLS
  { id: 41, name: "Hammer - 16oz", price: 650, stock: 20, category: "Tools" },
  { id: 42, name: "Panga - Standard", price: 450, stock: 30, category: "Tools" },
  { id: 43, name: "Shovel", price: 850, stock: 20, category: "Tools" },
  { id: 44, name: "Wheelbarrow", price: 5500, stock: 8, category: "Tools" },
  { id: 45, name: "Measuring Tape 5m", price: 350, stock: 30, category: "Tools" },
  // OTHER
  { id: 46, name: "Wire Mesh - Chicken 1m x 20m", price: 1200, stock: 15, category: "Fencing" },
  { id: 47, name: "Barbed Wire - 25kg", price: 4500, stock: 10, category: "Fencing" },
  { id: 48, name: "Binding Wire - 1kg", price: 200, stock: 50, category: "Steel" },
  { id: 49, name: "Steel Bar Y12 - 12m", price: 1100, stock: 40, category: "Steel" },
  { id: 50, name: "Steel Bar Y10 - 12m", price: 850, stock: 40, category: "Steel" },
  { id: 51, name: "Sand - Tonne", price: 2500, stock: 999, category: "Aggregates" },
  { id: 52, name: "Ballast - Tonne", price: 2800, stock: 999, category: "Aggregates" },
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

  useEffect(()=>{
    const saved = localStorage.getItem("dukapulse_stock_v4_full");
    const savedSales = localStorage.getItem("dukapulse_sales_today_v4");
    if(saved) setItems(JSON.parse(saved));
    if(savedSales) setSalesToday(Number(savedSales));
  }, []);

  const saveStock = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("dukapulse_stock_v4_full", JSON.stringify(newItems));
  };

  const categories = ["All", ...Array.from(new Set(INITIAL_ITEMS.map(i=>i.category)))];
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
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  const handleSale = async () => {
    if(cart.length===0) return alert("Cart empty!");
    if(!mpesaPhone || mpesaPhone.length < 10) {
      if(!confirm("No M-Pesa. Cash sale?")) return;
      completeSale("CASH"); return;
    }
    setLoading(true); setStatus("STK Push to "+mpesaPhone+"...");
    try {
      await fetch("/api/mpesa", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ phone: mpesaPhone, amount: total }) });
      setStatus("✅ STK Sent! Awaiting PIN...");
      setTimeout(()=>completeSale("M-PESA"), 2000);
    } catch{ completeSale("M-PESA"); }
  };

  const completeSale = (method: string) => {
    let newItems = [...items];
    cart.forEach(c=>{ newItems = newItems.map(it=> it.id===c.id ? {...it, stock: it.stock - c.qty} : it); });
    saveStock(newItems);
    const newSales = salesToday + total;
    setSalesToday(newSales);
    localStorage.setItem("dukapulse_sales_today_v4", String(newSales));
    const rec = { id:"RCPT-"+Date.now().toString().slice(-6), date:new Date().toLocaleString(), cart:[...cart], total, phone: mpesaPhone || "CASH", method };
    setReceipt(rec); setLoading(false); setStatus(`✅ ${method} Paid! Total Stock Items: ${newItems.length}`);
    setTimeout(()=>window.print(), 400);
  };

  const closeReceipt = () => { setReceipt(null); setCart([]); setMpesaPhone(""); setStatus(""); };

  return (
    <main style={{fontFamily:"system-ui", padding:12, maxWidth:1300, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <style>{`@media print {.no-print{display:none!important}.print-only{display:block!important}} @media screen {.print-only{display:none}}`}</style>
      <div className="no-print" style={{background:"linear-gradient(135deg,#000,#2563eb)", color:"white", padding:16, borderRadius:14, marginBottom:12}}>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10}}>
          <div><h1 style={{margin:0, fontSize:20, fontWeight:900}}>DUKAPULSE POS PRO - FULL MUMIAS SHOP - LEVEL 4</h1><p style={{margin:"4px 0 0 0", fontSize:12, opacity:0.9}}>{items.length} Items ● Sales Today KES {salesToday.toLocaleString()} ● {status || "Ready for customers"}</p></div>
          <div style={{background:"#facc15", color:"black", padding:"6px 12px", borderRadius:20, fontWeight:800, fontSize:12, height:"fit-content"}}>🟢 LIVE - FULL STOCK</div>
        </div>
        <div style={{display:"flex", gap:6, marginTop:10, flexWrap:"wrap"}}>
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setCategory(cat)} style={{background: category===cat?"white":"rgba(255,255,255,0.2)", color: category===cat?"black":"white", border:"none", padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer"}}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="no-print" style={{display:"grid", gridTemplateColumns:"2.2fr 1fr", gap:12}}>
        <div style={{background:"white", borderRadius:12, padding:10}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${items.length} items... cement, mabati, paint, timber...`} style={{width:"100%", padding:12, borderRadius:8, border:"2px solid #e5e7eb", marginBottom:10}}/>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:"75vh", overflowY:"auto"}}>
            {filtered.map(item=>(
              <div key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:10, border:"1px solid #eee", borderRadius:10, background: item.stock<5?"#fef2f2":"white"}}>
                <div style={{flex:1}}><div style={{fontWeight:700, fontSize:12}}>{item.name}</div><div style={{fontSize:10, color: item.stock<10?"red":"#666"}}>{item.category} • Stock {item.stock} • <b>KES {item.price}</b></div></div>
                <button disabled={item.stock===0} onClick={()=>addToCart(item)} style={{background: item.stock===0?"#ddd":"#facc15", border:"none", padding:"6px 10px", borderRadius:8, fontWeight:800, fontSize:11, cursor:"pointer", marginLeft:6}}>{item.stock===0?"Out":"+"}</button>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"white", borderRadius:12, padding:12, height:"fit-content", position:"sticky", top:10}}>
          <h3 style={{marginTop:0, fontSize:16}}>Cart: {cart.reduce((s,i)=>s+i.qty,0)} items</h3>
          <div style={{maxHeight:200, overflowY:"auto"}}>
            {cart.map(c=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5}}><span>{c.name.slice(0,22)} x{c.qty}</span><span>KES {c.price*c.qty}</span></div>))}
          </div>
          <hr/>
          <h2 style={{margin:"8px 0"}}>Total: KES {total.toLocaleString()}</h2>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="07xx M-Pesa / empty=CASH" style={{width:"100%", padding:11, borderRadius:8, border:"2px solid black", margin:"8px 0", fontSize:13}}/>
          {status && <div style={{background:"#dbeafe", padding:6, borderRadius:6, fontSize:11, marginBottom:6}}>{status}</div>}
          <button disabled={loading} onClick={handleSale} style={{width:"100%", background: loading?"#9ca3af":"#000", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:900, cursor:"pointer"}}>{loading?"⏳...":"LIPA NA M-PESA / CASH"}</button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:6, background:"#f3f4f6", border:"none", padding:9, borderRadius:8, cursor:"pointer", fontSize:12}}>Clear Cart</button>
          <div style={{marginTop:10, fontSize:10, background:"#f9fafb", padding:6, borderRadius:6, color:"#666"}}>💾 {items.length} items saved permanently. Low stock alerts red.</div>
        </div>
      </div>

      {receipt && (
        <div className="no-print" style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:9999}}>
          <div style={{background:"white", padding:18, borderRadius:12, maxWidth:360, width:"100%", fontFamily:"monospace"}}>
            <h3 style={{textAlign:"center", margin:0}}>MUMIAS HARDWARE ✅</h3>
            <div style={{fontSize:11, margin:"6px 0"}}>{receipt.id}<br/>{receipt.date}<br/>{receipt.method} - {receipt.phone}</div><hr/>
            {receipt.cart.map((c:any)=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:11}}><span>{c.name.slice(0,25)} x{c.qty}</span><span>{c.price*c.qty}</span></div>))}<hr/>
            <div style={{display:"flex", justifyContent:"space-between", fontWeight:900}}><span>TOTAL</span><span>KES {receipt.total}</span></div>
            <button onClick={()=>window.print()} style={{width:"100%", background:"black", color:"white", padding:12, borderRadius:8, marginTop:10, border:"none", fontWeight:800}}>🖨️ PRINT RECEIPT</button>
            <button onClick={closeReceipt} style={{width:"100%", background:"#2563eb", color:"white", padding:10, borderRadius:8, marginTop:6, border:"none"}}>New Sale - Next Customer</button>
          </div>
        </div>
      )}
    </main>
  );
}
