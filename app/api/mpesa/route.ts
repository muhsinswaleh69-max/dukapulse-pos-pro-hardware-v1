import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json()
    const isProd = process.env.MPESA_ENV === 'production'
    const base = isProd ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
    const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } })
    const tokenData = await tokenRes.json()
    const access_token = tokenData.access_token
    if (!access_token) {
      return NextResponse.json({ error: 'Failed to get token - check CONSUMER_KEY / CONSUMER_SECRET in Vercel' }, { status: 500 })
    }
    let formattedPhone = phone.replace(/^0/, '254').replace(/[^0-9]/g, '')
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dukapulse-pos-pro-hardware-v1-cu7h7hoz0-muhsin9.vercel.app'
    const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
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
        CallBackURL: `${appUrl}/api/mpesa/callback`,
        AccountReference: 'DukaPulse',
        TransactionDesc: 'DukaPulse Hardware Payment'
      })
    })
    const data = await stkRes.json()
    console.log('STK RESPONSE:', data)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
