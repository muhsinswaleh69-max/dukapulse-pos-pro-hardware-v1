"use client";
import { useState } from "react";
import { buildETIMSPayload, sendToKRA, calculateVAT } from "@/lib/kra";

export default function KRAInvoice({ sale, onComplete }) {
  const [kraData, setKraData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendToKRA = async () => {
    setLoading(true);
    try {
      const payload = buildETIMSPayload(sale);
      const result = await sendToKRA(payload);
      if (result.success) {
        setKraData({...payload,...result });
        if (onComplete) onComplete(result);
      }
    } catch (err) {
      console.error("KRA Error:", err);
      alert("Failed to send to KRA");
    }
    setLoading(false);
  };

  const vat = calculateVAT(sale.total);

  return (
    <div className="border p-4 bg-white rounded-lg shadow-sm">
      <h3 className="font-bold text-green-700 text-lg">
        KRA eTIMS COMPLIANT INVOICE
      </h3>
      <p className="text-xs text-gray-600">
        PIN: {process.env.NEXT_PUBLIC_KRA_PIN || "A000000000Z"} | BHF: 00
      </p>

      {/* VAT Breakdown */}
      <div className="my-3 text-sm bg-gray-50 p-3 rounded">
        <div className="flex justify-between">
          <span>Taxable Amount:</span>
          <span>KES {vat.taxable}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT 16%:</span>
          <span>KES {vat.vat}</span>
        </div>
        <div className="flex justify-between font-bold border-t mt-2 pt-2">
          <span>Total:</span>
          <span>KES {vat.total}</span>
        </div>
      </div>

      {/* Before Sending */}
      {!kraData? (
        <button
          onClick={handleSendToKRA}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded font-bold"
        >
          {loading? "Sending to KRA..." : "Send to KRA & Generate QR Code"}
        </button>
      ) : (
        /* After Sending to KRA */
        <div className="mt-4">
          <p className="text-green-600 font-bold">
            ✓ Sent to KRA: {kraData.kraInvoiceNo}
          </p>
          <p className="text-xs text-gray-500">{kraData.message}</p>

          <div className="mt-3 p-3 border-2 border-dashed border-green-600 bg-green-50">
            <p className="text-xs font-bold mb-2">Scan to verify on KRA eTIMS Portal:</p>
            <div className="w-32 h-32 bg-white border flex items-center justify-center text-[10px] text-center mx-auto">
              QR CODE<br/>{kraData.qrCode}
            </div>
            <p className="text-[8px] mt-2 break-all text-center">{kraData.qrCode}</p>
            <p className="text-[9px] mt-1 text-center font-bold">KRA eTIMS VERIFIED</p>
          </div>

          <button
            onClick={()=>window.print()}
            className="mt-3 w-full bg-black text-white px-3 py-2 text-sm rounded"
          >
            Print KRA Compliant Receipt
          </button>
        </div>
      )}

      <p className="text-[10px] mt-3 text-gray-400 text-center">
        SKYNET CYBER SOLUTIONS - DukaPulse Pro v1 - KRA Module
      </p>
    </div>
  );
}
