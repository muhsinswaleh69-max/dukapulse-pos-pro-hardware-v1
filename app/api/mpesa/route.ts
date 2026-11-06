import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json()

    // 1. Get Token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
    const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    })
    const { access_token } = await tokenRes.json()

    // 2. Format phone 0712... -> 254712...
    let formattedPhone = phone.replace(/^0/, '254').replace(/[^0-9]/g, '')

    // 3. Timestamp + Password
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    // 4. Send STK Push
    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Number(amount),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
        AccountReference: 'DukaPulse',
        TransactionDesc: 'DukaPulse Payment'
      })
    })

    const data = await stkRes.json()
    console.log("STK RESPONSE:", data)
    return NextResponse.json(data)
  } catch (e: any) {
    console.log("STK ERROR", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
