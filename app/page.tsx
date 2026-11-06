"use client"
import { useState, useEffect } from 'react'

type Product = { id: number; name: string; price: number; cost: number; stock: number; category: string }
type Sale = { id: string; total: number; profit: number; date: number; items: { name: string; qty: number; price: number }[]; customer: string; method: string; checkoutId: string }

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Cement - Bamburi 50kg', price: 600, cost: 520, stock: 118, category: 'Cement' },
  { id: 2, name: 'Cement - Savannah 50kg', price: 570, cost: 500, stock: 80, category: 'Cement' },
  { id: 3, name: 'Cement - Simba 50kg', price: 590, cost: 510, stock: 90, category: 'Cement' },
  { id: 4, name: 'Timber - 2x2 8ft', price: 350, cost: 260, stock: 120, category: 'Timber' },
  { id: 5, name: 'Timber - 2x3 10ft', price: 450, cost: 330, stock: 100, category: 'Timber' },
  { id: 6, name: 'Paint - Crown 4L White', price: 1850, cost: 1400, stock: 45, category: 'Paint' },
  { id: 7, name: 'Paint - Crown 4L Cream', price: 1850, cost: 1400, stock: 30, category: 'Paint' },
  { id: 8, name: 'Plumbing - PVC Pipe 3m', price: 450, cost: 320, stock: 60, category: 'Plumbing' },
  { id: 9, name: 'Plumbing - Tap Mixer', price: 1200, cost: 850, stock: 25, category: 'Plumbing' },
  { id: 10, name: 'Electrical - Cable 2.5mm Roll', price: 2800, cost: 2100, stock: 20, category: 'Electrical' },
  { id: 11, name: 'Electrical - Socket Double', price: 350, cost: 220, stock: 80, category: 'Electrical' },
  { id: 12, name: 'Nails - 3 Inch 1kg', price: 250, cost: 180, stock: 150, category: 'Hardware' },
  { id: 13, name: 'Iron Sheet - Mabati 2.5m', price: 950, cost: 750, stock: 70, category: 'Hardware' },
  { id: 14, name: 'Door - Steel Door', price: 7500, cost: 5800, stock: 10, category: 'Hardware' },
]
const CATEGORIES = ['All','Cement','Timber','Paint','Plumbing','Electrical','Hardware']

