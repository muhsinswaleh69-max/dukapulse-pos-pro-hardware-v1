// SKYNET CYBER - KRA eTIMS INTEGRATION MODULE
// For DukaPulse POS Pro Hardware v1
// Author: Eng. Muhsin Swaleh - 0718899014
// Date: Oct 2026

export const KRA_CONFIG = {
  pin: process.env.NEXT_PUBLIC_KRA_PIN || "A000000000Z",
  bhfId: "00",
  taxRate: 16,
  mode: "PRODUCTION", // Change to SANDBOX for testing
};

// 1. Generate KRA Compliant Invoice Number
export function generateKRAInvoiceNumber() {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.floor(1000 + Math.random()*9000);
  return `CUINV${date}${rand}`;
}

// 2. Calculate VAT 16%
export function calculateVAT(amount, isVATInclusive = true) {
  if (isVATInclusive) {
    const taxable = amount / 1.16;
    const vat = amount - taxable;
    return { 
      taxable: taxable.toFixed(2), 
      vat: vat.toFixed(2), 
      total: amount.toFixed(2) 
    };
  } else {
    const vat = amount * 0.16;
    const total = amount + vat;
    return { 
      taxable: amount.toFixed(2), 
      vat: vat.toFixed(2), 
      total: total.toFixed(2) 
    };
  }
}

// 3. Build eTIMS Payload for KRA API
export function buildETIMSPayload(sale) {
  const invoiceNo = generateKRAInvoiceNumber();
  const vatCalc = calculateVAT(sale.total);

  return {
    invoiceNo,
    pin: KRA_CONFIG.pin,
    bhfId: KRA_CONFIG.bhfId,
    date: new Date().toISOString(),
    items: sale.items.map(item => ({
      name: item.name,
      qty: item.qty,
      price: item.price,
      vatRate: item.vatApplicable ? 16 : 0,
      total: item.qty * item.price
    })),
    taxableAmount: vatCalc.taxable,
    vatAmount: vatCalc.vat,
    totalAmount: vatCalc.total,
    qrCode: `https://etims.kra.go.ke/verify/${invoiceNo}`,
    traderName: sale.shopName || "SHIANDA HARDWARE",
  };
}

// 4. Send to KRA (MOCK - Replace with real API later)
export async function sendToKRA(payload) {
  console.log("Sending to KRA eTIMS:", payload);
  
  // TODO: Replace this with real KRA call:
  // const res = await fetch("https://etims-api.kra.go.ke/v1/invoices", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", "Authorization": "Bearer YOUR_TOKEN" },
  //   body: JSON.stringify(payload)
  // });

  // For now, simulate success
  return {
    success: true,
    kraInvoiceNo: payload.invoiceNo,
    qrCode: payload.qrCode,
    message: "Invoice transmitted to KRA successfully"
  };
}
