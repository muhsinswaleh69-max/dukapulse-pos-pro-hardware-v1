import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone, amount } = await req.json();
  
  // TODO: Add your Daraja API keys here later
  // For now we simulate STK push - will work without keys for testing
  
  console.log(`STK Push to ${phone} for KES ${amount}`);
  
  // Simulate success
  return NextResponse.json({
    success: true,
    message: `STK Push sent to ${phone}`,
    checkoutId: "ws_CO_" + Date.now(),
    amount
  });
}
