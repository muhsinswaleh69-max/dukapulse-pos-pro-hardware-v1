'use client'
export default function Page(){
  return (
    <div style={{minHeight:'100vh', background:'#f5f7ff', display:'flex'}}>
      <aside style={{width:260, background:'linear-gradient(to bottom,#2a3bff,#7c3aed)', color:'white', padding:24}}>
        <h1 style={{fontWeight:800}}>DUKAPULSE PRO</h1>
        <p style={{fontSize:12, opacity:0.6}}>Hardware • Fixed 404</p>
        <div style={{marginTop:30, background:'rgba(255,255,255,0.2)', padding:12, borderRadius:12}}>
          ✓ System Online - 404 Fixed
        </div>
      </aside>
      <main style={{flex:1, padding:32}}>
        <h1 style={{fontSize:32, fontWeight:800}}>Welcome to DukaPulse POS Pro</h1>
        <p>Your 404 is fixed. This is now running.</p>
        <div style={{marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20}}>
          <div style={{background:'white', padding:20, borderRadius:20, boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>Cement<br/><b>KES 750</b></div>
          <div style={{background:'white', padding:20, borderRadius:20}}>Iron Sheet<br/><b>KES 1850</b></div>
          <div style={{background:'white', padding:20, borderRadius:20}}>Paint 20L<br/><b>KES 4200</b></div>
        </div>
      </main>
    </div>
  )
}