export default function Home(){
  const [shopName,setShopName]=useState(''); const [shopLocation,setShopLocation]=useState(''); const [kraPin,setKraPin]=useState(''); const [etimsNo,setEtimsNo]=useState(''); const [ownerPin,setOwnerPin]=useState('1234'); const [isSetup,setIsSetup]=useState(false)
  const [view,setView]=useState<'pos'|'owner'>('pos'); const [pinInput,setPinInput]=useState(''); const [ownerUnlocked,setOwnerUnlocked]=useState(false)
  const [products,setProducts]=useState<Product[]>(DEFAULT_PRODUCTS); const [sales,setSales]=useState<Sale[]>([])
  const [cart,setCart]=useState<{product:Product; qty:number; customPrice:number}[]>([])
  const [cat,setCat]=useState('All'); const [search,setSearch]=useState(''); const [customer,setCustomer]=useState(''); const [phone,setPhone]=useState('')
  const [loading,setLoading]=useState(false)
  // NEW: payment states
  const [paymentStatus,setPaymentStatus]=useState<'idle'|'waiting'|'paid'>('idle')
  const [checkoutId,setCheckoutId]=useState(''); const [paidAmount,setPaidAmount]=useState(0); const [receiptNo,setReceiptNo]=useState(''); const [mpesaCode,setMpesaCode]=useState('')
  const [showAdd,setShowAdd]=useState(false); const [newName,setNewName]=useState(''); const [newPrice,setNewPrice]=useState(''); const [newCost,setNewCost]=useState(''); const [newStock,setNewStock]=useState(''); const [newCat,setNewCat]=useState('Hardware')
  const [profitTab,setProfitTab]=useState<'day'|'week'|'month'>('day')

  useEffect(()=>{ const s=localStorage.getItem('dp_shop'); const p=localStorage.getItem('dp_products'); const sa=localStorage.getItem('dp_sales'); const pin=localStorage.getItem('dp_pin'); if(s){const j=JSON.parse(s); setShopName(j.name); setShopLocation(j.location); setKraPin(j.kraPin||''); setEtimsNo(j.etimsNo||''); setIsSetup(true)} if(p) setProducts(JSON.parse(p)); if(sa) setSales(JSON.parse(sa)); if(pin) setOwnerPin(pin)},[])
  const saveProducts=(p:Product[])=>{setProducts(p); localStorage.setItem('dp_products',JSON.stringify(p))}
  const saveSales=(s:Sale[])=>{setSales(s); localStorage.setItem('dp_sales',JSON.stringify(s))}

  const handleSetup=()=>{ if(!shopName) return alert('Enter shop name e.g Mumias Hardware'); localStorage.setItem('dp_shop',JSON.stringify({name:shopName, location:shopLocation||'Mumias', kraPin, etimsNo})); localStorage.setItem('dp_pin',ownerPin); setIsSetup(true)}

  const filtered=products.filter(p=>(cat==='All'||p.category===cat)&&p.name.toLowerCase().includes(search.toLowerCase()))
  const total=cart.reduce((a,i)=>a+i.customPrice*i.qty,0)
  const totalProfit=cart.reduce((a,i)=>a+(i.customPrice-i.product.cost)*i.qty,0)
  const vat = Math.round(total * 16 / 116) // VAT inclusive 16%
  const exVat = total - vat

  const addToCart=(product:Product)=>{ setCart(prev=>{const f=prev.find(i=>i.product.id===product.id); if(f) return prev.map(i=>i.product.id===product.id?{...i,qty:i.qty+1}:i); return [...prev,{product,qty:1,customPrice:product.price}]})}

  // --- M-PESA: STEP 1 - SEND STK, GO TO WAITING, NOT PAID ---
  const handleMpesa=async()=>{
    if(cart.length===0) return alert('Cart is empty'); if(!phone) return alert('Enter customer phone'); if(!confirm(`Lipa KES ${total} via M-PESA to 254${phone.replace(/^0/,'')}?`)) return
    setLoading(true)
    try{
      const res=await fetch('/api/mpesa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,amount:total})})
      const data=await res.json()
      if(data.ResponseCode==='0'||data.ResponseCode===0){
        setCheckoutId(data.CheckoutRequestID)
        setPaymentStatus('waiting') // <-- WAITING ONLY, NOT PAID
      } else alert(data.errorMessage||'STK Failed')
    }catch(e:any){alert(e.message)}
    setLoading(false)
  }

  // --- STEP 2 - CONFIRM ONLY AFTER MONEY RECEIVED ---
  const confirmPaymentReceived=()=>{
    const code = prompt('Enter M-PESA Code from customer SMS e.g QK123ABC (or leave blank if cash confirmed):')
    if(code===null) return // cancelled
    const finalReceipt='DP-'+Math.floor(100000+Math.random()*900000)
    const newSale:Sale={id:finalReceipt,total,profit:totalProfit,date:Date.now(),items:cart.map(i=>({name:i.product.name,qty:i.qty,price:i.customPrice})),customer:customer||'Walk-in',method:'M-PESA',checkoutId}
    saveSales([newSale,...sales])
    saveProducts(products.map(p=>{const c=cart.find(x=>x.product.id===p.id); return c?{...p,stock:p.stock-c.qty}:p}))
    setMpesaCode(code||''); setPaidAmount(total); setReceiptNo(finalReceipt); setPaymentStatus('paid')
  }

  const handleCash=()=>{
    if(cart.length===0) return alert('Cart empty')
    const finalReceipt='DP-'+Math.floor(100000+Math.random()*900000)
    const newSale:Sale={id:finalReceipt,total,profit:totalProfit,date:Date.now(),items:cart.map(i=>({name:i.product.name,qty:i.qty,price:i.customPrice})),customer:customer||'Walk-in',method:'CASH',checkoutId:''}
    saveSales([newSale,...sales]); saveProducts(products.map(p=>{const c=cart.find(x=>x.product.id===p.id); return c?{...p,stock:p.stock-c.qty}:p}))
    setPaidAmount(total); setReceiptNo(finalReceipt); setMpesaCode('CASH'); setPaymentStatus('paid')
  }

  const addProduct=()=>{ if(!newName||!newPrice) return alert('Enter name and price'); saveProducts([...products,{id:Date.now(),name:newName,price:Number(newPrice),cost:Number(newCost)||Number(newPrice)*0.8,stock:Number(newStock)||0,category:newCat}]); setShowAdd(false); setNewName(''); setNewPrice(''); setNewCost(''); setNewStock(''); alert('Product Added!')}
  const restock=(id:number)=>{const q=prompt('How many to add?'); if(!q) return; saveProducts(products.map(p=>p.id===id?{...p,stock:p.stock+Number(q)}:p))}
  const editPrice=(id:number)=>{const pr=prompt('New Selling Price?'); if(!pr) return; saveProducts(products.map(p=>p.id===id?{...p,price:Number(pr)}:p))}

  const now=Date.now(); const daySales=sales.filter(s=>new Date(s.date).toDateString()===new Date().toDateString()); const weekSales=sales.filter(s=>now-s.date<7*24*60*60*1000); const monthSales=sales.filter(s=>{const d=new Date(s.date); const n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()})
  const shownSales=profitTab==='day'?daySales:profitTab==='week'?weekSales:monthSales; const shownProfit=shownSales.reduce((a,s)=>a+s.profit,0); const shownRevenue=shownSales.reduce((a,s)=>a+s.total,0)

  if(!isSetup){
    return <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}><div style={{background:'white',maxWidth:440,width:'100%',borderRadius:20,padding:30}}><h1 style={{fontSize:28,fontWeight:800,margin:0}}>DukaPulse</h1><p style={{color:'#64748b'}}>Register Your Hardware Shop - KRA / eTIMS Ready</p>
    <label style={{fontSize:13,fontWeight:700}}>Shop Name</label><input value={shopName} onChange={e=>setShopName(e.target.value)} placeholder="e.g Mumias Hardware" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',margin:'6px 0 12px'}}/>
    <label style={{fontSize:13,fontWeight:700}}>Location</label><input value={shopLocation} onChange={e=>setShopLocation(e.target.value)} placeholder="e.g Mumias Town, Shianda" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',margin:'6px 0 12px'}}/>
    <label style={{fontSize:13,fontWeight:700}}>KRA PIN (for receipt)</label><input value={kraPin} onChange={e=>setKraPin(e.target.value)} placeholder="e.g A123456789B" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',margin:'6px 0 12px'}}/>
    <label style={{fontSize:13,fontWeight:700}}>eTIMS / CU Serial No (if you have)</label><input value={etimsNo} onChange={e=>setEtimsNo(e.target.value)} placeholder="e.g KRAETIMS123 / Leave blank if not yet" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',margin:'6px 0 12px'}}/>
    <label style={{fontSize:13,fontWeight:700}}>Owner PIN (Secret)</label><input value={ownerPin} onChange={e=>setOwnerPin(e.target.value)} placeholder="e.g 1234" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',margin:'6px 0 12px'}}/>
    <button onClick={handleSetup} style={{width:'100%',padding:14,borderRadius:10,border:'none',background:'#16a34a',color:'white',fontWeight:800,cursor:'pointer'}}>Register Shop →</button></div></div>
  }

  // --- WAITING SCREEN: STK SENT, NOT YET PAID ---
  if(paymentStatus==='waiting'){
    return <div style={{minHeight:'100vh',background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}><div style={{background:'white',maxWidth:420,width:'100%',borderRadius:20,padding:30,textAlign:'center',boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
    <div style={{fontSize:50}}>📱</div><h1 style={{color:'#d97706'}}>WAITING FOR PAYMENT...</h1><p>STK Push sent to <b>{phone}</b></p><p style={{color:'#64748b',fontSize:14}}>Customer must enter M-PESA PIN.<br/><b style={{color:'red'}}>DO NOT GIVE GOODS YET.</b><br/>Wait for M-PESA SMS confirmation.</p>
    <div style={{background:'#f8fafc',borderRadius:12,padding:14,margin:'16px 0',textAlign:'left'}}><div style={{display:'flex',justifyContent:'space-between'}}><span>Amount:</span><b>KES {total}</b></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Items:</span><b>{cart.length}</b></div></div>
    <button onClick={confirmPaymentReceived} style={{width:'100%',padding:14,borderRadius:10,border:'none',background:'#16a34a',color:'white',fontWeight:800,cursor:'pointer',marginBottom:10}}>✅ I Have Received M-PESA SMS - Confirm Paid</button>
    <button onClick={()=>setPaymentStatus('idle')} style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',background:'white',cursor:'pointer'}}>❌ Cancel / Payment Failed - Go Back</button>
    </div></div>
  }

  // --- PAID SCREEN: ONLY AFTER CONFIRMED ---
  if(paymentStatus==='paid'){
    const lastSale = sales[0]
    return <div style={{minHeight:'100vh',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}><div style={{background:'white',maxWidth:440,width:'100%',borderRadius:20,padding:24,boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
    <div style={{textAlign:'center'}}><div style={{width:80,height:80,background:'#16a34a',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontSize:40,color:'white'}}>✓</div><h1 style={{color:'#16a34a',margin:0}}>PAID SUCCESSFULLY!</h1><p style={{margin:'4px 0 0',fontWeight:700}}>{shopName}</p><p style={{margin:0,color:'#64748b',fontSize:13}}>{shopLocation} • KRA PIN: {kraPin||'N/A'} • eTIMS: {etimsNo||'Pending'}</p></div>
    <div style={{borderTop:'1px dashed #cbd5e1',marginTop:14,paddingTop:10,fontSize:14}}>
      <div style={{display:'flex',justifyContent:'space-between'}}><span>Receipt No:</span><b>{receiptNo}</b></div>
      <div style={{display:'flex',justifyContent:'space-between'}}><span>Date:</span><span>{new Date().toLocaleString()}</span></div>
      <div style={{display:'flex',justifyContent:'space-between'}}><span>Customer:</span><b>{customer||'Walk-in'}</b></div>
      <div style={{display:'flex',justifyContent:'space-between'}}><span>M-PESA Code:</span><b>{mpesaCode||'N/A'}</b></div>
      <div style={{display:'flex',justifyContent:'space-between'}}><span>Method:</span><b>{lastSale?.method||'M-PESA'}</b></div>
    </div>
    <div style={{marginTop:12}}><b style={{fontSize:13}}>ITEMS SOLD:</b>{(lastSale?.items||cart.map(i=>({name:i.product.name,qty:i.qty,price:i.customPrice}))).map((it,idx)=>(<div key={idx} style={{display:'flex',justifyContent:'space-between',fontSize:14,padding:'4px 0',borderBottom:'1px solid #f1f5f9'}}><span>{it.name} x {it.qty} @ KES {it.price}</span><b>KES {it.price*it.qty}</b></div>))}</div>
    <div style={{marginTop:10,fontSize:14}}><div style={{display:'flex',justifyContent:'space-between'}}><span>Subtotal (Ex-VAT):</span><span>KES {exVat}</span></div><div style={{display:'flex',justifyContent:'space-between'}}><span>VAT (16%):</span><span>KES {vat}</span></div><div style={{display:'flex',justifyContent:'space-between',fontSize:18,borderTop:'1px dashed #cbd5e1',paddingTop:6,marginTop:6}}><span><b>TOTAL PAID:</b></span><b style={{color:'#16a34a'}}>KES {paidAmount}</b></div></div>
    <div style={{background:'#f8fafc',borderRadius:8,padding:10,marginTop:12,fontSize:11,color:'#64748b',textAlign:'center'}}>eTIMS Compliant Receipt • CU Serial: {etimsNo||'To be issued via KRA eTIMS'}<br/>Thank you for shopping at {shopName}! • Goods once sold are not refundable.</div>
    <button onClick={()=>window.print()} style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',background:'white',fontWeight:700,marginTop:12,cursor:'pointer'}}>🖨️ Print Receipt</button>
    <button onClick={()=>{setCart([]); setCustomer(''); setPhone(''); setPaymentStatus('idle'); setCheckoutId('')}} style={{width:'100%',padding:14,borderRadius:10,border:'none',background:'#0f172a',color:'white',fontWeight:800,marginTop:8,cursor:'pointer'}}>New Sale →</button>
    </div></div>
  }

  if(view==='owner'){
    if(!ownerUnlocked){ return <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}><div style={{background:'white',maxWidth:380,width:'100%',borderRadius:20,padding:30,textAlign:'center'}}><h2>🔒 Owner Only</h2><p style={{color:'#64748b'}}>Enter Owner PIN</p><input type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)} placeholder="Owner PIN" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',margin:'10px 0',textAlign:'center',fontSize:20}}/><button onClick={()=>{if(pinInput===ownerPin) setOwnerUnlocked(true); else alert('Wrong PIN!')}} style={{width:'100%',padding:14,borderRadius:10,border:'none',background:'#16a34a',color:'white',fontWeight:800,cursor:'pointer'}}>Unlock</button><button onClick={()=>setView('pos')} style={{width:'100%',padding:10,marginTop:10,border:'none',background:'none',cursor:'pointer'}}>← Back to POS</button></div></div> }
    return <div style={{minHeight:'100vh',background:'#f1f5f9',padding:20}}><div style={{display:'flex',justifyContent:'space-between'}}><h1>👑 {shopName} - Owner</h1><button onClick={()=>{setView('pos'); setOwnerUnlocked(false)}} style={{padding:'10px 16px',borderRadius:10,border:'none',background:'#0f172a',color:'white',cursor:'pointer'}}>Back to POS</button></div>
    <div style={{display:'flex',gap:8,margin:'16px 0'}}>{(['day','week','month'] as const).map(t=><button key={t} onClick={()=>setProfitTab(t)} style={{padding:'10px 18px',borderRadius:20,border:'none',background:profitTab===t?'#0f172a':'white',color:profitTab===t?'white':'#333',fontWeight:700,cursor:'pointer'}}>{t==='day'?'Today':t==='week'?'This Week':'This Month'}</button>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:20}}><div style={{background:'#16a34a',color:'white',borderRadius:14,padding:18}}><div>PROFIT ({profitTab})</div><div style={{fontSize:28,fontWeight:800}}>KES {shownProfit}</div></div><div style={{background:'white',borderRadius:14,padding:18}}><div>REVENUE</div><div style={{fontSize:28,fontWeight:800}}>KES {shownRevenue}</div></div><div style={{background:'white',borderRadius:14,padding:18}}><div>SALES</div><div style={{fontSize:28,fontWeight:800}}>{shownSales.length}</div></div></div>
    <button onClick={()=>setShowAdd(!showAdd)} style={{padding:'12px 18px',borderRadius:10,border:'none',background:'#f59e0b',fontWeight:800,cursor:'pointer',marginBottom:12}}>+ Add New Commodity</button>
    {showAdd && <div style={{background:'white',borderRadius:14,padding:16,marginBottom:16}}><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Product Name" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e2e8f0',marginBottom:8}}/><div style={{display:'flex',gap:8}}><input value={newPrice} onChange={e=>setNewPrice(e.target.value)} placeholder="Selling Price" type="number" style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e2e8f0'}}/><input value={newCost} onChange={e=>setNewCost(e.target.value)} placeholder="Cost Price" type="number" style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e2e8f0'}}/><input value={newStock} onChange={e=>setNewStock(e.target.value)} placeholder="Stock" type="number" style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e2e8f0'}}/></div><select value={newCat} onChange={e=>setNewCat(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e2e8f0',marginTop:8}}>{CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select><button onClick={addProduct} style={{width:'100%',padding:12,borderRadius:8,border:'none',background:'#16a34a',color:'white',fontWeight:800,marginTop:8,cursor:'pointer'}}>Save Product</button></div>}
    <div style={{background:'white',borderRadius:14,padding:16}}><h3>Stock & Price Management</h3>{products.map(p=>(<div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f1f5f9'}}><div><b>{p.name}</b><div style={{fontSize:12,color:'#64748b'}}>Stock: {p.stock} • Sell: KES {p.price} • Cost: KES {p.cost}</div></div><div style={{display:'flex',gap:6}}><button onClick={()=>restock(p.id)} style={{padding:'6px 10px',borderRadius:8,border:'none',background:'#dcfce7',cursor:'pointer',fontWeight:700}}>+ Restock</button><button onClick={()=>editPrice(p.id)} style={{padding:'6px 10px',borderRadius:8,border:'none',background:'#fef9c3',cursor:'pointer',fontWeight:700}}>✏️ Edit Price</button></div></div>))}</div>
    <div style={{background:'white',borderRadius:14,padding:16,marginTop:16}}><h3>Sales ({profitTab}) - eTIMS Record</h3>{shownSales.length===0&&<p>No sales yet.</p>}{shownSales.map(s=>(<div key={s.id} style={{padding:'8px 0',borderBottom:'1px solid #f1f5f9',fontSize:13}}><div style={{display:'flex',justifyContent:'space-between'}}><span>{new Date(s.date).toLocaleString()} • {s.customer} • {s.method}</span><span><b>KES {s.total}</b> <span style={{color:'#16a34a'}}>Profit KES {s.profit}</span></span></div><div style={{color:'#64748b'}}>{s.items.map(it=>`${it.name} x${it.qty} @ ${it.price}`).join(', ')}</div></div>))}</div></div>
  }

  return <div style={{minHeight:'100vh',background:'#f1f5f9'}}><header style={{background:'#0f172a',color:'white',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:22,fontWeight:800}}>{shopName} - DukaPulse</div><div style={{fontSize:12,opacity:0.7}}>{shopLocation} • HARDWARE POS • Seller View</div></div><button onClick={()=>setView('owner')} style={{background:'#f59e0b',border:'none',padding:'8px 14px',borderRadius:20,fontWeight:800,cursor:'pointer'}}>👑 Owner Dashboard</button></header>
  <div style={{display:'flex',gap:20,padding:20,flexWrap:'wrap'}}><div style={{flex:2,minWidth:300}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search hardware..." style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',marginBottom:12}}/><div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>{CATEGORIES.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:'8px 14px',borderRadius:20,border:'none',background:cat===c?'#0f172a':'white',color:cat===c?'white':'#334155',cursor:'pointer',fontWeight:600}}>{c}</button>)}</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>{filtered.map(p=>(<div key={p.id} style={{background:'white',borderRadius:12,padding:14}}><div style={{fontSize:11,color:'#16a34a',fontWeight:700}}>{p.category}</div><div style={{fontWeight:700}}>{p.name}</div><div style={{fontSize:12,color:'#64748b'}}>Stock {p.stock} • KES {p.price}</div><button onClick={()=>addToCart(p)} style={{width:'100%',marginTop:10,padding:10,borderRadius:8,border:'none',background:'#fde68a',fontWeight:800,cursor:'pointer'}}>ADD +</button></div>))}</div></div>
  <div style={{flex:1,minWidth:300,background:'white',borderRadius:14,padding:18,height:'fit-content'}}><h3>Cart - {shopName}</h3>{cart.length===0&&<p style={{color:'#94a3b8'}}>No items yet.</p>}{cart.map(i=>(<div key={i.product.id} style={{padding:'8px 0',borderBottom:'1px solid #f1f5f9'}}><div style={{display:'flex',justifyContent:'space-between'}}><b style={{fontSize:14}}>{i.product.name}</b><button onClick={()=>setCart(cart.filter(c=>c.product.id!==i.product.id))} style={{border:'none',background:'none',cursor:'pointer',color:'red'}}>✕</button></div><div style={{display:'flex',gap:6,alignItems:'center',marginTop:6}}><button onClick={()=>setCart(cart.map(c=>c.product.id===i.product.id?{...c,qty:Math.max(0,c.qty-1)}:c).filter(c=>c.qty>0))} style={{width:28,height:28,borderRadius:6,border:'1px solid #e2e8f0'}}>-</button><span>{i.qty}</span><button onClick={()=>setCart(cart.map(c=>c.product.id===i.product.id?{...c,qty:c.qty+1}:c))} style={{width:28,height:28,borderRadius:6,border:'1px solid #e2e8f0'}}>+</button><span style={{fontSize:12}}>Negotiate:</span><input type="number" value={i.customPrice} onChange={e=>setCart(cart.map(c=>c.product.id===i.product.id?{...c,customPrice:Number(e.target.value)}:c))} style={{width:90,padding:6,borderRadius:6,border:'1px solid #e2e8f0'}}/><b>KES {i.customPrice*i.qty}</b></div>{i.customPrice!==i.product.price&&<div style={{fontSize:11,color:'#f59e0b'}}>⚠️ Negotiated from KES {i.product.price}</div>}</div>))}
  <div style={{display:'flex',justifyContent:'space-between',fontSize:20,fontWeight:800,margin:'16px 0'}}><span>Total:</span><span>KES {total}</span></div><input value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Customer Name" style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e2e8f0',marginBottom:8}}/><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0718899014" style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e2e8f0',marginBottom:12}}/><button onClick={handleMpesa} disabled={loading} style={{width:'100%',padding:14,borderRadius:10,border:'none',background:'#16a34a',color:'white',fontWeight:800,fontSize:16,cursor:'pointer'}}>{loading?'Sending STK...':'LIPA NA M-PESA'}</button><button onClick={handleCash} style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #e2e8f0',background:'white',fontWeight:700,marginTop:8,cursor:'pointer'}}>💵 Cash Payment</button><button onClick={()=>setCart([])} style={{width:'100%',padding:10,marginTop:8,border:'none',background:'none',cursor:'pointer',color:'#64748b'}}>Clear Cart</button></div></div></div>
}
