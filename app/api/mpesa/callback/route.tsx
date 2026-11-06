import { NextRequest, NextResponse } from 'next/server';


  if (cb?.ResultCode === 0) {
    const items = cb.CallbackMetadata?.Item || [];
    const get = (name: string) => items.find((i:any) => i.Name === name)?.Value;

    lastTx = {
      checkoutId: cb.CheckoutRequestID,
      mpesaCode: get("MpesaReceiptNo"),
      amount: get("Amount"),
      phone: get("PhoneNumber"),
      time: new Date().toISOString()
    };
    console.log("PAID:", lastTx)
  }
  return NextResponse.json({ ResultCode: 0, ResultDesc: "OK" });
}

export async function GET() {
  return NextResponse.  json(lastTx || {});
}
