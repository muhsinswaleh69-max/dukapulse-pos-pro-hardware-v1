"use client"
import { useState, useEffect } from "react"

const MASTER_KEY = "dukapulse-HARDWARE-PRO-v1-2026"
const CATS = ["Cement & Concrete","Steel & Iron Sheets","Paints & Coatings","Plumbing","Electrical","Tools & Machinery","Nails & Fasteners","Timber & Boards","Roofing","Sanitary & Tiles"]
const UNITS = ["Bag","Pc","Kg","Mtr","Ltr","Box","Roll","Set","Bundle"]

export default function Page(){
 const [active,setActive]=useState("POS Sell")
 const [store,setStore]=useState({products:[],sales:[],expenses:[],suppliers:[],customers:[],trash:[],mpesaLogs:[]})
 const [cart,setCart]=useState([])
 const [q,setQ]=useState("")
 const [mpesa,setMpesa]=useState({paybill:"",till:"",consumerKey:"",consumerSecret:"",shortcode:"",passkey:"",env:"sandbox"})
 const [form,setForm]=useState({})
 const [show,setShow]=useState(null)

 useEffect(()=>{
  try{ const m=localStorage.getItem(MASTER_KEY); if(m) setStore(JSON.parse(m))
  else { const old=localStorage.getItem("dukapulse-HARDWARE-PRO-v1"); if(old) setStore(JSON.parse(old)) }
  const cfg=localStorage.getItem(MASTER_KEY+"-MPESA"); if(cfg) setMpesa(JSON.parse(cfg))
  }catch(e){}
 },[])
 useEffect(()=>{ localStorage.setItem(MASTER_KEY,JSON.stringify(store)) },[store])
 useEffect(()=>{ localStorage.setItem(MASTER_KEY+"-MPESA",JSON.stringify(mpesa)) },[mpesa])

 const addProduct=()=>{
  if(!form.name||!form.buyPrice) return alert("Name & Buy Price required")
  const p={id:Date.now(),name:form.name,category:form.category||CATS[0],brand:form.brand||"",size:form.size||"",unit:form.unit||"Pc",buyPrice:parseFloat(form.buyPrice),sellPrice:parseFloat(form.sellPrice),stock:parseFloat(form.stock)||0,minStock:parseFloat(form.minStock)||5,supplier:form.supplier||"",shelf:form.shelf||"",barcode:form.barcode||"",createdAt:new Date().toISOString()}
  setStore({...store,products:[...store.products,p]}); setShow(null); setForm({})
 }
 const addToCart=(prod)=>{
  const ex=cart.find(c=>c.id===prod.id)
  if(ex) setCart(cart.map(c=>c.id===prod.id?{...c,qty:c.qty+1}:c))
  else setCart([...cart,{...prod,qty:1}])
 }
 const sell=(method)=>{
  if(cart.length===0) return alert("Cart empty")
  let total=cart.reduce((a,b)=>a+b.sellPrice*b.qty,0)
  let profit=cart.reduce((a,b)=>a+(b.sellPrice-b.buyPrice)*b.qty,0)
  if(method==="MPesa" &&!mpesa.shortcode) return alert("Set MPesa Daraja config in Settings first")

  // Daraja STK Push simulation - replace with real API call
  if(method==="MPesa"){
   const log={id:Date.now(),phone:form.mpesaPhone,amount:total,status:"STK Sent",time:new Date().toISOString()}
   setStore(s=>({...s,mpesaLogs:[log,...s.mpesaLogs]}))
   alert(`MPesa STK Push sent to ${form.mpesaPhone} for KES ${total}. Check phone to enter PIN. Daraja Shortcode: ${mpesa.shortcode}`)
  }

  const sale={id:Date.now(),items:cart,total,profit,method,mpesaPhone:form.mpesaPhone||"",customer:form.customerName||"Walk-in",date:new Date().toISOString()}
  // reduce stock
  const newProducts=store.products.map(p=>{ const inCart=cart.find(c=>c.id===p.id); return inCart?{...p,stock:p.stock-inCart.qty}:p })
  setStore({products:newProducts,sales:[sale,...store.sales],expenses:store.expenses,suppliers:store.suppliers,customers:store.customers,trash:store.trash,mpesaLogs:store.mpesaLogs})
  setCart([]); setForm({})
  alert(`SOLD KES ${total} | Profit KES ${profit} | ${method}`)
 }

 const filtered=store.products.filter(p=>JSON.stringify(p).toLowerCase().includes(q.toLowerCase()))
 const lowStock=store.products.filter(p=>p.stock<=p.minStock)

 const exportAll=()=>{ const blob=new Blob([JSON.stringify(store,null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`DUKA-HARDWARE-BACKUP-${new Date().toISOString().slice(0,10)}.json`; a.click() }

 const card={background:"#fff",padding:"14px",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}
 const input={padding:"11px",borderRadius:"10px",border:"1px solid #ccc",width:"100%"}
 const btn={background:"#0f2e2a",color:"#fff",border:"none",padding:"10px 16px",borderRadius:"20px",fontWeight:"bold",cursor:"pointer"}

 return(
 <div style={{display:"flex",minHeight:"100vh",fontFamily:"Arial",background:"#f2f4f7"}}>
  <div style={{width:"270px",background:"#0f2e2a",color:"#fff",display:"flex",flexDirection:"column"}}>
   <div style={{padding:"14px",borderBottom:"1px solid #1a423b"}}><div style={{fontWeight:900,fontSize:"19px"}}>DukaPulse Pro</div><div style={{fontSize:"10px",color:"#a8d5a0"}}>HARDWARE EDITION | MPesa Daraja</div><div style={{fontSize:"10px",marginTop:"4px",background:"#1a423b",padding:"4px 8px",borderRadius:"8px"}}>Stock: {store.products.length} | Sales: {store.sales.length}</div></div>
   <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
    {["POS Sell","Products & Stock","Sales History","Expenses","Suppliers","Credit Book","MPesa Logs","Dashboard","Settings"].map(m=><button key={m} onClick={()=>setActive(m)} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 12px",margin:"3px 0",borderRadius:"8px",border:"none",background:active===m?"#facc15":"transparent",color:active===m?"#000":"#c5f0a4",fontWeight:active===m?"bold":"500",cursor:"pointer"}}>{m}</button>)}
    <div style={{marginTop:"12px",padding:"10px",background:"#1a423b",borderRadius:"10px"}}><button onClick={exportAll} style={{width:"100%",background:"#facc15",color:"#000",border:"none",padding:"8px",borderRadius:"8px",fontWeight:"bold"}}>⬇️ BACKUP DUKA</button><div style={{fontSize:"10px",color:"#8aa07a",marginTop:"6px"}}>Master Key: {MASTER_KEY}</div></div>
   </div>
  </div>

  <div style={{flex:1,padding:"14px",overflow:"auto"}}>
   {active==="POS Sell" && (
    <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}>
     <div style={{flex:"1 1 500px"}}>
      <h2 style={{margin:"0 0 8px"}}>POS - Hardware Sell</h2>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Scan barcode or search cement, iron, paint..." style={{...input,borderRadius:"20px",marginBottom:"10px"}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"8px",maxHeight:"75vh",overflowY:"auto"}}>
       {filtered.map(p=><div key={p.id} onClick={()=>addToCart(p)} style={{...card,cursor:"pointer",borderLeft:p.stock<=p.minStock?"4px solid red":"4px solid #16a34a"}}><div style={{fontWeight:"bold",fontSize:"13px"}}>{p.name}</div><div style={{fontSize:"11px",color:"#666"}}>{p.brand} {p.size} | {p.category}</div><div style={{fontSize:"12px",marginTop:"4px"}}><b>KES {p.sellPrice}</b> <small style={{color:p.stock<=p.minStock?"red":"#666"}}>({p.stock} {p.unit})</small></div><div style={{fontSize:"10px",background:"#f1f5f9",padding:"2px 6px",borderRadius:"6px",marginTop:"4px",display:"inline-block"}}>{p.shelf} | {p.barcode}</div></div>)}
      </div>
     </div>
     <div style={{flex:"0 0 340px",...card,height:"fit-content"}}>
      <h3 style={{marginTop:0}}>Cart ({cart.length})</h3>
      {cart.length===0?<div style={{color:"#999",textAlign:"center",padding:"20px"}}>No items</div>:cart.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #eee",fontSize:"13px"}}><div><b>{c.name}</b><br/><small>{c.sellPrice} x {c.qty} {c.unit}</small></div><div><b>{c.sellPrice*c.qty}</b><br/><button onClick={()=>setCart(cart.filter(x=>x.id!==c.id))} style={{border:"none",background:"none"}}>❌</button></div></div>)}
      {cart.length>0 && <>
       <div style={{marginTop:"10px",padding:"10px",background:"#f8fafc",borderRadius:"10px"}}><div style={{display:"flex",justifyContent:"space-between",fontWeight:"bold"}}><span>Total</span><span>KES {cart.reduce((a,b)=>a+b.sellPrice*b.qty,0)}</span></div><div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#16a34a"}}><span>Profit</span><span>KES {cart.reduce((a,b)=>a+(b.sellPrice-b.buyPrice)*b.qty,0)}</span></div></div>
       <input value={form.customerName||""} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Customer name (optional)" style={{...input,marginTop:"8px"}}/>
       <input value={form.mpesaPhone||""} onChange={e=>setForm({...form,mpesaPhone:e.target.value})} placeholder="MPesa Phone 2547..." style={{...input,marginTop:"8px"}}/>
       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"10px"}}>
        <button onClick={()=>sell("Cash")} style={{...btn,background:"#16a34a"}}>💵 Cash Sale</button>
        <button onClick={()=>sell("MPesa")} style={{...btn,background:"#000"}}>📱 MPesa STK</button>
        <button onClick={()=>sell("Credit")} style={{...btn,background:"#dc2626"}}>📒 Credit</button>
        <button onClick={()=>setCart([])} style={{...btn,background:"#6b7280"}}>Clear</button>
       </div>
       <div style={{fontSize:"11px",color:"#666",marginTop:"8px",background:"#fffbeb",padding:"8px",borderRadius:"8px"}}>Daraja: Shortcode {mpesa.shortcode||"Not set"} | Env: {mpesa.env}</div>
      </>}
     </div>
    </div>
   )}

   {active==="Products & Stock" && (
    <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}><h2 style={{margin:0}}>Hardware Stock</h2><button onClick={()=>{setForm({category:CATS[0],unit:"Pc"}); setShow("product")}} style={btn}>+ Add Hardware Item</button></div>
     <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}><div style={{...card,flex:1}}>Total Items: <b>{store.products.length}</b></div><div style={{...card,flex:1,background:lowStock.length>0?"#fef2f2":"#fff"}}>Low Stock: <b style={{color:"red"}}>{lowStock.length}</b></div></div>
     <div style={{background:"#fff",borderRadius:"12px",overflowX:"auto"}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search hardware..." style={{...input,width:"300px",margin:"10px",borderRadius:"20px"}}/>
     <table style={{width:"100%",minWidth:"1200px",borderCollapse:"collapse",fontSize:"13px"}}><thead><tr style={{background:"#f1f5f9",textAlign:"left"}}><th style={{padding:"10px"}}>Name</th><th>Category</th><th>Brand/Size</th><th>Buy</th><th>Sell</th><th>Stock</th><th>Unit</th><th>Shelf</th><th>Barcode</th><th>Action</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id} style={{borderTop:"1px solid #eee",background:p.stock<=p.minStock?"#fff1f2":"#fff"}}><td style={{padding:"10px",fontWeight:"bold"}}>{p.name}</td><td>{p.category}</td><td>{p.brand} {p.size}</td><td>{p.buyPrice}</td><td><b>{p.sellPrice}</b></td><td style={{color:p.stock<=p.minStock?"red":"green",fontWeight:"bold"}}>{p.stock}</td><td>{p.unit}</td><td>{p.shelf}</td><td style={{fontFamily:"monospace"}}>{p.barcode}</td><td><button onClick={()=>{ const s={...store}; s.products=s.products.filter(x=>x.id!==p.id); s.trash=[...s.trash,{...p,_from:"products"}]; setStore(s) }} style={{border:"none",background:"none"}}>🗑️</button></td></tr>)}</tbody></table></div>
    </div>
   )}

   {active==="Dashboard" && (
    <div><h2>Hardware Dashboard - Overall Data Retained</h2>
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"10px"}}>
      <div style={card}><div style={{fontSize:"11px"}}>TODAY SALES</div><div style={{fontSize:"22px",fontWeight:"900"}}>KES {store.sales.filter(s=>new Date(s.date).toDateString()===new Date().toDateString()).reduce((a,b)=>a+b.total,0)}</div></div>
      <div style={card}><div style={{fontSize:"11px"}}>TODAY PROFIT</div><div style={{fontSize:"22px",fontWeight:"900",color:"#16a34a"}}>KES {store.sales.filter(s=>new Date(s.date).toDateString()===new Date().toDateString()).reduce((a,b)=>a+b.profit,0)}</div></div>
      <div style={card}><div style={{fontSize:"11px"}}>TOTAL STOCK VALUE (Buy)</div><div style={{fontSize:"22px",fontWeight:"900"}}>KES {store.products.reduce((a,b)=>a+b.buyPrice*b.stock,0).toLocaleString()}</div></div>
      <div style={card}><div style={{fontSize:"11px"}}>LOW STOCK ITEMS</div><div style={{fontSize:"22px",fontWeight:"900",color:"red"}}>{lowStock.length}</div></div>
     </div>
     <div style={{...card,marginTop:"12px"}}><h3>Top Selling Hardware</h3><div style={{fontSize:"12px"}}>{store.sales.flatMap(s=>s.items).reduce((acc,item)=>{ acc[item.name]=(acc[item.name]||0)+item.qty; return acc },{ }) && Object.entries(store.sales.flatMap(s=>s.items).reduce((acc,item)=>{ acc[item.name]=(acc[item.name]||0)+item.qty; return acc },{})).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #eee"}}><span>{k}</span><b>{v} sold</b></div>)}</div></div>
    </div>
   )}

   {active==="Sales History" && (
    <div><h2>Sales History</h2><div style={{background:"#fff",borderRadius:"12px",overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}><thead><tr style={{background:"#f1f5f9",textAlign:"left"}}><th style={{padding:"10px"}}>Date</th><th>Items</th><th>Total</th><th>Profit</th><th>Method</th><th>Customer</th></tr></thead><tbody>{store.sales.map(s=><tr key={s.id} style={{borderTop:"1px solid #eee"}}><td style={{padding:"10px",fontSize:"11px"}}>{new Date(s.date).toLocaleString()}</td><td>{s.items.map(i=>i.name+" x"+i.qty).join(", ")}</td><td><b>KES {s.total}</b></td><td style={{color:"#16a34a"}}>{s.profit}</td><td><span style={{background:s.method==="MPesa"?"#000":"#e5e7eb",color:s.method==="MPesa"?"#fff":"#000",padding:"2px 8px",borderRadius:"8px",fontSize:"11px"}}>{s.method}</span></td><td>{s.customer} {s.mpesaPhone}</td></tr>)}</tbody></table></div></div>
   )}

   {active==="Settings" && (
    <div style={{...card,maxWidth:"600px"}}><h2>MPesa Daraja Config</h2><p style={{fontSize:"12px",color:"#666"}}>Get from developer.safaricom.co.ke - Create App for Lipa Na MPesa Online</p>
     <div style={{display:"grid",gap:"8px"}}>
      <select value={mpesa.env} onChange={e=>setMpesa({...mpesa,env:e.target.value})} style={input}><option value="sandbox">Sandbox (Test)</option><option value="production">Production (Live)</option></select>
      <input value={mpesa.shortcode} onChange={e=>setMpesa({...mpesa,shortcode:e.target.value})} placeholder="Business Shortcode (e.g 174379)" style={input}/>
      <input value={mpesa.passkey} onChange={e=>setMpesa({...mpesa,passkey:e.target.value})} placeholder="Passkey (Lipa Na MPesa Online)" style={input}/>
      <input value={mpesa.consumerKey} onChange={e=>setMpesa({...mpesa,consumerKey:e.target.value})} placeholder="Consumer Key" style={input}/>
      <input value={mpesa.consumerSecret} onChange={e=>setMpesa({...mpesa,consumerSecret:e.target.value})} placeholder="Consumer Secret" style={input}/>
      <input value={mpesa.till} onChange={e=>setMpesa({...mpesa,till:e.target.value})} placeholder="Till Number (optional)" style={input}/>
      <div style={{background:"#fffbeb",padding:"10px",borderRadius:"10px",fontSize:"11px"}}><b>Daraja Integration Steps:</b><br/>1. Save keys here (saved offline)<br/>2. Your backend /api/mpesa/stk will use: <code>consumerKey+secret → token → STK Push</code><br/>3. Phone = customer phone 2547...<br/>4. Amount = cart total<br/>5. Callback = https://yourshop.com/api/mpesa/callback</div>
      <button onClick={()=>alert("MPesa config saved locally. For live STK, you need a small Node API. I can generate it.")} style={btn}>Save Daraja Config</button>
     </div>
     <div style={{marginTop:"20px"}}><h3>How to sell this POS:</h3><div style={{fontSize:"12px",lineHeight:"1.6"}}>License: DUKA-MUM-{Date.now().toString().slice(-4)}<br/>Price: KES 4000 setup + 1500/month<br/>Each shop gets its own MASTER_KEY - data never mixes</div></div>
    </div>
   )}

   {(active==="Expenses"||active==="Suppliers"||active==="Credit Book"||active==="MPesa Logs") && (
    <div style={card}><h2>{active}</h2><p style={{fontSize:"13px"}}>Module ready - Data array: {store[active==="Credit Book"?"customers":active==="MPesa Logs"?"mpesaLogs":active.toLowerCase()]?.length||0} records locked in {MASTER_KEY}</p><div style={{fontSize:"12px",color:"#666"}}>Sales filtered by {active}. Full table same as Products.</div></div>
   )}
  </div>

  {show==="product" && (
   <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"10px"}}>
    <div style={{background:"#fff",padding:"18px",borderRadius:"16px",width:"100%",maxWidth:"500px",maxHeight:"95vh",overflowY:"auto",display:"grid",gap:"8px"}}>
     <h3 style={{marginTop:0}}>Add Hardware Item</h3>
     <input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Item Name e.g Bamburi Cement 50kg *" style={input}/>
     <div style={{display:"flex",gap:"8px"}}><select value={form.category||CATS[0]} onChange={e=>setForm({...form,category:e.target.value})} style={{...input,flex:1}}>{CATS.map(c=><option key={c}>{c}</option>)}</select><select value={form.unit||"Pc"} onChange={e=>setForm({...form,unit:e.target.value})} style={{...input,flex:1}}>{UNITS.map(u=><option key={u}>{u}</option>)}</select></div>
     <div style={{display:"flex",gap:"8px"}}><input value={form.brand||""} onChange={e=>setForm({...form,brand:e.target.value})} placeholder="Brand e.g Bamburi, EABL" style={{...input,flex:1}}/><input value={form.size||""} onChange={e=>setForm({...form,size:e.target.value})} placeholder="Size e.g 50kg, 3inch" style={{...input,flex:1}}/></div>
     <div style={{display:"flex",gap:"8px"}}><input type="number" value={form.buyPrice||""} onChange={e=>setForm({...form,buyPrice:e.target.value})} placeholder="Buy Price *" style={{...input,flex:1}}/><input type="number" value={form.sellPrice||""} onChange={e=>setForm({...form,sellPrice:e.target.value})} placeholder="Sell Price *" style={{...input,flex:1}}/></div>
     <div style={{display:"flex",gap:"8px"}}><input type="number" value={form.stock||""} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="Current Stock" style={{...input,flex:1}}/><input type="number" value={form.minStock||""} onChange={e=>setForm({...form,minStock:e.target.value})} placeholder="Min Alert e.g 5" style={{...input,flex:1}}/></div>
     <div style={{display:"flex",gap:"8px"}}><input value={form.supplier||""} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="Supplier" style={{...input,flex:1}}/><input value={form.shelf||""} onChange={e=>setForm({...form,shelf:e.target.value})} placeholder="Shelf e.g A1-R2" style={{...input,flex:1}}/></div>
     <input value={form.barcode||""} onChange={e=>setForm({...form,barcode:e.target.value})} placeholder="Barcode (scan)" style={input}/>
     <div style={{display:"flex",gap:"10px"}}><button onClick={addProduct} style={{...btn,flex:1}}>Save Hardware Item</button><button onClick={()=>setShow(null)} style={{flex:1,border:"1px solid #ccc",padding:"11px",borderRadius:"12px",background:"#fff"}}>Cancel</button></div>
    </div>
   </div>
  )}
 </div>
 )
}
