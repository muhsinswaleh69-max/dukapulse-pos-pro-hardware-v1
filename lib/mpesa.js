const MPESA_BASE = process.env.MPESA_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

export async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("Missing MPESA keys in .env");
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  
  const res = await fetch(`${MPESA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store'
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// FIX 1: Use Kenya Time (EAT), not server time - this paralyzes prompt
export function getTimestamp() {
  const date = new Date().toLocaleString("en-US", { timeZone: "Africa/Nairobi" });
  const d = new Date(date);
  const pad = (n) => ("0" + n).slice(-2);
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function lipaNaMpesaOnline(phone, amount) {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE; // e.g., 174379
  const passkey = process.env.MPESA_PASSKEY;
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  // FIX 2: Callback MUST be public HTTPS, not localhost
  const callbackURL = process.env.MPESA_CALLBACK_URL; // https://yourdomain.com/api/mpesa/callback

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount),
    PartyA: phone, // Must be 2547XXXXXXXX
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: callbackURL,
    AccountReference: "DukaPulse",
    TransactionDesc: "Payment for goods"
  };

  const res = await fetch(`${MPESA_BASE}/mpesa/stkpush/v1/processquery`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  return data; // Will contain CheckoutRequestID
}
