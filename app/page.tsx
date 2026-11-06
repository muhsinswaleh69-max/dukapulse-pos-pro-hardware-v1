"use client"
import { useState } from 'react'

type Product = { id: number; name: string; price: number; stock: number; category: string }

const PRODUCTS: Product[] = [
  { id: 1, name: 'Cement - Bamburi 50kg', price: 600, stock: 118, category: 'Cement' },
  { id: 2, name: 'Cement - Savannah 50kg', price: 570, stock: 80, category: 'Cement' },
  { id: 3, name: 'Cement - Simba 50kg', price: 590, stock: 90, category: 'Cement' },
  { id: 4, name: 'Timber - 2x2 8ft', price: 350, stock: 120, category: 'Timber' },
  { id: 5, name: 'Timber - 2x3 10ft', price: 450, stock: 100, category: 'Timber' },
  { id: 6, name: 'Paint - Crown 4L White', price: 1850, stock: 45, category: 'Paint' },
  { id: 7, name: 'Paint - Crown 4L Cream', price: 1850, stock: 30, category: 'Paint' },
  { id: 8, name: 'Plumbing - PVC Pipe 3m', price: 450, stock: 60, category: 'Plumbing' },
  { id: 9, name: 'Plumbing - Tap Mixer', price: 1200, stock: 25, category: 'Plumbing' },
  { id: 10, name: 'Electrical - Cable 2.5mm Roll', price: 2800, stock: 20, category: 'Electrical' },
  { id: 11, name: 'Electrical - Socket Double', price: 350, stock: 80, category: 'Electrical' },
  { id: 12, name: 'Nails - 3 Inch 1kg', price: 250, stock: 150, category: 'Hardware' },
  { id: 13, name: 'Iron Sheet - Mabati 2.5m', price: 950, stock: 70, category: 'Hardware' },
  { id: 14, name: 'Door - Steel Door', price: 7500, stock: 10, category: 'Hardware' },
]

const CATEGORIES = ['All', 'Cement', 'Timber', 'Paint', 'Plumbing', 'Electrical', 'Hardware']

export default function Home() {
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([])
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [paidAmount, setPaidAmount] = useState(0)
  const [paidPhone, setPaidPhone] = useState('')
  const [receiptNo, setReceiptNo] = useState('')

  const filtered = PRODUCTS.filter(p => {
    const matchCat = cat === 'All' || p.category === cat
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(i => i.product.id === product.id)
      if (found) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })
  }

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.product.id !== id))
  const changeQty = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id)
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))
  }

  const handleMpesa = async () => {
    if (cart.length === 0) return alert('Cart is empty')
    if (!phone) return alert('Enter customer phone number')
    if (!confirm(`Lipa KES ${total} via M-PESA to 254${phone.replace(/^0/, '')}?`)) return

    setLoading(true)
    try {
      const res = await fetch('/api/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: total })
      })
      const data = await res.json()
      console.log(data)
      if (data.ResponseCode === '0' || data.ResponseCode === 0) {
        // STK sent - show success screen
        setPaidAmount(total)
        setPaidPhone(phone)
        setReceiptNo('DP-' + Math.floor(100000 + Math.random() * 900000))
        setPaid(true)
      } else {
        alert(data.errorMessage || data.error || 'STK Failed. Try again.')
      }
    } catch (e: any) {
      alert('Error: ' + e.message)
    }
    setLoading(false)
  }

  const newSale = () => {
    setCart([])
    setCustomer('')
    setPhone('')
    setPaid(false)
  }

  // ===== PAID SUCCESSFULLY SCREEN =====
  if (paid) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', maxWidth: 420, width: '100%', borderRadius: 20, padding: 30, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ width: 90, height: 90, background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 45, color: 'white' }}>✓</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#16a34a', margin: '0 0 8px' }}>PAID SUCCESSFULLY!</h1>
          <p style={{ color: '#64748b', margin: '0 0 20px' }}>Payment received via M-PESA</p>

          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, textAlign: 'left', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Receipt No:</span><b>{receiptNo}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Customer:</span><b>{customer || 'Walk-in'}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Phone:</span><b>{paidPhone}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px dashed #cbd5e1', marginTop: 6, fontSize: 18 }}><span>Total Paid:</span><b style={{ color: '#16a34a' }}>KES {paidAmount}</b></div>
          </div>

          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            {cart.map(i => (
              <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14 }}>
                <span>{i.product.name} x {i.qty}</span><span>KES {i.product.price * i.qty}</span>
              </div>
            ))}
          </div>

          <button onClick={() => window.print()} style={{ width: '100%', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, marginBottom: 10, cursor: 'pointer' }}>🖨️ Print Receipt</button>
          <button onClick={newSale} style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: '#0f172a', color: 'white', fontWeight: 700, cursor: 'pointer' }}>New Sale →</button>
        </div>
      </div>
    )
  }

  // ===== MAIN HARDWARE POS =====
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#0f172a', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: 22, fontWeight: 800 }}>DukaPulse</div><div style={{ fontSize: 12, opacity: 0.7 }}>HARDWARE POS</div></div>
        <div style={{ background: '#16a34a', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>● LIVE</div>
      </header>

      <div style={{ display: 'flex', gap: 20, padding: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 300 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hardware... e.g Cement, Timber" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ padding: '8px 14px', borderRadius: 20, border: 'none', background: cat === c ? '#0f172a' : 'white', color: cat === c ? 'white' : '#334155', cursor: 'pointer', fontWeight: 600 }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>{p.category}</div>
                <div style={{ fontWeight: 700, margin: '4px 0' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Stock {p.stock} • KES {p.price}</div>
                <button onClick={() => addToCart(p)} style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 8, border: 'none', background: '#fde68a', fontWeight: 800, cursor: 'pointer' }}>ADD +</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 300, background: 'white', borderRadius: 14, padding: 18, height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 12px' }}>Cart - HARDWARE</h3>
          {cart.length === 0 && <p style={{ color: '#94a3b8', fontSize: 14 }}>No items yet. Click ADD.</p>}
          {cart.map(i => (
            <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{i.product.name}</div><div style={{ fontSize: 12, color: '#64748b' }}>KES {i.product.price} x {i.qty} = KES {i.product.price * i.qty}</div></div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button onClick={() => changeQty(i.product.id, i.qty - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}>-</button>
                <span style={{ minWidth: 20, textAlign: 'center' }}>{i.qty}</span>
                <button onClick={() => changeQty(i.product.id, i.qty + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}>+</button>
                <button onClick={() => removeFromCart(i.product.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}>✕</button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, margin: '16px 0' }}><span>Total:</span><span>KES {total}</span></div>
          <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Customer Name" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 8 }} />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0718899014" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12 }} />
          <button onClick={handleMpesa} disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: '#16a34a', color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
            {loading ? 'Sending STK...' : 'LIPA NA M-PESA'}
          </button>
          <button onClick={() => setCart([])} style={{ width: '100%', padding: 10, marginTop: 8, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Clear Cart</button>
        </div>
      </div>
    </div>
  )
}
