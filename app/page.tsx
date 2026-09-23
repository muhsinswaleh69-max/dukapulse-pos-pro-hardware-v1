"use client";
import { useState, useEffect } from "react";

type Item = {
  id: number;
  name: string;
  buy: number;
  sell: number;
  stock: number;
  category: string;
};

const initialItems: Item[] = [
  { id: 1, name: "Cement Bamburi", buy: 600, sell: 750, stock: 20, category: "Cement" },
  { id: 2, name: "Nails 2 inch", buy: 200, sell: 300, stock: 15, category: "Nails" },
  { id: 3, name: "Nails 3 inch", buy: 220, sell: 320, stock: 10, category: "Nails" },
  // your other 49 will stay, this is sample - KEEP YOUR OLD LIST and just add logic below
];

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showProfit, setShowProfit] = useState(false);
  const [pin, setPin] = useState("");
  const [newItem, setNewItem] = useState({ name: "", buy: "", sell: "", stock: "", category: "General" });

  useEffect(() => {
    const saved = localStorage.getItem("duka_items");
    if (saved) setItems(JSON.parse(saved));
    else setItems(initialItems);
  }, []);

  useEffect(() => {
    if (items.length) localStorage.setItem("duka_items", JSON.stringify(items));
  }, [items]);

  const addManualItem = () => {
    if (!newItem.name ||!newItem.buy ||!newItem.sell) return alert("Jaza kila kitu!");
    const item: Item = {
      id: Date.now(),
      name: newItem.name,
      buy: parseInt(newItem.buy),
      sell: parseInt(newItem.sell),
      stock: parseInt(newItem.stock) || 10,
      category: newItem.category,
    };
    setItems([item,...items]);
    setNewItem({ name: "", buy: "", sell: "", stock: "", category: "General" });
    setShowAdd(false);
    alert("Material added! ✅");
  };

  const totalSales = cart.reduce((s, c) => s + c.sell * c.qty, 0);
  const totalCost = cart.reduce((s, c) => s + c.buy * c.qty, 0);
  const totalProfit = totalSales - totalCost;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ fontWeight: "bold" }}>DukaPulse POS - Mumias</h1>

      <div style={{ display: "flex", gap: 10, margin: "10px 0" }}>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: "#facc15", padding: "10px 15px", borderRadius: 8, fontWeight: "bold" }}>
          + Add Material
        </button>
        <button onClick={() => setShowProfit(true)} style={{ background: "#000", color: "#facc15", padding: "10px 15px", borderRadius: 8 }}>
          🔒 My Profit
        </button>
      </div>

      {showAdd && (
        <div style={{ border: "2px solid #facc15", padding: 15, borderRadius: 10, marginBottom: 15 }}>
          <h3>Add New Material (Manual)</h3>
          <input placeholder="Name e.g. Hammer" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={{ display: "block", width: "100%", margin: "5px 0", padding: 8 }} />
          <input placeholder="Buying Price" type="number" value={newItem.buy} onChange={e => setNewItem({...newItem, buy: e.target.value})} style={{ display: "block", width: "100%", margin: "5px 0", padding: 8 }} />
          <input placeholder="Selling Price" type="number" value={newItem.sell} onChange={e => setNewItem({...newItem, sell: e.target.value})} style={{ display: "block", width: "100%", margin: "5px 0", padding: 8 }} />
          <input placeholder="Stock Qty" type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} style={{ display: "block", width: "100%", margin: "5px 0", padding: 8 }} />
          <button onClick={addManualItem} style={{ background: "#000", color: "#fff", padding: 10, width: "100%", borderRadius: 8, marginTop: 10 }}>Save Material</button>
        </div>
      )}

      {showProfit && (
        <div style={{ background: "#000", color: "#facc15", padding: 15, borderRadius: 10, marginBottom: 15 }}>
          {pin!== "1234"? (
            <div>
              <p>Enter Owner PIN to see profit:</p>
              <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" style={{ padding: 8 }} />
              <button onClick={() => { if(pin!=="1234") alert("Wrong PIN!"); }} style={{ marginLeft: 10, padding: 8 }}>Unlock</button>
              <button onClick={() => setShowProfit(false)} style={{ marginLeft: 10 }}>Close</button>
            </div>
          ) : (
            <div>
              <h3>💰 SECRET PROFIT DASHBOARD</h3>
              <p>Sales in Cart: {totalSales} KES</p>
              <p>Your Cost: {totalCost} KES</p>
              <p style={{ fontSize: 20, fontWeight: "bold" }}>PROFIT: {totalProfit} KES</p>
              <p>Margin: {totalSales? ((totalProfit/totalSales)*100).toFixed(1) : 0}%</p>
              <button onClick={() => { setShowProfit(false); setPin(""); }} style={{ background: "#facc15", color: "#000", padding: 8, borderRadius: 5 }}>Lock</button>
            </div>
          )}
        </div>
      )}

      <p><b>Cart Total (Customer sees only this):</b> {totalSales} KES</p>
      {/* Here you keep your old items list rendering */}
      <div>
        {items.map(item => (
          <div key={item.id} style={{ border: "1px solid #ddd", padding: 10, margin: "5px 0", display: "flex", justifyContent: "space-between" }}>
            <span>{item.name} - Stock:{item.stock} - {item.sell}KES</span>
            <button onClick={() => setCart([...cart, {...item, qty:1}])} style={{ background: "#facc15", padding: "5px 10px" }}>Add to Sale</button>
          </div>
        ))}
      </div>
    </div>
  );
}
