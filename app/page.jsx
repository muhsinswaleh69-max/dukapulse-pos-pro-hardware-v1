"use client"
import { useState, useEffect, useRef } from "react"

const MASTER_KEY = "dukapulse-HARDWARE-OFFLINE-v1"
const CATS = ["Cement & Concrete","Steel & Iron","Paints","Plumbing","Electrical","Tools","Nails","Timber","Roofing","Tiles"]
const UNITS = ["Bag","Pc","Kg","Mtr","Ltr","Box","Roll","Set"]

export default function Page(){
 const [active,setActive]=useState("POS Sell")
 const [store,setStore]=useState({products:[],sales:[],customers:[],mpesaQueue:[],expenses:[]})
 const [cart,setCart]=useState([])
 const [q,setQ]=useState("")
 const [isOnline,setIsOnline]=useState(true)
 const [form,setForm]=useState({})
 const [show,setShow]=useState(null)
 const [scanOn,setScanOn]=useState(false)
 const videoRef=useRef(null)

 useEffect(()=>{
  setIsOnline(navigator.onLine); window.addEventListener("online",()=>setIsOnline(true)); window.addEventListener("offline",()=>setIsOnline(false))
  try{ const m=localStorage.getItem(MASTER_KEY); if(m) setStore(JSON.parse(m)) }catch(e){}
  // PWA install
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('/sw.js').catch(()=>{}) }
 },[])
 useEffect(()=>{ localStorage.setItem(MASTER_KEY,JSON.stringify(store)) },[store])

 // 1. BARCODE SCANNER (Camera)
 const startScanner=async()=>{
  setScanOn(true)
  try{
   const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}})
   if(videoRef.current){ videoRef.current.srcObject=stream; videoRef.current.play() }
   // Native BarcodeDetector if available (offline)
   if('BarcodeDetector' in window){
    const detector=new window.BarcodeDetector({formats:['ean_13','code_128','qr_code']})
    const scan=async()=>{
     if(!scanOn) return
     try{ const codes=await detector.detect(videoRef.current); if(codes.length>0){ let code=codes[0].rawValue; let prod=store.products.find(p=>p.barcode===code); if(prod){ addToCart(prod); alert(`Scanned ${prod.name}`); stopScanner() } else { setQ(code) } } }catch(e){}
     requestAnimationFrame(scan)
    }; scan()
   }
  }catch(e){ alert("Camera failed: "+e.message) }
 }
 const stopScanner=()=>{ setScanOn(false); if(videoRef.current?.srcObject){ videoRef.current.srcObject.getTracks().forEach(t=>t.stop()) } }

 const addProduct=()=>{
  if(!form.name||!form.buyPrice||!form.sellPrice) return alert("Name, Buy, Sell required")
  const p={id:Date.now(),name:form.name.toUpperCase(),category:form.category||CATS[0],brand:form.brand||"",size:form.size||"",unit:form.unit||"Pc",buyPrice:parseFloat(form.buyPrice),sellPrice:parseFloat(form.sellPrice),stock:parseFloat(form.stock)||0,minStock:parseFloat(form.minStock)||5,shelf:form.shelf||"",barcode:form.barcode||""}
  setStore({...store,products:[...store.products,p]}); setShow(null); setForm({})
 }
 const addToCart=(prod)=>{
  const ex=cart.find(c=>c.id===prod.id); if(ex) setCart(cart.map(c=>c.id===prod.id?{...c,qty:c.qty+1}:c)); else setCart([...cart,{...prod,qty:1}])
 }

 // SELL + CREDIT BOOK LOGIC
 const sell=(method)=>{
  if(cart.length===0) return alert("Cart empty")
  let total=cart.reduce((a,b)=>a+b.sellPrice*b.qty,0)
  let profit=cart.reduce((a,b)=>a+(b.sellPrice-b.buyPrice)*b.qty,0)
  for(let c of cart){ let p=store.products.find(x=>x.id===c.id); if(p.stock<c.qty) return alert(`${p.name} stock ${p.stock}`) }

  if(method==="MPesa" &&!isOnline){
   const qItem={id:Date.now(),phone:form.mpesaPhone,amount:total,status:"QUEUED OFFLINE",date:new Date().toISOString()}
   setStore(s=>({...s,mpesaQueue:[...s.mpesaQueue,qItem]})); method="Credit-Queued-MPesa"
  }
  if(method==="MPesa" && isOnline){
   setStore(s=>({...s,mpesaQueue:[{id:Date.now(),phone:form.mpesaPhone,amount:total,status:"STK SENT",date:new Date().toISOString()},...s.mpesaQueue]}))
  }

  // Credit Book
  let customers=store.customers
  if(method.includes("Credit")||method.includes("Queued")){
   let cName=form.customerName||"Walk-in"; let ex=customers.find(x=>x.name===cName)
   if(ex) customers=customers.map(x=>x.name===cName?{...x,balance:x.balance+total,debts:[...x.debts,{id:Date.now(),total,date:new Date().toISOString(),items:cart}]}:x)
   else customers=[...customers,{id:Date.now(),name:cName,phone:form.mpesaPhone||"",balance:total,debts:[{id:Date.now(),total,date:new Date().toISOString(),items:cart}]}]
  }

  const sale={id:Date.now(),items:cart,total,profit,method,mpesaPhone:form.mpesaPhone||"",customer:form.customerName||"Walk-in",date:new Date().toISOString(),synced:!isOnline?false:true}
  const newProducts=store.products.map(p=>{ const inCart=cart.find(c=>c.id===p.id); return inCart?{...p,stock:p.stock-inCart.qty}:p })
  setStore({...store,products:newProducts,sales:[sale,...store.sales],customers,mpesaQueue:store.mpesaQueue,expenses:store.expenses})

  // 2. RECEIPT PRINT (offline)
  printReceipt(sale)
  setCart([]); setForm({})
 }

 // 2. RECEIPT PRINTER (Thermal 80mm)
 const printReceipt=(sale)=>{
  const w=window.open("","","width=300,height=600")
  w.document.write(`<html><head><style>body{font-family:monospace;width:80mm;padding:5px;font-size:12px}.c{text-align:center}.line{border-top:1px dashed #000;margin:6px 0}.r{display:flex;justify-content:space-between}</style></head><body>
   <div class=c><b>DUKAPULSE HARDWARE</b><br/>Mumias - 0712345678<br/>OFFLINE RECEIPT</div><div class=line></div>
   Date: ${new Date(sale.date).toLocaleString()}<br/>Customer: ${sale.customer}<br/>Method: ${sale.method} ${sale.mpesaPhone}<br/><div class=line></div>
   ${sale.items.map(i=>`<div class=r><span>${i.name} x${i.qty}</span><span>${i.sellPrice*i.qty}</span></div><div style="font-size:10px">${i.brand} ${i.size}</div>`).join("")}
   <div class=line></div><div class=r><b>TOTAL</b><b>KES ${sale.total}</b></div><div class=r><span>Profit</span><span>KES ${sale.profit}</span></div>
   <div class=line></div><div class=c>Thank you! ${!isOnline?"[OFFLINE SALE]":""}<br/>No internet needed</div><script>window.print();setTimeout(()=>window.close(),500)</script></body></html>`)
  w.document.close()
 }

 const filtered=store.products.filter(p=>JSON.stringify(p).toLowerCase().includes(q.toLowerCase()))
 const lowStock=store.products.filter(p=>p.stock<=p.minStock)
 const todaySales=store.sales.filter(s=>new Date(s.date).toDateString()===new Date().toDateString())
 const card={background:"#fff",padding:"14px",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,.1)"}
 const input={padding:"11px",borderRadius:"10px",border:"1px solid #ccc",width:"100%"}
 const btn={background:"#0f2e2a",color:"#fff",border:"none",padding:"10px 16px",borderRadius:"20px",fontWeight:"bold",cursor:"pointer"}

 // 5. CLOSING REPORT
 const closing={cash:todaySales.filter(s=>s.method==="Cash").reduce((a,b)=>a+b.total,0),mpesa:todaySales.filter(s=>s.method==="MPesa").reduce((a,b)=>a+b.total,0),credit:todaySales.filter(s=>s.method.includes("Credit")).reduce((a,b)=>a+b.total,0),profit:todaySales.reduce((a,b)=>a+b.profit,0),total:todaySales.reduce((a,b)=>a+b.total,0)}

 return(
 <div style={{display:"flex",minHeight:"100vh",fontFamily:"Arial",background:"#f2f4f7"}}>
  <div style={{width:"260px",background:"#0f2e2a",color:"#fff",display:"flex",flexDirection:"column"}}>
   <div style={{padding:"14px",borderBottom:"1px solid #1a423b"}}><div style={{fontWeight:900}}>DukaPulse Pro</div><div style={{fontSize:"10px",color:"#a8d5a0"}}>HARDWARE • 100% OFFLINE</div>
   <div style={{marginTop:"8px",padding:"6px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"bold",background:isOnline?"#16a34a":"#dc2626",display:"inline-block"}}>{isOnline?"● ONLINE":"○ OFFLINE - OK"}</div></div>
   <div style={{flex:1,padding:"8px"}}>
    {["POS Sell","Products","Sales History","Credit Book","MPesa Queue","Closing Report","Dashboard"].map(m=><button key={m} onClick={()=>setActive(m)} style={{display:"block",width:"100%",textAlign:"left",padding:"11px 12px",margin:"3px 0",borderRadius:"8px",border:"none",background:active===m?"#facc15":"transparent",color:active===m?"#000":"#c5f0a4",cursor:"pointer"}}>{m}</button>)}
    <div style={{marginTop:"12px",padding:"10px",background:"#1a423b",borderRadius:"10px"}}><button onClick={()=>{const b=new Blob([JSON.stringify(store,null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`DUKA-OFFLINE-${new Date().toISOString().slice(0,10)}.json`; a.click()}} style={{width:"100%",background:"#facc15",color:"#000",border:"none",padding:"9px",borderRadius:"8px",fontWeight:"bold"}}>⬇️ BACKUP OFFLINE</button></div>
   </div>
  </div>

  <div style={{flex:1,padding:"14px",overflow:"auto"}}>
   {active==="POS Sell" && (
    <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}>
     <div style={{flex:"1 1 500px"}}><div style={{display:"flex",gap:"8px",marginBottom:"10px"}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Scan or search..." style={{...input,flex:1,borderRadius:"20px"}}/><button onClick={scanOn?stopScanner:startScanner} style={{...btn,background:scanOn?"#dc2626":"#0f2e2a"}}>{scanOn?"Stop":"📷 Scan"}</button></div>
      {scanOn && <div style={{...card,marginBottom:"10px"}}><video ref={videoRef} style={{width:"100%",borderRadius:"10px",background:"#000",height:"200px"}}/><div style={{fontSize:"11px",color:"#666",textAlign:"center"}}>Point camera to barcode - Offline detection</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"8px",maxHeight:"70vh",overflowY:"auto"}}>{filtered.map(p=><div key={p.id} onClick={()=>addToCart(p)} style={{...card,cursor:"pointer",borderLeft:p.stock<=p.minStock?"4px solid red":"4px solid #16a34a"}}><div style={{fontWeight:"bold",fontSize:"13px"}}>{p.name}</div><div style={{fontSize:"11px",color:"#666"}}>{p.brand} {p.size}</div><div style={{fontSize:"12px",marginTop:"4px"}}><b>KES {p.sellPrice}</b> <small>({p.stock} {p.unit})</small></div></div>)}</div>
     </div>
     <div style={{flex:"0 0 340px",...card,height:"fit-content"}}><h3>Cart ({cart.length})</h3>{cart.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #eee",fontSize:"13px"}}><div><b>{c.name}</b><br/><small>{c.sellPrice} x {c.qty}</small></div><div><b>{c.sellPrice*c.qty}</b> <button onClick={()=>setCart(cart.filter(x=>x.id!==c.id))} style={{border:"none",background:"none"}}>❌</button></div></div>)}
      {cart.length>0 && <><div style={{marginTop:"10px",padding:"10px",background:"#f8fafc",borderRadius:"10px"}}><div style={{display:"flex",justifyContent:"space-between",fontWeight:"bold"}}><span>Total</span><span>KES {cart.reduce((a,b)=>a+b.sellPrice*b.qty,0)}</span></div></div><input value={form.customerName||""} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Customer" style={{...input,marginTop:"8px"}}/><input value={form.mpesaPhone||""} onChange={e=>setForm({...form,mpesaPhone:e.target.value})} placeholder="MPesa 2547..." style={{...input,marginTop:"8px"}}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"10px"}}><button onClick={()=>sell("Cash")} style={{...btn,background:"#16a34a"}}>💵 Cash + Print</button><button onClick={()=>sell("MPesa")} style={{...btn,background:"#000"}}>📱 MPesa + Print</button><button onClick={()=>sell("Credit")} style={{...btn,background:"#dc2626"}}>📒 Credit + Print</button><button onClick={()=>setCart([])} style={{...btn,background:"#9ca3af"}}>Clear</button></div></>}
     </div>
    </div>
   )}
   {active==="Credit Book" && (
    <div><h2>Credit Book (Madeni) - Offline</h2><div style={{display:"grid",gap:"8px"}}>{store.customers.filter(c=>c.balance>0).map(c=><div key={c.id} style={card}><div style={{display:"flex",justifyContent:"space-between"}}><div><b>{c.name}</b><br/><small>{c.phone} | Debts: {c.debts.length}</small></div><div><b style={{color:"red"}}>KES {c.balance}</b><br/><button onClick={()=>{ let amt=parseFloat(prompt(`How much paid by ${c.name}?`)); if(amt){ setStore(s=>({...s,customers:s.customers.map(x=>x.id===c.id?{...x,balance:x.balance-amt}:x)})); alert(`Paid KES ${amt} - Balance KES ${c.balance-amt}`) } }} style={{...btn,padding:"4px 10px",fontSize:"11px",marginTop:"4px"}}>Pay</button></div></div><div style={{fontSize:"11px",marginTop:"6px",background:"#f8fafc",padding:"6px",borderRadius:"6px"}}>{c.debts.slice(0,2).map(d=>`${new Date(d.date).toLocaleDateString()} KES ${d.total}`).join(" | ")}</div></div>)} {store.customers.length===0 && <div style={{color:"#999"}}>No credit sales yet</div>}</div></div>
   )}
   {active==="Closing Report" && (
    <div><h2>Today Closing - Overall Data Retained</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"10px"}}><div style={card}><div style={{fontSize:"11px"}}>TOTAL SALES TODAY</div><div style={{fontSize:"24px",fontWeight:"900"}}>KES {closing.total}</div><div style={{fontSize:"11px",color:"#666"}}>{todaySales.length} transactions</div></div><div style={card}><div style={{fontSize:"11px"}}>CASH</div><div style={{fontSize:"20px",fontWeight:"900",color:"#16a34a"}}>KES {closing.cash}</div></div><div style={card}><div style={{fontSize:"11px"}}>MPESA</div><div style={{fontSize:"20px",fontWeight:"900",color:"#000"}}>KES {closing.mpesa}</div></div><div style={card}><div style={{fontSize:"11px"}}>CREDIT (Madeni)</div><div style={{fontSize:"20px",fontWeight:"900",color:"red"}}>KES {closing.credit}</div></div><div style={card}><div style={{fontSize:"11px"}}>PROFIT TODAY</div><div style={{fontSize:"20px",fontWeight:"900",color:"#16a34a"}}>KES {closing.profit}</div></div></div>
     <div style={{...card,marginTop:"12px"}}><div style={{display:"flex",justifyContent:"space-between"}}><h3>Closing Receipt</h3><button onClick={()=>{ const s={...todaySales}; const w=window.open("","","width=300,height=600"); w.document.write(`<html><body style="font-family:monospace;width:80mm;padding:5px"><center><b>CLOSING REPORT</b><br/>${new Date().toLocaleDateString()}</center><hr/>Cash: KES ${closing.cash}<br/>MPesa: KES ${closing.mpesa}<br/>Credit: KES ${closing.credit}<br/><hr/><b>Total: KES ${closing.total}</b><br/>Profit: KES ${closing.profit}<br/><hr/>Transactions: ${todaySales.length}<br/><center>Thank you</center><script>window.print()</script></body></html>`); w.document.close() }} style={btn}>🖨️ Print Closing</button></div><div style={{fontSize:"13px"}}>Cash KES {closing.cash} + MPesa KES {closing.mpesa} + Credit KES {closing.credit} = Total KES {closing.total}<br/>Profit KES {closing.profit}</div></div>
    </div>
   )}
   {active==="Products" && <div><div style={{display:"flex",justifyContent:"space-between"}}><h2>Products Offline</h2><button onClick={()=>{setForm({category:CATS[0],unit:"Pc"}); setShow("product")}} style={btn}>+ Add</button></div><div style={{background:"#fff",borderRadius:"12px",overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}><thead><tr style={{background:"#f1f5f9"}}><th style={{padding:"10px"}}>Name</th><th>Stock</th><th>Buy</th><th>Sell</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id} style={{borderTop:"1px solid #eee"}}><td style={{padding:"10px",fontWeight:"bold"}}>{p.name} {p.brand}</td><td style={{color:p.stock<=p.minStock?"red":"green",fontWeight:"bold"}}>{p.stock} {p.unit}</td><td>{p.buyPrice}</td><td><b>{p.sellPrice}</b></td></tr>)}</tbody></table></div></div>}
   {active==="Sales History" && <div><h2>Sales History Offline</h2><div style={{background:"#fff",borderRadius:"12px",overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}><thead><tr style={{background:"#f1f5f9"}}><th style={{padding:"10px"}}>Date</th><th>Items</th><th>Total</th><th>Method</th></tr></thead><tbody>{store.sales.slice(0,100).map(s=><tr key={s.id} style={{borderTop:"1px solid #eee"}}><td style={{padding:"10px",fontSize:"11px"}}>{new Date(s.date).toLocaleString()}</td><td>{s.items.map(i=>i.name+" x"+i.qty).join(", ")}</td><td>KES {s.total}</td><td>{s.method}</td></tr>)}</tbody></table></div></div>}
   {active==="MPesa Queue" && <div style={card}><h2>MPesa Queue</h2><div>Queued: {store.mpesaQueue.filter(x=>x.status.includes("QUEUED")).length} | Sent: {store.mpesaQueue.filter(x=>x.status==="STK SENT").length}</div><div style={{marginTop:"10px"}}>{store.mpesaQueue.map(q=><div key={q.id} style={{padding:"8px",borderBottom:"1px solid #eee",fontSize:"13px"}}><b>{q.phone}</b> KES {q.amount} - {q.status}</div>)}</div></div>}
   {active==="Dashboard" && <div><h2>Dashboard - Overall Data Retained</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"10px"}}><div style={card}>Total Products <b>{store.products.length}</b></div><div style={card}>Total Sales <b>KES {store.sales.reduce((a,b)=>a+b.total,0).toLocaleString()}</b></div><div style={card}>Low Stock <b style={{color:"red"}}>{lowStock.length}</b></div><div style={card}>Credit Owed <b>KES {store.customers.reduce((a,b)=>a+b.balance,0).toLocaleString()}</b></div></div></div>}
  </div>

  {show==="product" && <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}><div style={{background:"#fff",padding:"18px",borderRadius:"16px",width:"90%",maxWidth:"500px",display:"grid",gap:"8px"}}><h3>Add Hardware</h3><input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name *" style={input}/><div style={{display:"flex",gap:"8px"}}><input type="number" value={form.buyPrice||""} onChange={e=>setForm({...form,buyPrice:e.target.value})} placeholder="Buy *" style={{...input,flex:1}}/><input type="number" value={form.sellPrice||""} onChange={e=>setForm({...form,sellPrice:e.target.value})} placeholder="Sell *" style={{...input,flex:1}}/></div><div style={{display:"flex",gap:"8px"}}><input type="number" value={form.stock||""} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="Stock" style={{...input,flex:1}}/><input value={form.barcode||""} onChange={e=>setForm({...form,barcode:e.target.value})} placeholder="Barcode" style={{...input,flex:1}}/></div><div style={{display:"flex",gap:"8px"}}><button onClick={addProduct} style={{...btn,flex:1}}>Save Offline</button><button onClick={()=>setShow(null)} style={{flex:1,border:"1px solid #ccc",padding:"11px",borderRadius:"12px",background:"#fff"}}>Cancel</button></div></div></div>}
 </div>
 )
}
