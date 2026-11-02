"use client";
import { useState, useEffect } from "react";

type Item = { id: number; name: string; buy: number; sell: number; stock: number; category: string; };
type CartItem = Item & { qty: number; customSell: number };
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

const SUPERMARKET_ITEMS: Item[] = [
  { id: 1001, name: "Unga - Ajab 2kg", buy: 150, sell: 180, stock: 120, category: "Flour" },
  { id: 1002, name: "Unga - Jogoo 2kg", buy: 140, sell: 170, stock: 100, category: "Flour" },
  { id: 1003, name: "Unga - Hostess 2kg", buy: 145, sell: 175, stock: 100, category: "Flour" },
  { id: 1004, name: "Unga - Taifa 2kg", buy: 135, sell: 165, stock: 80, category: "Flour" },
  { id: 1005, name: "Sugar - Kabras 1kg", buy: 150, sell: 180, stock: 150, category: "Sugar" },
  { id: 1006, name: "Sugar - Ndhiwa 2kg", buy: 290, sell: 340, stock: 100, category: "Sugar" },
  { id: 1007, name: "Sugar - Mara 1kg", buy: 145, sell: 175, stock: 120, category: "Sugar" },
  { id: 1008, name: "Rice - Pishori 1kg", buy: 180, sell: 220, stock: 120, category: "Rice" },
  { id: 1009, name: "Rice - Mwea 2kg", buy: 350, sell: 400, stock: 80, category: "Rice" },
  { id: 1010, name: "Rice - Sindano 1kg", buy: 150, sell: 190, stock: 100, category: "Rice" },
  { id: 1011, name: "Cooking Oil - Fresh Fri 1L", buy: 220, sell: 260, stock: 100, category: "Oil" },
  { id: 1012, name: "Cooking Oil - Elianto 2L", buy: 430, sell: 480, stock: 60, category: "Oil" },
  { id: 1013, name: "Cooking Oil - Golden Fry 5L", buy: 980, sell: 1150, stock: 30, category: "Oil" },
  { id: 1014, name: "Cooking Oil - Rina 3L", buy: 650, sell: 750, stock: 40, category: "Oil" },
  { id: 1015, name: "Milk - Fresh 500ml", buy: 55, sell: 70, stock: 200, category: "Milk" },
  { id: 1016, name: "Milk - Tuzo 500ml", buy: 50, sell: 65, stock: 200, category: "Milk" },
  { id: 1017, name: "Milk - Brookside 1L", buy: 110, sell: 130, stock: 100, category: "Milk" },
  { id: 1018, name: "Bread - Supa Loaf White", buy: 55, sell: 70, stock: 120, category: "Bread" },
  { id: 1019, name: "Bread - Broadways Brown", buy: 60, sell: 75, stock: 100, category: "Bread" },
  { id: 1020, name: "Tea - Ketepa 100g", buy: 80, sell: 100, stock: 150, category: "Beverages" },
  { id: 1021, name: "Tea - Fahari 250g", buy: 170, sell: 200, stock: 100, category: "Beverages" },
  { id: 1022, name: "Soda - Coke 300ml", buy: 30, sell: 40, stock: 300, category: "Beverages" },
  { id: 1023, name: "Soda - Fanta 500ml", buy: 45, sell: 60, stock: 200, category: "Beverages" },
  { id: 1024, name: "Water - Dasani 1L", buy: 40, sell: 60, stock: 200, category: "Beverages" },
  { id: 1025, name: "Juice - Quencher 1L Mango", buy: 90, sell: 120, stock: 80, category: "Beverages" },
  { id: 1026, name: "Soap - White Star 1kg", buy: 120, sell: 150, stock: 120, category: "Soap" },
  { id: 1027, name: "Soap - Omo 1kg", buy: 220, sell: 260, stock: 100, category: "Soap" },
  { id: 1028, name: "Soap - Ariel 500g", buy: 150, sell: 180, stock: 80, category: "Soap" },
  { id: 1029, name: "Bar Soap - Menengai 800g", buy: 80, sell: 100, stock: 150, category: "Soap" },
  { id: 1030, name: "Toilet Paper - Harpic Roll", buy: 25, sell: 35, stock: 300, category: "Tissue" },
  { id: 1031, name: "Tissue - Velvex 2ply x10", buy: 280, sell: 330, stock: 80, category: "Tissue" },
  { id: 1032, name: "Salt - Kensalt 1kg", buy: 35, sell: 50, stock: 200, category: "Spices" },
  { id: 1033, name: "Royco - Mchuzi Mix 200g", buy: 70, sell: 90, stock: 150, category: "Spices" },
  { id: 1034, name: "Tomato - Salsa 400g", buy: 60, sell: 80, stock: 100, category: "Spices" },
  { id: 1035, name: "Biscuit - Marie 200g", buy: 35, sell: 50, stock: 150, category: "Snacks" },
  { id: 1036, name: "Biscuit - Britania 1kg", buy: 280, sell: 330, stock: 60, category: "Snacks" },
  { id: 1037, name: "Diapers - Huggies Medium 22s", buy: 850, sell: 1000, stock: 40, category: "Baby" },
  { id: 1038, name: "Diapers - Pampers Large 20s", buy: 900, sell: 1050, stock: 40, category: "Baby" },
  { id: 1039, name: "Eggs - Tray 30pcs", buy: 380, sell: 450, stock: 50, category: "Fresh" },
  { id: 1040, name: "Margarine - Blue Band 500g", buy: 180, sell: 220, stock: 60, category: "Fresh" },
];

