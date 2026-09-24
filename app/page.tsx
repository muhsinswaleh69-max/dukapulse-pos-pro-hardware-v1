"use client";
import { useState, useEffect } from "react";
type Item = { id: number; name: string; buy: number; sell: number; stock: number; category: string; };
type CartItem = Item & { qty: number; customSell?: number };

const INITIAL_ITEMS: Item[] = [
  { id: 1, name: "Cement - Nyumba 50kg (Mumias best)", buy: 600, sell: 750, stock: 150, category: "Cement" },
  { id: 2, name: "Cement - Bamburi 50kg", buy: 600, sell: 750, stock: 120, category: "Cement" },
  { id: 3, name: "Cement - Mombasa 50kg", buy: 580, sell: 730, stock: 100, category: "Cement" },
  { id: 4, name: "Cement - Savannah 50kg", buy: 570, sell: 720, stock: 80, category: "Cement" },
  { id: 5, name: "Cement - Ndovu 50kg", buy: 580, sell: 740, stock: 80, category: "Cement" },
  { id: 6, name: "Cement - Simba 50kg", buy: 590, sell: 750, stock: 80, category: "Cement" },
  { id: 7, name: "Lime - 20kg", buy: 400, sell: 550, stock: 50, category: "Cement" },
  { id: 8, name: "Iron Sheet - Mabati 2.0m (32G)", buy: 1100, sell: 1400, stock: 60, category: "Iron Sheets" },
  { id: 9, name: "Iron Sheet - Mabati 2.5m (30G)", buy: 1450, sell: 1800, stock: 60, category: "Iron Sheets" },
  { id: 10, name: "Iron Sheet - Mabati 3.0m (28G)", buy: 1700, sell: 2100, stock: 50, category: "Iron Sheets" },
  { id: 11, name: "Iron Sheet - Versatile 2.5m Brown", buy: 1800, sell: 2200, stock: 40, category: "Iron Sheets" },
  { id: 12, name: "Ridge Cap 2m - Colored", buy: 500, sell: 650, stock: 30, category: "Iron Sheets" },
  { id: 13, name: "Box Profile 3m - Charcoal", buy: 2400, sell: 2900, stock: 30, category: "Iron Sheets" },
  { id: 14, name: "Nails 1 inch - 1kg", buy: 170, sell: 220, stock: 100, category: "Nails" },
  { id: 15, name: "Nails 2 inch - 1kg", buy: 180, sell: 230, stock: 100, category: "Nails" },
  { id: 16, name: "Nails 3 inch - 1kg", buy: 200, sell: 250, stock: 100, category: "Nails" },
  { id: 17, name: "Nails 4 inch - 1kg", buy: 220, sell: 270, stock: 80, category: "Nails" },
  { id: 18, name: "Roofing Nails - 1kg", buy: 280, sell: 350, stock: 60, category: "Nails" },
  { id: 19, name: "Binding Wire - 1kg", buy: 150, sell: 200, stock: 80, category: "Nails" },
  { id: 20, name: "Timber 2x2 - Cypress 12ft", buy: 280, sell: 350, stock: 80, category: "Timber" },
  { id: 21, name: "Timber 2x3 - Cypress 12ft", buy: 360, sell: 450, stock: 80, category: "Timber" },
  { id: 22, name: "Timber 2x4 - Cypress 12ft", buy: 480, sell: 600, stock: 60, category: "Timber" },
  { id: 23, name: "Plywood 4x8 - 3mm", buy: 950, sell: 1200, stock: 30, category: "Timber" },
  { id: 24, name: "Plywood 4x8 - 6mm", buy: 1450, sell: 1800, stock: 30, category: "Timber" },
  { id: 25, name: "Ceiling Board 2x4 - Soft", buy: 250, sell: 350, stock: 100, category: "Timber" },
  { id: 26, name: "Paint - Dulux 4L White", buy: 2600, sell: 3200, stock: 30, category: "Paint" },
  { id: 27, name: "Paint - Crown 4L White", buy: 2200, sell: 2800, stock: 25, category: "Paint" },
  { id: 28, name: "Paint - Duracoat 4L Emulsion", buy: 1800, sell: 2300, stock: 25, category: "Paint" },
  { id: 29, name: "Primer - Undercoat 4L", buy: 1600, sell: 2000, stock: 20, category: "Paint" },
  { id: 30, name: "Thinner - 1L", buy: 320, sell: 400, stock: 40, category: "Paint" },
  { id: 31, name: "Roller + Brush Set", buy: 250, sell: 350, stock: 30, category: "Paint" },
  { id: 32, name: "PVC Pipe 1/2 inch - 4m (Heavy)", buy: 250, sell: 350, stock: 50, category: "Plumbing" },
  { id: 33, name: "PVC Pipe 3/4 inch - 4m (Heavy)", buy: 380, sell: 500, stock: 50, category: "Plumbing" },
  { id: 34, name: "PVC Pipe 1 inch - 4m", buy: 550, sell: 700, stock: 40, category: "Plumbing" },
  { id: 35, name: "PPR Pipe 1/2 - 4m (Hot)", buy: 450, sell: 600, stock: 30, category: "Plumbing" },
  { id: 36, name: "PVC Elbow 1/2 inch", buy: 15, sell: 30, stock: 150, category: "Plumbing" },
  { id: 37, name: "PVC Tee 1/2 inch", buy: 20, sell: 35, stock: 150, category: "Plumbing" },
  { id: 38, name: "PVC Tap - Plastic 1/2", buy: 120, sell: 180, stock: 40, category: "Plumbing" },
  { id: 39, name: "Tap - Kitchen Mixer Chrome", buy: 1200, sell: 1500, stock: 20, category: "Plumbing" },
  { id: 40, name: "Tap - Basin Pillar", buy: 900, sell: 1200, stock: 15, category: "Plumbing" },
  { id: 41, name: "Toilet Seat - Complete", buy: 3800, sell: 4500, stock: 10, category: "Plumbing" },
  { id: 42, name: "Wash Basin - White Ceramic", buy: 1800, sell: 2300, stock: 10, category: "Plumbing" },
  { id: 43, name: "Water Tank 1000L - Kentank", buy: 7200, sell: 8500, stock: 5, category: "Plumbing" },
  { id: 44, name: "Water Tank 2000L - Kentank", buy: 13500, sell: 15500, stock: 3, category: "Plumbing" },
  { id: 45, name: "Teflon Tape", buy: 15, sell: 30, stock: 200, category: "Plumbing" },
  { id: 46, name: "Silicone Sealant", buy: 250, sell: 350, stock: 30, category: "Plumbing" },
  { id: 47, name: "Wire - 1.5mm 100m", buy: 2000, sell: 2500, stock: 15, category: "Electrical" },
  { id: 48, name: "Wire - 2.5mm 100m", buy: 2800, sell: 3500, stock: 15, category: "Electrical" },
  { id: 49, name: "Socket - Single MK", buy: 120, sell: 180, stock: 60, category: "Electrical" },
  { id: 50, name: "Switch - Single MK", buy: 100, sell: 150, stock: 60, category: "Electrical" },
  { id: 51, name: "Bulb - LED 12W Philips", buy: 180, sell: 250, stock: 80, category: "Electrical" },
  { id: 52, name: "Extension 4-way", buy: 600, sell: 800, stock: 20, category: "Electrical" },
  { id: 53, name: "Consumer Unit 6-way", buy: 1800, sell: 2200, stock: 10, category: "Electrical" },
  { id: 54, name: "Hinges - Door 4 inch (pair)", buy: 120, sell: 180, stock: 200, category: "Fittings" },
  { id: 55, name: "Door Lock - Union 3 Lever", buy: 900, sell: 1200, stock: 30, category: "Fittings" },
  { id: 56, name: "Padlock 50mm - Brass", buy: 450, sell: 600, stock: 40, category: "Fittings" },
  { id: 57, name: "Door Handle - Aluminium", buy: 450, sell: 600, stock: 25, category: "Fittings" },
  { id: 58, name: "Hammer - 16oz", buy: 500, sell: 650, stock: 20, category: "Tools" },
  { id: 59, name: "Shovel", buy: 650, sell: 850, stock: 20, category: "Tools" },
  { id: 60, name: "Wheelbarrow - Heavy Duty", buy: 4500, sell: 5500, stock: 8, category: "Tools" },
  { id: 61, name: "Steel Bar Y12 - 12m", buy: 900, sell: 1100, stock: 40, category: "Steel" },
  { id: 62, name: "Steel Bar Y10 - 12m", buy: 700, sell: 850, stock: 40, category: "Steel" },
  { id: 63, name: "BRC Mesh A142 - 2x3m", buy: 1800, sell: 2200, stock: 15, category: "Steel" },
  { id: 64, name: "Wire Mesh - Chicken 1m x 20m", buy: 950, sell: 1200, stock: 15, category: "Fencing" },
  { id: 65, name: "Barbed Wire - 25kg", buy: 3800, sell: 4500, stock: 10, category: "Fencing" },
  { id: 66, name: "Sand - Tonne (Mumias)", buy: 1800, sell: 2500, stock: 999, category: "Aggregates" },
  { id: 67, name: "Ballast - Tonne", buy: 2000, sell: 2800, stock: 999, category: "Aggregates" },
  { id: 68, name: "Quarry Dust - Tonne", buy: 1500, sell: 2000, stock: 999, category: "Aggregates" },
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
    if(saved){ try{ const p=JSON.parse(saved); if(p.length>0) setItems(p);}catch{} }
    if(savedSales) setSalesToday(Number(savedSales));
    if(savedProfit) setProfitToday(Number(savedProfit));
  }, []);

  const saveStock = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("dukapulse_stock_v4_full", JSON.stringify(newItems));
  };

  const categories = ["All", ...Array.from(new Set(items.map(i=>i.category)))];
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) && (category==="All" || i.category===category));

  const addToCart = (item: Item) => {
    if(item.stock<=0) return alert("Out of stock");
    setCart(prev => {
      const f = prev.find(p=>p.id===item.id);
      if(f) return prev.map(p=>p.id===item.id?{...p, qty:p.qty+1}:p);
      return [...prev, {...item, qty:1, customSell: item.sell}];
    });
  };
  const updateCartPrice = (id: number, newPrice: number) => setCart(prev => prev.map(p => p.id===id ? {...p, customSell: newPrice} : p));
  const getSellPrice = (c: CartItem) => c.customSell ?? c.sell;
  const totalSell = cart.reduce((s,i)=>s+getSellPrice(i)*i.qty,0);
  const totalBuy = cart.reduce((s,i)=>s+i.buy*i.qty,0);
  const totalProfit = totalSell - totalBuy;
  const projectedProfitToday = profitToday + totalProfit;

  const handleSale = async () => {
    if(cart.length===0) return alert("Cart empty!");
    if(!mpesaPhone || mpesaPhone.length < 10){ if(!confirm("Cash sale?")) return; completeSale("CASH"); return; }
    setLoading(true); setStatus("STK Push to "+mpesaPhone+"...");
    try{ await fetch("/api/mpesa", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({phone: mpesaPhone, amount: totalSell})}); setStatus("✅ STK Sent!"); setTimeout(()=>completeSale("M-PESA"), 2000);}catch{ completeSale("M-PESA"); }
  };
  const completeSale = (method: string) => {
    let newItems=[...items];
    cart.forEach(c=>{ newItems=newItems.map(it=> it.id===c.id ? {...it, stock: it.stock - c.qty} : it); });
    saveStock(newItems);
    setSalesToday(s=>{const ns=s+totalSell; localStorage.setItem("dukapulse_sales_today_v4", String(ns)); return ns;});
    setProfitToday(p=>{const np=p+totalProfit; localStorage.setItem("dukapulse_profit_today_v4", String(np)); return np;});
    const rec={id:"RCPT-"+Date.now().toString().slice(-6), date:new Date().toLocaleString(), cart:cart.map(c=>({...c, sell:getSellPrice(c)})), total:totalSell, phone:mpesaPhone||"CASH", method};
    setReceipt(rec); setLoading(false); setStatus("✅ Paid!");
    setTimeout(()=>window.print(),400);
  };
  const closeReceipt=()=>{setReceipt(null); setCart([]); setMpesaPhone(""); setStatus("");};

  return (
    <main style={{fontFamily:"system-ui", padding:12, maxWidth:1300, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <div className="no-print" style={{background:"linear-gradient(135deg,#000,#2563eb)", color:"white", padding:16, borderRadius:14, marginBottom:12}}>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10}}>
          <div><h1 style={{margin:0, fontSize:20, fontWeight:900}}>DUKAPULSE - MUMIAS FULL HARDWARE</h1><p style={{margin:"4px 0 0 0", fontSize:12, opacity:0.9}}>{items.length} Items ● Today Sales KES {salesToday.toLocaleString()} ● Today Profit KES {profitToday.toLocaleString()}</p></div>
          <div style={{display:"flex", gap:8}}><button onClick={()=>setShowAdd(!showAdd)} style={{background:"#facc15", color:"black", padding:"6px 14px", borderRadius:20, fontWeight:800, fontSize:12, border:"none", cursor:"pointer"}}>+ ADD MATERIAL</button><button onClick={()=>setShowProfit(true)} style={{background:"#000", color:"#facc15", border:"1px solid #facc15", padding:"6px 14px", borderRadius:20, fontWeight:800, fontSize:12, cursor:"pointer"}}>🔒 MY PROFIT</button></div>
        </div>
        <div style={{display:"flex", gap:6, marginTop:10, flexWrap:"wrap"}}>{categories.map(cat=>(<button key={cat} onClick={()=>setCategory(cat)} style={{background: category===cat?"white":"rgba(255,255,255,0.2)", color: category===cat?"black":"white", border:"none", padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer"}}>{cat}</button>))}</div>
      </div>

      {showAdd && (<div className="no-print" style={{background:"white", border:"2px solid #facc15", padding:15, borderRadius:12, marginBottom:12}}><h3 style={{marginTop:0}}>Add Material</h3><div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}><input placeholder="Name" value={newItem.name} onChange={e=>setNewItem({...newItem, name:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #ddd", gridColumn:"1 / -1"}}/><input placeholder="Buy Price" type="number" value={newItem.buy} onChange={e=>setNewItem({...newItem, buy:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #ddd"}}/><input placeholder="Sell Price" type="number" value={newItem.sell} onChange={e=>setNewItem({...newItem, sell:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #ddd"}}/><input placeholder="Stock" type="number" value={newItem.stock} onChange={e=>setNewItem({...newItem, stock:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #ddd"}}/><input placeholder="Category" value={newItem.category} onChange={e=>setNewItem({...newItem, category:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #ddd"}}/></div><button onClick={()=>{if(!newItem.name||!newItem.buy||!newItem.sell) return alert("Jaza"); const it:Item={id:Date.now(), name:newItem.name, buy:parseInt(newItem.buy), sell:parseInt(newItem.sell), stock:parseInt(newItem.stock)||10, category:newItem.category||"General"}; saveStock([it, ...items]); setNewItem({name:"",buy:"",sell:"",stock:"",category:"General"}); setShowAdd(false);}} style={{background:"#000", color:"#fff", padding:12, width:"100%", borderRadius:8, marginTop:10, fontWeight:800, border:"none"}}>Save ✅</button></div>)}

      {showProfit && (<div className="no-print" style={{background:"#000", color:"#facc15", padding:16, borderRadius:12, marginBottom:12, border:"2px solid #facc15"}}>{pin!=="1234" ? (<div><h3>🔒 Owner PIN</h3><div style={{display:"flex", gap:8}}><input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="1234" style={{padding:10, borderRadius:8, flex:1}}/><button onClick={()=>{if(pin!=="1234") alert("Wrong PIN!");}} style={{padding:"10px 15px", borderRadius:8, background:"#facc15", fontWeight:800}}>Unlock</button><button onClick={()=>setShowProfit(false)} style={{padding:"10px 15px", borderRadius:8}}>Close</button></div></div>) : (<div><h3 style={{marginTop:0}}>💰 SECRET DASHBOARD - BEST VIEW</h3><div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
        <div style={{background:"#111", padding:12, borderRadius:8, border:"1px solid #333"}}><div style={{fontSize:11, opacity:0.7}}>THIS CART (Bargain Check)</div><div style={{fontSize:13, marginTop:6}}>Sales: KES {totalSell.toLocaleString()}</div><div style={{fontSize:12}}>Cost: KES {totalBuy.toLocaleString()}</div><div style={{fontSize:13, color:"#4ade80", marginTop:6, fontWeight:800}}>Profit: KES {totalProfit.toLocaleString()}</div><div style={{fontSize:10, marginTop:4}}>{totalSell? ((totalProfit/totalSell)*100).toFixed(1):0}% margin</div></div>
        <div style={{background:"#111", padding:12, borderRadius:8, border:"1px solid #333"}}><div style={{fontSize:11, opacity:0.7}}>TODAY SUMMARY</div><div style={{fontSize:13, marginTop:6}}>Sales Today: KES {salesToday.toLocaleString()}</div><div style={{fontSize:12}}>Profit Earned: KES {profitToday.toLocaleString()}</div><div style={{fontSize:11, marginTop:8, color:"#aaa"}}>Items sold today already counted in profit</div></div>
        <div style={{background:"#facc15", color:"black", padding:14, borderRadius:10}}><div style={{fontSize:11, fontWeight:700}}>TODAY PROFIT (BIG)</div><div style={{fontSize:26, fontWeight:900, marginTop:4}}>KES {projectedProfitToday.toLocaleString()}</div><div style={{fontSize:11, marginTop:4}}>{cart.length>0 ? `If you sell this cart → ${projectedProfitToday.toLocaleString()}` : "Total profit in pocket today"}</div></div>
      </div><button onClick={()=>{setShowProfit(false); setPin("");}} style={{background:"#facc15", color:"black", padding:"8px 16px", borderRadius:8, fontWeight:800, border:"none", marginTop:12}}>Lock 🔒</button></div>)}</div>)}

      <div className="no-print" style={{display:"grid", gridTemplateColumns:"2.2fr 1fr", gap:12}}>
        <div style={{background:"white", borderRadius:12, padding:10}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${items.length} items...`} style={{width:"100%", padding:12, borderRadius:8, border:"2px solid #e5e7eb", marginBottom:10}}/><div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:"75vh", overflowY:"auto"}}>{filtered.map(item=>(<div key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:10, border:"1px solid #eee", borderRadius:10}}><div style={{flex:1}}><div style={{fontWeight:700, fontSize:12}}>{item.name}</div><div style={{fontSize:10, color:"#666"}}>{item.category} • Stock {item.stock} • KES {item.sell}</div></div><button onClick={()=>addToCart(item)} style={{background:"#facc15", border:"none", padding:"6px 10px", borderRadius:8, fontWeight:800, fontSize:11, cursor:"pointer"}}>+</button></div>))}</div></div>
        <div style={{background:"white", borderRadius:12, padding:12, height:"fit-content", position:"sticky", top:10}}>
          <h3 style={{marginTop:0}}>Cart - Bargain Allowed</h3>
          {cart.map(c=>(<div key={c.id} style={{borderBottom:"1px solid #eee", padding:"6px 0"}}><div style={{display:"flex", justifyContent:"space-between", fontSize:12}}><span>{c.name.slice(0,20)} x{c.qty}</span><button onClick={()=>setCart(prev=>prev.filter(p=>p.id!==c.id))} style={{background:"#fee", border:"none", borderRadius:4, fontSize:10}}>X</button></div><div style={{display:"flex", gap:6, marginTop:4, alignItems:"center"}}><span style={{fontSize:11}}>Price:</span><input type="number" value={getSellPrice(c)} onChange={e=>updateCartPrice(c.id, parseInt(e.target.value)||0)} style={{width:90, padding:4, borderRadius:6, border:"1px solid #000", fontWeight:800}}/><span style={{fontSize:12, fontWeight:800}}>= {getSellPrice(c)*c.qty}</span></div></div>))}
          {cart.length===0 && <div style={{fontSize:12, color:"#888"}}>Cart empty - add items</div>}
          <h2 style={{margin:"10px 0 4px 0"}}>Total: KES {totalSell.toLocaleString()}</h2>
          <div style={{fontSize:11, background:"#fef9c3", padding:6, borderRadius:6, marginBottom:8}}>Cart Profit: KES {totalProfit.toLocaleString()} - Customer can't see this</div>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="07xx M-Pesa / empty=CASH" style={{width:"100%", padding:11, borderRadius:8, border:"2px solid black", margin:"8px 0"}}/>
          <button disabled={loading} onClick={handleSale} style={{width:"100%", background: loading?"#9ca3af":"#000", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:900, cursor:"pointer"}}>{loading?"⏳...":"LIPA NA M-PESA / CASH"}</button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:6, background:"#f3f4f6", border:"none", padding:9, borderRadius:8, cursor:"pointer"}}>Clear</button>
        </div>
      </div>

      {receipt && (<div className="no-print" style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:9999}}><div style={{background:"white", padding:18, borderRadius:12, maxWidth:360, width:"100%", fontFamily:"monospace"}}><h3 style={{textAlign:"center", margin:0}}>MUMIAS HARDWARE</h3><p style={{textAlign:"center", fontSize:12, margin:"4px 0"}}>{receipt.id}<br/>{receipt.date}<br/>{receipt.method} - {receipt.phone}</p><hr/>{receipt.cart.map((c:any)=>(<div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:11}}><span>{c.name.slice(0,25)} x{c.qty}</span><span>KES {c.sell*c.qty}</span></div>))}<hr/><div style={{display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:14}}><span>TOTAL</span><span>KES {receipt.total.toLocaleString()}</span></div><p style={{textAlign:"center", fontSize:11, marginTop:10}}>Asante sana! Karibu tena!</p><button onClick={()=>window.print()} style={{width:"100%", background:"black", color:"white", padding:12, borderRadius:8, marginTop:10, border:"none", fontWeight:800}}>🖨️ PRINT RECEIPT</button><button onClick={closeReceipt} style={{width:"100%", background:"#2563eb", color:"white", padding:10, borderRadius:8, marginTop:6, border:"none"}}>New Sale</button></div></div>)}
    </main>
  );
}
