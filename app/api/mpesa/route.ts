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

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;
  const env = process.env.MPESA_ENV || "sandbox";
  
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const baseUrl = env === "production" 
    ? "https://api.safaricom.co.ke" 
    : "https://sandbox.safaricom.co.ke";

  const res = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' }
  );
  const data = await res.json();
  if(!data.access_token) throw new Error("Token failed: " + JSON.stringify(data));
  return data.access_token as string;
}

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();
    const token = await getAccessToken();
    const timestamp = getTimestamp();
    
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const callbackUrl = process.env.MPESA_CALLBACK_URL!;
    const env = process.env.MPESA_ENV || "sandbox";

    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    let formattedPhone = String(phone).trim();
    if(formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.slice(1);
    formattedPhone = formattedPhone.replace(/^\+/, "").replace(/\s/g, "");

    const baseUrl = env === "production" 
      ? "https://api.safaricom.co.ke" 
      : "https://sandbox.safaricom.co.ke";

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: "Mumias Hardware",
      TransactionDesc: `Payment KES ${amount}`,
    };

    const res = await fetch(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    console.log("M-Pesa Response:", data);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
