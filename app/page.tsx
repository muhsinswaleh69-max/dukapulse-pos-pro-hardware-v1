const handleSale = async () => {
    if(cart.length===0) return alert("Cart empty!");
    
    // Normalize phone
    let phone = mpesaPhone.trim();
    if (phone.startsWith("0")) phone = "254" + phone.slice(1);
    
    const isMpesa = phone.length === 12 && phone.startsWith("254");

    if(isMpesa) {
      if(!confirm(`Lipa KES ${totalSell} via M-PESA to ${phone}?`)) return;
      
      try {
        alert("Sending STK Push to " + phone + "... Check phone");
        const res = await fetch("/api/mpesa", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ phone, amount: totalSell })
        });
        const data = await res.json();
        console.log("M-PESA:", data);

        if(data.ResponseCode !== "0" && !data.CheckoutRequestID) {
           // If API not configured yet, fallback to show error
           alert("M-Pesa Error: " + (data.errorMessage || JSON.stringify(data)) + "\nSaving as PENDING M-PESA");
        } else {
           alert("STK Sent! Ask customer to enter PIN.");
        }
      } catch (e) {
        console.error(e);
        alert("M-Pesa API not found (/api/mpesa) - Saving as CASH for now. Check console.");
      }
    } else {
      if(!confirm(`Sell KES ${totalSell} as CASH in ${shopType}?`)) return;
    }

    // --- Your existing save logic continues below ---
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
    const rec={ id, kraNo, qrValue, date:new Date().toLocaleString(), cart, total:totalSell, phone: phone || "Walk-in", customer: customerName || "Walk-in", method: isMpesa? "M-PESA" : "CASH", shopName, kraPin: "P051234567Z", shopType };
    setReceipt(rec);
  };
