import { NextResponse } from "next/server";

function getTimestamp() {
  const d = new Date();
  return d.getFullYear() +
    ("0" + (d.getMonth()+1)).slice(-2) +
    ("0" + d.getDate()).slice(-2) +
    ("0" + d.getHours()).slice(-2) +
    ("0" + d.getMinutes()).slice(-2) +
    ("0" + d.getSeconds()).slice(-2);
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    console.log("Incoming body:", bodyText);
    if(!bodyText) throw new Error("Empty body from POS");
    const { phone, amount } = JSON.parse(bodyText);

    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const env = process.env.MPESA_ENV || "sandbox";

    if(!key || !secret || !shortcode || !passkey || !callbackUrl) {
      throw new Error(`Missing ENV: KEY=${!!key} SECRET=${!!secret} CODE=${!!shortcode} PASS=${!!passkey} CALLBACK=${!!callbackUrl}`);
    }

    const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const baseUrl = env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

    // Get token
    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const tokenText = await tokenRes.text();
    console.log("Token response:", tokenText);
    const tokenData = JSON.parse(tokenText);
    if(!tokenData.access_token) throw new Error("Token failed: " + tokenText);
    
    const timestamp = getTimestamp();
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    let formattedPhone = String(phone).trim();
    if(formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.slice(1);
    formattedPhone = formattedPhone.replace(/\+/g, "").replace(/\s/g, "");

    const stkBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount) || 1,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: "Mumias Hardware",
      TransactionDesc: `Payment KES ${amount}`,
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify(stkBody),
    });
    
    const stkText = await stkRes.text();
    console.log("STK response:", stkText);
    const stkData = JSON.parse(stkText);
    return NextResponse.json(stkData);

  } catch (e: any) {
    console.error("MPESA CRASH:", e);
    return NextResponse.json({ error: e.message }, { status: 200 }); // Return 200 so POS can read error
  }
}