function getTodayKey() { return new Date().toISOString().slice(0,10); }
function genKRAInv(id: string){ const date = new Date().toISOString().slice(0,10).replace(/-/g,''); return `CUINV-${date}-${id.slice(-4)}`; }

export default function Page() {
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState<"hardware"|"supermarket">("hardware");
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const [salesToday, setSalesToday] = useState(0);
  const [profitToday, setProfitToday] = useState(0);
  const [history, setHistory] = useState<Record<string, DailyRecord>>({});
  const [profitView, setProfitView] = useState<"Today"|"7 Days"|"Month">("Month");
  const [loginInput, setLoginInput] = useState("");
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [restockInputs, setRestockInputs] = useState<Record<number, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newP, setNewP] = useState({name:"", buy:"", sell:"", stock:"", category:""});
  const [ownerPinPrompt, setOwnerPinPrompt] = useState(false);
  const [ownerPinInput, setOwnerPinInput] = useState("");
  const [ownerPin, setOwnerPin] = useState("1234");
  const [showChangePin, setShowChangePin] = useState(false);
  const [changePinData, setChangePinData] = useState({oldPin:"", newPin:"", confirmPin:""});
  const [expiry, setExpiry] = useState("2026-10-23");
  const [daysLeftState, setDaysLeftState] = useState(7);

  useEffect(()=>{
    const savedShop = localStorage.getItem("dukapulse_current_shop");
    if(savedShop){ setShopId(savedShop); setShopName(savedShop); }
  },[]);

  useEffect(()=>{
    if(!shopId) return;
    const typeKey = `dukapulse_${shopId}_shoptype_v11`;
    const savedType = localStorage.getItem(typeKey) as "hardware"|"supermarket"|null;
    const finalType = savedType || "hardware";
    setShopType(finalType);

    const stockKey = `dukapulse_${shopId}_${finalType}_stock_v11`;
    const salesKey = `dukapulse_${shopId}_${finalType}_sales_today_v11`;
    const profitKey = `dukapulse_${shopId}_${finalType}_profit_today_v11`;
    const histKey = `dukapulse_${shopId}_${finalType}_history_v11`;
    const pinKey = `dukapulse_${shopId}_owner_pin_v10`;
    const expiryKey = `dukapulse_${shopId}_expiry_v10`;
    const saved = localStorage.getItem(stockKey);
    const savedSales = localStorage.getItem(salesKey);
    const savedProfit = localStorage.getItem(profitKey);
    const savedHist = localStorage.getItem(histKey);
    const savedPin = localStorage.getItem(pinKey);
    let savedExpiry = localStorage.getItem(expiryKey);
    if(savedPin) setOwnerPin(savedPin);
    if(savedExpiry){
      setExpiry(savedExpiry);
      const today = new Date(); today.setHours(0,0,0,0);
      const exp = new Date(savedExpiry); exp.setHours(0,0,0,0);
      const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000*60*60*24));
      setDaysLeftState(diff > 0? diff : 0);
    } else {
      const trialEnd = new Date(); trialEnd.setDate(trialEnd.getDate()+7);
      const expStr = trialEnd.toISOString().slice(0,10);
      setExpiry(expStr);
      localStorage.setItem(expiryKey, expStr);
    }
    if(saved){ try{ const p=JSON.parse(saved); if(p.length>0) setItems(p);}catch{ setItems(finalType==="hardware"?INITIAL_ITEMS:SUPERMARKET_ITEMS) } }
    else { setItems(finalType==="hardware"?INITIAL_ITEMS:SUPERMARKET_ITEMS); }
    if(savedHist){ try{ setHistory(JSON.parse(savedHist)); }catch{} }
    if(savedSales) setSalesToday(Number(savedSales));
    if(savedProfit) setProfitToday(Number(savedProfit));
  }, [shopId]);

  const getStockKey = (type: string) => `dukapulse_${shopId}_${type}_stock_v11`;
  const saveStock = (newItems: Item[], type = shopType) => { if(!shopId) return; setItems(newItems); localStorage.setItem(getStockKey(type), JSON.stringify(newItems)); };
  const saveHistory = (newHist: Record<string, DailyRecord>) => { if(!shopId) return; setHistory(newHist); localStorage.setItem(`dukapulse_${shopId}_${shopType}_history_v11`, JSON.stringify(newHist)); };

  const handleLogin = () => {
    if(!loginInput.trim()) return alert("Enter shop name");
    const id = loginInput.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    localStorage.setItem("dukapulse_current_shop", id);
    setShopId(id); setShopName(loginInput.trim());
  };

  const switchShopType = (type: "hardware"|"supermarket") => {
    if(type===shopType) return;
    if(cart.length>0 &&!confirm("Cart will clear - switch to "+type.toUpperCase()+"?")) return;
    setShopType(type);
    setCart([]);
    setCategory("All");
    if(shopId){
      localStorage.setItem(`dukapulse_${shopId}_shoptype_v11`, type);
      const key = getStockKey(type);
      const saved = localStorage.getItem(key);
      if(saved){ try{ setItems(JSON.parse(saved)); }catch{ setItems(type==="hardware"?INITIAL_ITEMS:SUPERMARKET_ITEMS); } }
      else { setItems(type==="hardware"?INITIAL_ITEMS:SUPERMARKET_ITEMS); }
      const salesKey = `dukapulse_${shopId}_${type}_sales_today_v11`;
      const profitKey = `dukapulse_${shopId}_${type}_profit_today_v11`;
      const histKey = `dukapulse_${shopId}_${type}_history_v11`;
      setSalesToday(Number(localStorage.getItem(salesKey) || 0));
      setProfitToday(Number(localStorage.getItem(profitKey) || 0));
      const h = localStorage.getItem(histKey);
      setHistory(h? JSON.parse(h) : {});
    }
  };

  const tryEnterOwnerMode = () => { if(isOwnerMode){ setIsOwnerMode(false); return; } setOwnerPinPrompt(true); };
  const confirmOwnerPin = () => {
    if(ownerPinInput === ownerPin){ setIsOwnerMode(true); setOwnerPinPrompt(false); setOwnerPinInput(""); }
    else { alert("Wrong PIN!"); setOwnerPinInput(""); }
  };
  const handleChangePin = () => {
    if(changePinData.oldPin!== ownerPin) return alert("Old PIN wrong! Current PIN is "+ownerPin);
    if(changePinData.newPin.length < 4) return alert("New PIN must be 4+ digits");
    if(changePinData.newPin!== changePinData.confirmPin) return alert("PINs don't match!");
    const newPinVal = changePinData.newPin;
    setOwnerPin(newPinVal);
    if(shopId) localStorage.setItem(`dukapulse_${shopId}_owner_pin_v10`, newPinVal);
    setChangePinData({oldPin:"", newPin:"", confirmPin:""});
    setShowChangePin(false);
    alert(`PIN CHANGED! New PIN: ${newPinVal}`);
  };
  const handleRestock = (id: number) => {
    const addQty = parseInt(restockInputs[id] || "0");
    if(!addQty) return alert("Enter qty");
    const newItems = items.map(it => it.id===id? {...it, stock: it.stock + addQty} : it);
    saveStock(newItems);
    setRestockInputs(prev => ({...prev, [id]: ""}));
  };
  const handleAddNewProduct = () => {
    if(!newP.name ||!newP.buy ||!newP.sell ||!newP.stock ||!newP.category) return alert("Fill all fields");
    const newItem: Item = { id: Date.now(), name: newP.name, buy: parseInt(newP.buy), sell: parseInt(newP.sell), stock: parseInt(newP.stock), category: newP.category };
    saveStock([...items, newItem]);
    setNewP({name:"", buy:"", sell:"", stock:"", category:""});
    setShowAddForm(false);
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) && (category==="All" || i.category===category));
  const addToCart = (item: Item) => {
    if(item.stock<=0) return alert("Out of stock - RESTOCK!");
    setCart(prev => {
      const f = prev.find(p=>p.id===item.id);
      if(f) return prev.map(p=>p.id===item.id?{...p, qty:p.qty+1}:p);
      return [...prev, {...item, qty:1, customSell: item.sell}];
    });
  };
  const updateCartPrice = (id: number, newPrice: string) => {
    const price = parseInt(newPrice) || 0;
    setCart(prev => prev.map(p=> p.id===id? {...p, customSell: price} : p));
  };
  const updateCartQty = (id: number, newQty: string) => {
    const qty = parseInt(newQty) || 1;
    setCart(prev => prev.map(p=> p.id===id? {...p, qty: qty} : p));
  };

  const totalSell = cart.reduce((s,i)=>s+i.customSell*i.qty,0);
  const totalBuy = cart.reduce((s,i)=>s+i.buy*i.qty,0);
  const totalProfit = totalSell - totalBuy;
  const monthKey = getTodayKey().slice(0,7);
  const monthData = Object.entries(history).filter(([k])=> k.startsWith(monthKey));
  const monthSales = monthData.reduce((s,[,v])=>s+v.sales,0) + salesToday;
  const monthProfit = monthData.reduce((s,[,v])=>s+v.profit,0) + profitToday;
  const daysWorked = monthData.length + (salesToday>0?1:0) || 1;

  const handleSale = () => {
    if(cart.length===0) return alert("Cart empty!");
    if(!confirm(`Sell KES ${totalSell} in ${shopType}?`)) return;
    let newItems=[...items];
    cart.forEach(c=>{ newItems=newItems.map(it=> it.id===c.id? {...it, stock: it.stock - c.qty} : it); });
    saveStock(newItems);
    const key = getTodayKey();
    const newHist = {...history};
    if(!newHist[key]) newHist[key] = {sales:0, profit:0, count:0};
    newHist[key] = {sales: newHist[key].sales + totalSell, profit: newHist[key].profit + totalProfit, count: newHist[key].count + 1};
    saveHistory(newHist);
    setSalesToday(s=>{const ns=s+totalSell; if(shopId) localStorage.setItem(`dukapulse_${shopId}_${shopType}_sales_today_v11`, String(ns)); return ns;});
    setProfitToday(p=>{const np=p+totalProfit; if(shopId) localStorage.setItem(`dukapulse_${shopId}_${shopType}_profit_today_v11`, String(np)); return np;});
    const id = "RCPT-"+Date.now().toString().slice(-6);
    const kraNo = genKRAInv(id);
    const qrValue = `${shopName.toUpperCase()}|TYPE:${shopType.toUpperCase()}|KRA PIN:P051234567Z|CU:${kraNo}|ID:${id}|TOTAL:KES ${totalSell}|VERIFY:https://etims.kra.go.ke/verify/${kraNo}`;
    const rec={ id, kraNo, qrValue, date:new Date().toLocaleString(), cart, total:totalSell, phone: mpesaPhone || "Walk-in", customer: customerName || "Walk-in", method: mpesaPhone? "M-PESA" : "CASH", shopName, kraPin: "P051234567Z", shopType };
    setReceipt(rec);
  };
  const closeReceipt=()=>{setReceipt(null); setCart([]); setMpesaPhone(""); setCustomerName("");};

  if(!shopId){
    return (
      <main style={{fontFamily:"system-ui", minHeight:"100vh", background:"linear-gradient(135deg,#000,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
        <div style={{background:"white", padding:30, borderRadius:16, maxWidth:420, width:"100%", textAlign:"center"}}>
          <h1 style={{margin:0, fontWeight:900, fontSize:22}}>DUKAPULSE - LOGIN</h1>
          <p style={{fontSize:11, color:"#666"}}>Hardware + Supermarket POS</p>
          <input value={loginInput} onChange={e=>setLoginInput(e.target.value)} placeholder="Enter Shop Name e.g. Mumias Hardware" style={{width:"100%", padding:14, borderRadius:10, border:"2px solid black", marginTop:15, fontWeight:700}}/>
          <button onClick={handleLogin} style={{width:"100%", background:"black", color:"white", padding:14, borderRadius:10, fontWeight:900, marginTop:12, border:"none", cursor:"pointer"}}>START →</button>
        </div>
      </main>
    )
  }

  const allCats = Array.from(new Set(items.map(i=>i.category)));

  return (
    <main style={{fontFamily:"system-ui", padding:10, maxWidth:1400, margin:"0 auto", background:"#f0f2f5", minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#000,#1e40af)", color:"white", padding:10, borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8}}>
        <div>
          <h1 style={{margin:0, fontSize:13, fontWeight:900}}>DUKAPULSE - {shopName.toUpperCase()} [{shopType.toUpperCase()}] {isOwnerMode? "(Owner)" : ""}</h1>
          <p style={{margin:"2px 0 0 0", fontSize:9, opacity:0.8}}>{items.length} Items ● Today KES {salesToday.toLocaleString()} ● {shopType}</p>
        </div>
        <div style={{display:"flex", gap:6, alignItems:"center"}}>
          <div style={{display:"flex", gap:0, background:"#222", padding:2, borderRadius:20, border:"1px solid #555"}}>
            <button onClick={()=>switchShopType("hardware")} style={{background: shopType==="hardware"?"#facc15":"transparent", color: shopType==="hardware"?"black":"white", border:"none", padding:"5px 12px", borderRadius:20, fontWeight:900, fontSize:10, cursor:"pointer"}}>🔧 HARDWARE</button>
            <button onClick={()=>switchShopType("supermarket")} style={{background: shopType==="supermarket"?"#22c55e":"transparent", color: shopType==="supermarket"?"black":"white", border:"none", padding:"5px 12px", borderRadius:20, fontWeight:900, fontSize:10, cursor:"pointer"}}>🛒 SUPERMARKET</button>
          </div>
          <button onClick={tryEnterOwnerMode} style={{background: isOwnerMode? "#facc15" : "white", color:"black", padding:"5px 12px", borderRadius:20, fontWeight:800, fontSize:10, border:"none", cursor:"pointer"}}>{isOwnerMode? "Selling Mode" : "Owner"}</button>
          <button onClick={()=>{localStorage.removeItem("dukapulse_current_shop"); setShopId(null);}} style={{background:"white", color:"black", padding:"5px 10px", borderRadius:20, fontWeight:700, fontSize:10, border:"none"}}>Logout</button>
        </div>
      </div>

      {isOwnerMode && (
        <div style={{background: shopType==="hardware"?"linear-gradient(90deg,#facc15,#f59e0b)":"linear-gradient(90deg,#22c55e,#16a34a)", color: shopType==="hardware"?"black":"white", padding:"8px 12px", borderRadius:10, marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center", border:"2px solid #000"}}>
          <div style={{fontWeight:900, fontSize:11}}>OWNER - {shopType.toUpperCase()} - TRIAL till {expiry}</div>
          <div style={{display:"flex", gap:6}}>
            <button onClick={()=>{ setNewP({name:"", buy:"", sell:"", stock:"", category: allCats[0]||""}); setShowAddForm(true);}} style={{background:"black", color: shopType==="hardware"?"#facc15":"#22c55e", border:"none", padding:"5px 12px", borderRadius:20, fontWeight:800, fontSize:10, cursor:"pointer"}}>ADD {shopType.toUpperCase()} PRODUCT</button>
            <button onClick={()=>setShowChangePin(true)} style={{background:"white", color:"black", border:"2px solid black", padding:"5px 10px", borderRadius:20, fontWeight:700, fontSize:10, cursor:"pointer"}}>Change PIN</button>
          </div>
        </div>
      )}

      {isOwnerMode && (
        <div style={{background:"#1a1a1a", color:"white", padding:10, borderRadius:12, marginTop:8, border:"2px solid #000"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
            <div style={{fontWeight:900, fontSize:12, color: shopType==="hardware"?"#facc15":"#22c55e"}}>PROFIT - {shopType.toUpperCase()} - {daysLeftState}d left</div>
            <div style={{display:"flex", gap:4}}>
              {["Today","7 Days","Month"].map(v=>(
                <button key={v} onClick={()=>setProfitView(v as any)} style={{background: profitView===v? (shopType==="hardware"?"#facc15":"#22c55e") : "#333", color: profitView===v? "black" : "white", border:"none", padding:"4px 8px", borderRadius:15, fontSize:10, fontWeight:700, cursor:"pointer"}}>{v}</button>
              ))}
            </div>
          </div>
          <div style={{background: shopType==="hardware"?"linear-gradient(90deg,#facc15,#fb923c)":"linear-gradient(90deg,#22c55e,#4ade80)", color:"black", padding:"10px 12px", borderRadius:8, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
            <div><div style={{fontSize:9, fontWeight:700}}>MONTH: {monthKey}</div><div style={{fontSize:16, fontWeight:900}}>KES {monthSales.toLocaleString()}</div></div>
            <div><div style={{fontSize:9, fontWeight:700}}>TOTAL PROFIT</div><div style={{fontSize:16, fontWeight:900}}>KES {monthProfit.toLocaleString()}</div></div>
            <div><div style={{fontSize:9, fontWeight:700}}>DAYS</div><div style={{fontSize:16, fontWeight:900}}>{daysWorked}</div></div>
          </div>
          <button onClick={()=>setIsOwnerMode(false)} style={{background: shopType==="hardware"?"#facc15":"#22c55e", color:"black", border:"none", padding:"5px 14px", borderRadius:6, fontWeight:800, fontSize:11, marginTop:8, cursor:"pointer"}}>Lock</button>
        </div>
      )}

      <div style={{display:"flex", gap:5, marginTop:8, flexWrap:"wrap"}}>
        {["All",...allCats].map(cat=>(
          <button key={cat} onClick={()=>setCategory(cat)} style={{background: category===cat?"black":"white", color: category===cat?"white":"black", border:"1px solid #ddd", padding:"4px 10px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer"}}>{cat}</button>
        ))}
      </div>

      <div style={{display:"grid", gridTemplateColumns:"2.2fr 0.9fr", gap:10, marginTop:10}}>
        <div style={{background:"white", borderRadius:12, padding:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${items.length} ${shopType} items...`} style={{width:"100%", padding:8, borderRadius:8, border:"1px solid #ddd", marginBottom:8, fontSize:12}}/>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, maxHeight:"68vh", overflowY:"auto"}}>
            {filtered.map(item=>(
              <div key={item.id} style={{padding:6, border:"1px solid #eee", borderRadius:8, background:"white"}}>
                <div style={{fontWeight:700, fontSize:10}}>{item.name}</div>
                <div style={{fontSize:8, color:"#666"}}>Stock {item.stock} - B{ item.buy} - S{item.sell}</div>
                {isOwnerMode? (
                  <div style={{display:"flex", gap:3, marginTop:4}}>
                    <input value={restockInputs[item.id]||""} onChange={e=>setRestockInputs({...restockInputs, [item.id]: e.target.value})} placeholder="+qty" style={{width:50, padding:3, borderRadius:4, border:"1px solid #ccc", fontSize:10}}/>
                    <button onClick={()=>handleRestock(item.id)} style={{background:"#10b981", color:"white", border:"none", padding:"3px 8px", borderRadius:4, fontSize:9, fontWeight:700, cursor:"pointer"}}>RESTOCK</button>
                  </div>
                ) : (
                  <button onClick={()=>addToCart(item)} style={{background: shopType==="hardware"?"#facc15":"#22c55e", border:"none", padding:"3px 8px", borderRadius:4, fontWeight:800, fontSize:9, marginTop:4, cursor:"pointer"}}>ADD</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"white", borderRadius:12, padding:10, height:"fit-content", position:"sticky", top:10}}>
          <h3 style={{margin:"0 0 8px 0", fontSize:12}}>Cart - {shopType.toUpperCase()}</h3>
          {cart.map(c=>(
            <div key={c.id} style={{borderBottom:"1px solid #eee", padding:"6px 0"}}>
              <div style={{display:"flex", justifyContent:"space-between", fontSize:10}}>
                <span>{c.name.slice(0,18)} x{c.qty}</span>
                <button onClick={()=>setCart(prev=>prev.filter(p=>p.id!==c.id))} style={{background:"#fee", border:"none", borderRadius:4, fontSize:9}}>X</button>
              </div>
              <div style={{display:"flex", gap:3, marginTop:3, alignItems:"center"}}>
                <span style={{fontSize:9}}>Price:</span>
                <input value={c.customSell} onChange={e=>updateCartPrice(c.id, e.target.value)} style={{width:65, padding:2, borderRadius:4, border:"1px solid #000", fontSize:11, fontWeight:700}}/>
                <span style={{fontSize:9}}>= {c.customSell * c.qty}</span>
              </div>
              <div style={{display:"flex", gap:3, marginTop:2}}>
                <span style={{fontSize:9}}>Qty:</span>
                <input value={c.qty} onChange={e=>updateCartQty(c.id, e.target.value)} type="number" style={{width:45, padding:2, borderRadius:4, border:"1px solid #ccc", fontSize:10}}/>
              </div>
            </div>
          ))}
          <div style={{marginTop:8}}>
            <div style={{fontWeight:900, fontSize:14}}>Total: KES {totalSell.toLocaleString()}</div>
            <div style={{fontSize:9, color:"#666"}}>Profit KES {totalProfit.toLocaleString()} - {shopType}</div>
          </div>
          <input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Customer Name" style={{width:"100%", padding:6, borderRadius:6, border:"1px solid #ddd", marginTop:6, fontSize:11}}/>
          <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} placeholder="07xxxxxxxxx" style={{width:"100%", padding:8, borderRadius:8, border:"2px solid #000", marginTop:4, fontSize:11}}/>
          <button onClick={handleSale} style={{width:"100%", background:"black", color:"white", border:"none", padding:10, borderRadius:8, fontWeight:900, marginTop:6, cursor:"pointer", fontSize:11}}>LIPA NA M-PESA / CASH - {shopType.toUpperCase()}</button>
        </div>
      </div>

      {receipt && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20}}>
          <div style={{background:"white", padding:20, borderRadius:14, maxWidth:380, width:"100%", textAlign:"center"}}>
            <h2 style={{margin:0, fontSize:14, fontWeight:900}}>{receipt.shopName.toUpperCase()} - {receipt.shopType.toUpperCase()} RECEIPT</h2>
            <p style={{fontSize:9, margin:"4px 0", color:"#555"}}>KRA PIN: {receipt.kraPin} | {receipt.kraNo}</p>
            <div style={{fontSize:10, marginTop:8, textAlign:"left"}}>
              {receipt.cart.map((c:any)=><div key={c.id} style={{display:"flex", justifyContent:"space-between"}}><span>{c.name} x{c.qty}</span><span>{c.customSell*c.qty}</span></div>)}
            </div>
            <div style={{borderTop:"2px solid black", marginTop:8, paddingTop:6, display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:13}}>
              <span>TOTAL</span><span>KES {receipt.total.toLocaleString()}</span>
            </div>
            <div style={{marginTop:12, display:"flex", justifyContent:"center"}}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(receipt.qrValue)}`} alt="QR" style={{width:150, height:150, border:"2px solid #000"}}/>
            </div>
            <div style={{background: receipt.shopType==="hardware"?"linear-gradient(90deg,#facc15,#f59e0b)":"linear-gradient(90deg,#22c55e,#16a34a)", color: receipt.shopType==="hardware"?"black":"white", fontWeight:900, fontSize:13, padding:"8px 10px", borderRadius:8, marginTop:10}}>
              Asante kwa kununua nasi. Karibu tena!
            </div>
            <div style={{fontSize:8, color:"#666", marginTop:4}}>Thank you for shopping with us. Welcome again!</div>
            <div style={{fontSize:7, color:"#999", marginTop:4}}>{receipt.date} | {receipt.method} | {receipt.shopType}</div>
            <button onClick={closeReceipt} style={{width:"100%", background:"black", color:"white", padding:10, borderRadius:8, marginTop:10, border:"none", fontWeight:800, cursor:"pointer"}}>DONE</button>
          </div>
        </div>
      )}

      {ownerPinPrompt && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999}}>
          <div style={{background:"white", padding:18, borderRadius:12, maxWidth:300, width:"90%"}}>
            <h3 style={{marginTop:0, fontSize:14}}>Enter Owner PIN</h3>
            <input value={ownerPinInput} onChange={e=>setOwnerPinInput(e.target.value)} type="password" placeholder="PIN 1234" style={{width:"100%", padding:10, borderRadius:8, border:"2px solid black"}}/>
            <button onClick={confirmOwnerPin} style={{width:"100%", background:"black", color:"white", padding:10, borderRadius:8, marginTop:8, fontWeight:800}}>ENTER</button>
            <button onClick={()=>setOwnerPinPrompt(false)} style={{width:"100%", background:"#eee", padding:8, borderRadius:8, marginTop:6, border:"none"}}>Cancel</button>
          </div>
        </div>
      )}

      {showAddForm && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:10}}>
          <div style={{background:"white", padding:16, borderRadius:12, maxWidth:380, width:"100%"}}>
            <h3 style={{marginTop:0}}>Add {shopType.toUpperCase()} Product</h3>
            <input value={newP.name} onChange={e=>setNewP({...newP, name:e.target.value})} placeholder="Name e.g. Unga 2kg / Cement" style={{width:"100%", padding:8, borderRadius:6, border:"1px solid #ccc", marginBottom:6}}/>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6}}>
              <input value={newP.buy} onChange={e=>setNewP({...newP, buy:e.target.value})} placeholder="Buy" type="number" style={{padding:8, borderRadius:6, border:"1px solid #ccc"}}/>
              <input value={newP.sell} onChange={e=>setNewP({...newP, sell:e.target.value})} placeholder="Sell" type="number" style={{padding:8, borderRadius:6, border:"1px solid #ccc"}}/>
              <input value={newP.stock} onChange={e=>setNewP({...newP, stock:e.target.value})} placeholder="Stock" type="number" style={{padding:8, borderRadius:6, border:"1px solid #ccc"}}/>
              <input value={newP.category} onChange={e=>setNewP({...newP, category:e.target.value})} placeholder={`Category e.g. ${shopType==="hardware"?"Cement":"Flour"}`} style={{padding:8, borderRadius:6, border:"1px solid #ccc"}}/>
            </div>
            <button onClick={handleAddNewProduct} style={{width:"100%", background:"#16a34a", color:"white", padding:10, borderRadius:8, marginTop:10, border:"none", fontWeight:800}}>ADD TO {shopType.toUpperCase()}</button>
            <button onClick={()=>setShowAddForm(false)} style={{width:"100%", background:"#eee", padding:8, borderRadius:8, marginTop:6, border:"none"}}>Cancel</button>
          </div>
        </div>
      )}

      {showChangePin && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10000, padding:20}}>
          <div style={{background:"white", padding:18, borderRadius:12, maxWidth:320, width:"100%"}}>
            <h3 style={{marginTop:0}}>Change Owner PIN</h3>
            <p style={{fontSize:10, color:"#666"}}>Current PIN: {ownerPin}</p>
            <input value={changePinData.oldPin} onChange={e=>setChangePinData({...changePinData, oldPin:e.target.value})} placeholder="Old PIN" type="password" style={{width:"100%", padding:9, borderRadius:8, border:"1px solid #ccc", marginBottom:6}}/>
            <input value={changePinData.newPin} onChange={e=>setChangePinData({...changePinData, newPin:e.target.value})} placeholder="New PIN (4 digits)" type="password" style={{width:"100%", padding:9, borderRadius:8, border:"1px solid #ccc", marginBottom:6}}/>
            <input value={changePinData.confirmPin} onChange={e=>setChangePinData({...changePinData, confirmPin:e.target.value})} placeholder="Confirm New PIN" type="password" style={{width:"100%", padding:9, borderRadius:8, border:"1px solid #ccc", marginBottom:6}}/>
            <button onClick={handleChangePin} style={{width:"100%", background:"black", color:"white", padding:10, borderRadius:8, fontWeight:800, border:"none", cursor:"pointer"}}>CHANGE PIN</button>
            <button onClick={()=>setShowChangePin(false)} style={{width:"100%", background:"#f3f4f6", padding:8, borderRadius:8, border:"none", marginTop:6, cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

    </main>
  );
}
