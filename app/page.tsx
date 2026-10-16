"use client";
import { useState, useEffect } from "react";
type Item = { id: number; name: string; buy: number; sell: number; stock: number; category: string; };
type CartItem = Item & { qty: number; customSell?: number };
type DailyRecord = { sales: number; profit: number; count: number };

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
  { id: 32, name: "PVC Pipe 1/2 inch - 4m", buy: 250, sell: 350, stock: 50, category: "Plumbing" },
  { id: 33, name: "PVC Pipe 3/4 inch - 4m", buy: 380, sell: 500, stock: 50, category: "Plumbing" },
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

function getTodayKey() { return new Date().toISOString().slice(0,10); }
function getDateKey(d: Date) { return d.toISOString().slice(0,10); }
function calcVAT(total: number){
  const taxable = total / 1.16;
  const vat = total - taxable;
  return { taxable: taxable.toFixed(2), vat: vat.toFixed(2), total: total.toFixed(2) };
}
function genKRAInv(id: string){
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  return `CUINV-${date}-${id.slice(-4)}`;
}

export default function Page() {
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("");
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [salesToday, setSalesToday] = useState(0);
  const [profitToday, setProfitToday] = useState(0);
  const [history, setHistory] = useState<Record<string, DailyRecord>>({});
  const [showProfit, setShowProfit] = useState(false);
  const [calendarView, setCalendarView] = useState<"today"|"week"|"month">("today");
  const [pin, setPin] = useState("");
  const [showPaid, setShowPaid] = useState(false);
  const [paidCode, setPaidCode] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [loginInput, setLoginInput] = useState("");
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [restockInputs, setRestockInputs] = useState<Record<number, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newP, setNewP] = useState({name:"", buy:"", sell:"", stock:"", category:"Cement"});
  const [ownerPinPrompt, setOwnerPinPrompt] = useState(false);
  const [ownerPinInput, setOwnerPinInput] = useState("");
  const [ownerPin, setOwnerPin] = useState("1234");
  const [showChangePin, setShowChangePin] = useState(false);
  const [changePinData, setChangePinData] = useState({oldPin:"", newPin:"", confirmPin:""});
  const [isBlocked, setIsBlocked] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [subCodeInput, setSubCodeInput] = useState("");
  const [isFirstPayment, setIsFirstPayment] = useState(true);
  const [trialStart, setTrialStart] = useState("");

  useEffect(()=>{
    const savedShop = localStorage.getItem("dukapulse_current_shop");
    if(savedShop){ setShopId(savedShop); setShopName(savedShop); }
  },[]);

  useEffect(()=>{
    if(!shopId) return;
    const stockKey = `dukapulse_${shopId}_stock_v10`;
    const salesKey = `dukapulse_${shopId}_sales_today_v10`;
    const profitKey = `dukapulse_${shopId}_profit_today_v10`;
    const histKey = `dukapulse_${shopId}_history_v10`;
    const dateKey = `dukapulse_${shopId}_last_date_v10`;
    const pinKey = `dukapulse_${shopId}_owner_pin_v10`;
    const expiryKey = `dukapulse_${shopId}_expiry_v10`;
    const firstPayKey = `dukapulse_${shopId}_first_paid_v10`;
    const trialKey = `dukapulse_${shopId}_trial_start_v10`;

    const saved = localStorage.getItem(stockKey);
    const savedSales = localStorage.getItem(salesKey);
    const savedProfit = localStorage.getItem(profitKey);
    const savedHist = localStorage.getItem(histKey);
    const savedDate = localStorage.getItem(dateKey);
    const savedPin = localStorage.getItem(pinKey);
    let savedExpiry = localStorage.getItem(expiryKey);
    let savedFirstPaid = localStorage.getItem(firstPayKey);
    let savedTrialStart = localStorage.getItem(trialKey);

    if(savedPin) setOwnerPin(savedPin); else setOwnerPin("1234");

    if(!savedExpiry){
      const now = new Date();
      const trialEnd = new Date(); trialEnd.setDate(now.getDate()+7);
      savedExpiry = trialEnd.toISOString().slice(0,10);
      savedTrialStart = now.toISOString().slice(0,10);
      localStorage.setItem(expiryKey, savedExpiry);
      localStorage.setItem(trialKey, savedTrialStart);
      localStorage.setItem(firstPayKey, "false");
      setIsFirstPayment(true);
      setTrialStart(savedTrialStart);
    } else {
      setIsFirstPayment(savedFirstPaid!== "true");
      if(savedTrialStart) setTrialStart(savedTrialStart);
    }

    setExpiry(savedExpiry);
    if(new Date().toISOString().slice(0,10) > savedExpiry){ setIsBlocked(true); }

    const today = getTodayKey();
    if(saved){ try{ const p=JSON.parse(saved); if(p.length>0) setItems(p);}catch{ setItems(INITIAL_ITEMS); } } else { setItems(INITIAL_ITEMS); }
    if(savedHist){ try{ setHistory(JSON.parse(savedHist)); }catch{} }
    if(savedDate!== today){
      localStorage.setItem(dateKey, today);
      setSalesToday(0); setProfitToday(0);
      localStorage.setItem(salesKey, "0");
      localStorage.setItem(profitKey, "0");
    } else {
      if(savedSales) setSalesToday(Number(savedSales));
      if(savedProfit) setProfitToday(Number(savedProfit));
    }
  }, [shopId]);

  const saveStock = (newItems: Item[]) => { if(!shopId) return; setItems(newItems); localStorage.setItem(`dukapulse_${shopId}_stock_v10`, JSON.stringify(newItems)); };
  const saveHistory = (newHist: Record<string, DailyRecord>) => { if(!shopId) return; setHistory(newHist); localStorage.setItem(`dukapulse_${shopId}_history_v10`, JSON.stringify(newHist)); };
  const saveOwnerPin = (newPin: string) => { if(!shopId) return; setOwnerPin(newPin); localStorage.setItem(`dukapulse_${shopId}_owner_pin_v10`, newPin); };

  const handleLogin = () => {
    if(!loginInput.trim()) return alert("Enter shop name e.g. Mumias Hardware");
    const id = loginInput.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    localStorage.setItem("dukapulse_current_shop", id);
    setShopId(id);
    setShopName(loginInput.trim());
  };
  const handleLogout = () => {
    if(confirm("Logout from this shop? Data will stay safe.")){
      localStorage.removeItem("dukapulse_current_shop");
      setShopId(null); setCart([]); setShopName(""); setIsOwnerMode(false);
    }
  };
  const tryEnterOwnerMode = () => { if(isOwnerMode){ setIsOwnerMode(false); return; } setOwnerPinPrompt(true); };
  const confirmOwnerPin = () => {
    if(ownerPinInput === ownerPin){ setIsOwnerMode(true); setOwnerPinPrompt(false); setOwnerPinInput(""); }
    else { alert("Wrong PIN! Only owner knows PIN."); setOwnerPinInput(""); }
  };
  const handleChangePin = () => {
    if(changePinData.oldPin!== ownerPin) return alert("Old PIN is wrong!");
    if(changePinData.newPin.length < 4) return alert("New PIN must be at least 4 digits!");
    if(changePinData.newPin!== changePinData.confirmPin) return alert("New PINs don't match!");
    saveOwnerPin(changePinData.newPin);
    setChangePinData({oldPin:"", newPin:"", confirmPin:""});
    setShowChangePin(false);
    alert(`PIN CHANGED! New PIN is ${changePinData.newPin}.`);
  };
  const handleRestock = (id: number) => {
    const addStr = restockInputs[id] || "0";
    const addQty = parseInt(addStr);
    if(!addQty || addQty <=0) return alert("Enter quantity to add e.g. 50");
    const newItems = items.map(it => it.id===id? {...it, stock: it.stock + addQty} : it);
    saveStock(newItems);
    setRestockInputs(prev => ({...prev, [id]: ""}));
    alert(`RESTOCKED! Added ${addQty}.`);
  };
  const handleAddNewProduct = () => {
    if(!newP.name ||!newP.buy ||!newP.sell ||!newP.stock) return alert("Fill all fields");
    const newItem: Item = { id: Date.now(), name: newP.name, buy: parseInt(newP.buy), sell: parseInt(newP.sell), stock: parseInt(newP.stock), category: newP.category };
    saveStock([...items, newItem]);
    setNewP({name:"", buy:"", sell:"", stock:"", category:"Cement"});
    setShowAddForm(false);
    alert(`NEW PRODUCT ADDED! ${newItem.name}`);
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) && (category==="All" || i.category===category));
  const addToCart = (item: Item) => {
    if(item.stock<=0) return alert("Out of stock - please RESTOCK!");
    setCart(prev => {
      const f = prev.find(p=>p.id===item.id);
      if(f) return prev.map(p=>p.id===item.id?{...p, qty:p.qty+1}:p);
      return [...prev, {...item, qty:1, customSell: item.sell}];
    });
  };
  const updateCartPrice = (id: number, newPrice: number) => setCart(prev => prev.map(p => p.id===id? {...p, customSell: newPrice} : p));
  const getSellPrice = (c: CartItem) => c.customSell?? c.sell;
  const totalSell = cart.reduce((s,i)=>s+getSellPrice(i)*i.qty,0);
  const totalBuy = cart.reduce((s,i)=>s+i.buy*i.qty,0);
  const totalProfit = totalSell - totalBuy;
  const projectedProfitToday = profitToday + totalProfit;
  const todayKey = getTodayKey();
  const getLast7Days = () => {
    const days = [];
    for(let i=0;i<7;i++){ const d=new Date(); d.setDate(d.getDate()-i); const k=getDateKey(d); days.push({key:k, date:d, data: history[k] || (k===todayKey? {sales:salesToday, profit:profitToday, count:0} : undefined)}); }
    return days;
  };
  const getThisMonth = () => {
    const entries = Object.entries(history).filter(([k])=> k.startsWith(todayKey.slice(0,7)));
    let mSales = entries.reduce((s,[,v])=>s+v.sales,0) + (history[todayKey]? 0 : salesToday);
    let mProfit = entries.reduce((s,[,v])=>s+v.profit,0) + (history[todayKey]? 0 : profitToday);
    if(!history[todayKey]){ mSales+=salesToday; mProfit+=profitToday; }
    else { mSales = entries.reduce((s,[,v])=>s+v.sales,0); mProfit = entries.reduce((s,[,v])=>s+v.profit,0); if(!entries.find(([k])=>k===todayKey)){ mSales+=salesToday; mProfit+=profitToday; } }
    return {mSales, mProfit, entries};
  };

  const handleSale = async () => {
    if(cart.length===0) return alert("Cart empty!");
    // FIXED: CASH LOGIC NOW CORRECT - Phone = Walk-in, Code = -
    if(!mpesaPhone || mpesaPhone.length < 10){
      if(!confirm("Cash sale KES "+totalSell+"?")) return;
      completeSale("CASH", "-", totalSell, "Walk-in");
      return;
    }
    setLoading(true);
    setStatus("STK Push to "+mpesaPhone+"...");
    try{
      const resp = await fetch("/api/mpesa", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({phone: mpesaPhone, amount: totalSell, shopId}) });
      const data = await resp.json();
      if(!resp.ok) throw new Error(data.error || "STK failed");
      const checkoutId = data.CheckoutRequestID;
      setStatus("STK Sent! Tell customer to enter PIN...");
      for(let i=0;i<20;i++){
        await new Promise(r=>setTimeout(r,3000));
        setStatus(`Waiting M-Pesa... ${i+1}/20`);
        const poll = await fetch('/api/mpesa/callback');
        const tx = await poll.json();
        if(tx?.mpesaCode && tx?.checkoutId === checkoutId){
          setPaidCode(tx.mpesaCode); setPaidAmount(tx.amount); setShowPaid(true); setLoading(false); setStatus("PAYMENT SUCCESSFUL!");
          setTimeout(()=>{ setShowPaid(false); completeSale("M-PESA", tx.mpesaCode, tx.amount, mpesaPhone); }, 4000);
          return;
        }
      }
      setStatus("Not confirmed yet. Check SMS."); completeSale("M-PESA", "PENDING - CHECK SMS", totalSell, mpesaPhone); setLoading(false);
    }catch(e:any){ alert(e.message); setLoading(false); setStatus("Failed"); }
  };

  const completeSale = (method: string, mpesaCode: string, amount: number, customerPhone: string) => {
    if(!shopId) return;
    let newItems=[...items];
    cart.forEach(c=>{ newItems=newItems.map(it=> it.id===c.id? {...it, stock: it.stock - c.qty} : it); });
    saveStock(newItems);
    const key = getTodayKey();
    const newHist = {...history};
    if(!newHist[key]) newHist[key] = {sales:0, profit:0, count:0};
    newHist[key] = {sales: newHist[key].sales + totalSell, profit: newHist[key].profit + totalProfit, count: newHist[key].count + 1};
    saveHistory(newHist);
    const salesKey = `dukapulse_${shopId}_sales_today_v10`;
    const profitKey = `dukapulse_${shopId}_profit_today_v10`;
    setSalesToday(s=>{const ns=s+totalSell; localStorage.setItem(salesKey, String(ns)); return ns;});
    setProfitToday(p=>{const np=p+totalProfit; localStorage.setItem(profitKey, String(np)); return np;});
    const id = "RCPT-"+Date.now().toString().slice(-6);
    const kraNo = genKRAInv(id);
    const vat = calcVAT(amount);
    const rec={
      id,
      kraNo,
      vat,
      date:new Date().toLocaleString(),
      cart:cart.map(c=>({...c, sell:getSellPrice(c)})),
      total:amount,
      phone: customerPhone,
      customer: customerName || "Walk-in Customer",
      method,
      mpesaCode,
      shopId,
      shopName,
      kraPin: "P051234567Z"
    };
    setReceipt(rec); setLoading(false); setStatus("Paid!");
  };
  const closeReceipt=()=>{setReceipt(null); setCart([]); setMpesaPhone(""); setCustomerName(""); setStatus("");};
  const last7 = getLast7Days();
  const month = getThisMonth();
  const weekSales = last7.reduce((s,d)=> s + (d.data?.sales||0), 0);
  const weekProfit = last7.reduce((s,d)=> s + (d.data?.profit||0), 0);

  const daysLeft = () => {
    if(!expiry) return 0;
    const today = new Date(); today.setHours(0,0,0,0);
    const exp = new Date(expiry); exp.setHours(0,0,0,0);
    const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000*60*60*24));
    return diff;
  };

  if(!shopId){
    return (
      <main style={{fontFamily:"system-ui", minHeight:"100vh", background:"linear-gradient(135deg,#000,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
        <div style={{background:"white", padding:30, borderRadius:16, maxWidth:420, width:"100%", textAlign:"center"}}>
          <h1 style={{margin:0, fontWeight:900, fontSize:22}}>DUKAPULSE - LOGIN</h1>
          <p style={{fontSize:11, color:"#16a34a", fontWeight:700, marginTop:4}}>7 DAYS FREE TRIAL - THEN KES 5000</p>
          <input value={loginInput} onChange={e=>setLoginInput(e.target.value)} placeholder="Enter Shop Name e.g. Mumias Hardware" style={{width:"100%", padding:14, borderRadius:10, border:"2px solid black", marginTop:20, fontWeight:700}}/>
          <button onClick={handleLogin} style={{width:"100%", background:"black", color:"white", padding:14, borderRadius:10, fontWeight:900, marginTop:12, border:"none", cursor:"pointer"}}>START 7 DAY TRIAL →</button>
          <p style={{fontSize:10, color:"#666", marginTop:10}}>New account = 7 days free, then Paybill 714888 Acc 467108</p>
        </div>
      </main>
    )
  }

  if(isBlocked){
    const payAmount = isFirstPayment? 5000 : 1500;
    return (
      <main style={{fontFamily:"system-ui", minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
        <div style={{background:"white", padding:22, borderRadius:16, maxWidth:440, width:"100%", textAlign:"center", border:"4px solid #7a1e2d"}}>
          <h1 style={{color:"#7a1e2d", fontSize:36, margin:0}}>INACTIVE</h1>
          <h2 style={{margin:"8px 0", fontSize:15}}>{shopName.toUpperCase()}</h2>
          <div style={{background:"#7a1e2d", borderRadius:12, padding:14, marginTop:12, textAlign:"left", color:"white"}}>
            <div style={{fontSize:10, marginTop:8}}>PAYBILL</div>
            <div style={{fontSize:30, fontWeight:900, color:"#ff6b7a"}}>714888</div>
            <div style={{fontSize:11, fontWeight:700}}>ACCOUNT 467108</div>
            <div style={{fontSize:11, marginTop:10, background:"rgba(255,255,255,0.12)", padding:8, borderRadius:8}}>
              Pay <b>KES {payAmount}</b>: M-Pesa → Lipa na M-Pesa → Paybill → <b>714888</b> → Acc <b>467108</b>
            </div>
            <input value={subCodeInput} onChange={e=>setSubCodeInput(e.target.value)} placeholder={`Enter CODE after paying KES ${payAmount}`} style={{width:"100%", padding:11, borderRadius:8, border:"2px solid #16a34a", marginTop:10, color:"black", fontWeight:700}}/>
            <button onClick={()=>{
              if(!subCodeInput || subCodeInput.length < 8) return alert("Enter valid M-Pesa CODE");
              const newDate = new Date(); newDate.setDate(newDate.getDate()+30);
              const newExpiry = newDate.toISOString().slice(0,10);
              localStorage.setItem(`dukapulse_${shopId}_expiry_v10`, newExpiry);
              localStorage.setItem(`dukapulse_${shopId}_first_paid_v10`, "true");
              setIsBlocked(false); setExpiry(newExpiry); setIsFirstPayment(false); setSubCodeInput("");
              alert(`PAID! Unlocked till ${newExpiry}`);
            }} style={{width:"100%", background:"#16a34a", color:"white", padding:12, borderRadius:8, fontWeight:900, border:"none", marginTop:8, cursor:"pointer"}}>
              VERIFY KES {payAmount} & UNLOCK 30 DAYS
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{fontFamily:"system-ui", padding:12, maxWidth:1300, margin:"0 auto", background:"#f5f7fb", minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#000,#2563eb)", color:"white", padding:16, borderRadius:14, marginBottom:12}}>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10}}>
          <div>
            <h1 style={{margin:0, fontSize:18, fontWeight:900}}>DUKAPULSE - {shopName.toUpperCase()}</h1>
            <p style={{margin:"4px 0 0 0", fontSize:11, opacity:0.9}}>
              {items.length} Items ● Today KES {salesToday.toLocaleString()} ● Profit KES {profitToday.toLocaleString()} ●
              <span style={{background: daysLeft() <=3? "#ef4444" : "#16a34a", padding:"2px 6px", borderRadius:10, marginLeft:6, fontWeight:800}}>
                {isFirstPayment? `TRIAL: ${daysLeft()} days left` : `Exp: ${expiry} (${daysLeft()} days)`}
              </span>
            </p>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button onClick={tryEnterOwnerMode} style={{background: isOwnerMode? "#facc15" : "white", color:"black", padding:"6px 14px", borderRadius:20, fontWeight:800, fontSize:12, border:"none", cursor:"pointer"}}>{isOwnerMode? "Selling Mode" : "Owner Restock"}</button>
            <button onClick={handleLogout} style={{background:"white", color:"black", padding:"6px 14px", borderRadius:20, fontWeight:800, fontSize:12, border:"none", cursor:"pointer"}}>Logout</button>
            <button onClick={()=>setShowProfit(true)} style={{background:"#000", color:"#facc15", border:"1px solid #facc15", padding:"6px 14px", borderRadius:20, fontWeight:800, fontSize:12, cursor:"pointer"}}>MY PROFIT</button>
          </div>
        </div>
        <div style={{display:"flex", gap:6, marginTop:10, flexWrap:"wrap"}}>{["All",...Array.from(new Set(items.map(i=>i.category)))].map(cat=>(<button key={cat} onClick={()=>setCategory(cat)} style={{background: category===cat?"white":"rgba(255,255,255,0.2)", color: category===cat?"black":"white", border:"none", padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer"}}>{cat}</button>))}</div>
      </div>

      {receipt && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20}}>
          <div style={{background:"white", padding:20, borderRadius:12, maxWidth:380, width:"100%", color:"black"}}>
            <div style={{textAlign:"center", borderBottom:"2px solid black", paddingBottom:8}}>
              <h2 style={{margin:0, fontSize:16, fontWeight:900}}>{receipt.shopName.toUpperCase()}</h2>
              <p style={{margin:"2px 0", fontSize:10}}>Mumias - Bungoma Rd | 07xx xxx xxx</p>
              <p style={{margin:0, fontSize:11, fontWeight:800}}>KRA PIN: {receipt.kraPin}</p>
              <h3 style={{margin:"6px 0 0 0", fontSize:12}}>DUKAPULSE RECEIPT</h3>
              <p style={{margin:0, fontSize:9, fontWeight:700, color:"green"}}>KRA eTIMS COMPLIANT</p>
            </div>
            <div style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>ID:</span><span>{receipt.id}</span></div>
              <div style={{display:"flex", justifyContent:"space-between", fontWeight:800}}><span>KRA CU No:</span><span>{receipt.kraNo}</span></div>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>Date:</span><span>{receipt.date}</span></div>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>Method:</span><span>{receipt.method}</span></div>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>Customer:</span><span>{receipt.customer}</span></div>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>Phone:</span><span>{receipt.phone}</span></div>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>M-Pesa Code:</span><span style={{fontWeight:700}}>{receipt.mpesaCode}</span></div>
            </div>
            <div style={{borderTop:"1px dashed #999", margin:"8px 0", paddingTop:8, fontSize:11}}>
              {receipt.cart.map((c:any)=><div key={c.id} style={{display:"flex", justifyContent:"space-between", marginBottom:3}}><span>{c.name.slice(0,25)} x{c.qty}</span><span>KES {c.sell*c.qty}</span></div>)}
            </div>
            <div style={{borderTop:"1px solid black", borderBottom:"1px solid black", padding:"8px 0", fontSize:11}}>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>Taxable Amount:</span><span>KES {receipt.vat.taxable}</span></div>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>VAT 16%:</span><span>KES {receipt.vat.vat}</span></div>
              <div style={{display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:14, marginTop:4}}><span>TOTAL</span><span>KES {receipt.total.toLocaleString()}</span></div>
            </div>
            <div style={{textAlign:"center", marginTop:10}}>
              <div style={{width:100, height:100, border:"2px solid black", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, padding:4, fontWeight:800}}>
                KRA eTIMS<br/>QR CODE<br/>{receipt.kraNo}
              </div>
              <div style={{fontSize:7, marginTop:4, wordBreak:"break-all"}}>https://etims.kra.go.ke/verify/{receipt.kraNo}</div>
              <div style={{fontSize:8, fontWeight:800, marginTop:2}}>SCAN TO VERIFY ON KRA PORTAL</div>
            </div>
            <button onClick={closeReceipt} style={{width:"100%", background:"black", color:"white", padding:12, borderRadius:8, fontWeight:800, border:"none", marginTop:12, cursor:"pointer"}}>DONE - NEW SALE</button>
          </div>
        </div>
      )}

      <div style={{display:"grid", gridTemplateColumns:"2.2fr 1fr", gap:12}}>
        <div style={{background:"white", borderRadius:12, padding:10}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${items.length} items...`} style={{width:"100%", padding:12, borderRadius:8, border:"2px solid #e5e7eb", marginBottom:10}}/><div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:"75vh", overflowY:"auto"}}>
          {filtered.map(item=>(
            <div key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:10, border: item.stock < 10? "2px solid red" : "1px solid #eee", borderRadius:10, background: item.stock < 10? "#fef2f2" : "white"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700, fontSize:12}}>{item.name} {item.stock < 10 && "LOW!"}</div>
                <div style={{fontSize:10, color: item.stock < 10? "red" : "#666"}}>{item.category} • Stock {item.stock} • KES {item.sell}</div>
              </div>
              {!isOwnerMode && <button onClick={()=>addToCart(item)} style={{background:"#facc15", border:"none", padding:"6px 10px", borderRadius:8, fontWeight:800, fontSize:11, cursor:"pointer"}}>+</button>}
            </div>
          ))}
        </div></div>
        <div style={{background:"white", borderRadius:12, padding:12, height:"fit-content", position:"sticky", top:10}}>
          <h3 style={{marginTop:0}}>Cart - {shopName}</h3>
          {cart.map(c=>(<div key={c.id} style={{borderBottom:"1px solid #eee", padding:"6px 0"}}><div style={{display:"flex", justifyContent:"space-between", fontSize:12}}><span>{c.name.slice(0,20)} x{c.qty}</span><button onClick={()=>setCart(prev=>prev.filter(p=>p.id!==c.id))} style={{background:"#fee", border:"none", borderRadius:4, fontSize:10}}>X</button></div></div>))}
          <h2 style={{margin:"10px 0 4px 0"}}>Total: KES {totalSell.toLocaleString()}</h2>
          <input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Customer Name (optional)" style={{width:"100%", padding:10, borderRadius:8, border:"1px solid #ccc", marginBottom:6}}/>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="Customer M-Pesa 07xx (empty=CASH)" style={{width:"100%", padding:11, borderRadius:8, border:"2px solid black", margin:"8px 0"}}/>
          <button disabled={loading} onClick={handleSale} style={{width:"100%", background: loading?"#9ca3af":"#000", color:"white", border:"none", padding:14, borderRadius:10, fontWeight:900, cursor:"pointer"}}>{loading? status : "LIPA NA M-PESA / CASH"}</button>
          <button onClick={()=>setCart([])} style={{width:"100%", marginTop:6, background:"#f3f4f6", border:"none", padding:9, borderRadius:8, cursor:"pointer"}}>Clear Cart</button>
        </div>
      </div>
    </main>
  );
}
