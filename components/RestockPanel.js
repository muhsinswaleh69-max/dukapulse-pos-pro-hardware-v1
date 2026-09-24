import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function RestockPanel({ item, onRestocked }) {
  const [adding, setAdding] = useState(10)
  const [loading, setLoading] = useState(false)

  const handleRestock = async () => {
    setLoading(true)
    const newStock = item.stock + parseInt(adding)
    
    // Update in Supabase - owner's shop only!
    const { error } = await supabase
      .from('items')
      .update({ stock: newStock })
      .eq('id', item.id)
      .eq('shop_id', item.shop_id) // security: can only restock own shop

    if(!error) {
      alert(`✅ Restocked ${item.name} - New stock: ${newStock}`)
      onRestocked(newStock)
    } else {
      alert("Error: " + error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{display:'flex', gap: '5px', alignItems:'center'}}>
      <input 
        type="number" 
        value={adding} 
        onChange={(e)=>setAdding(e.target.value)}
        style={{width:'60px', padding:'5px'}}
        placeholder="+qty"
      />
      <button 
        onClick={handleRestock} 
        disabled={loading}
        style={{background:'green', color:'white', padding:'5px 10px', borderRadius:'5px'}}
      >
        {loading ? '...' : 'RESTOCK'}
      </button>
    </div>
  )
}
