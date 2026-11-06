import { NextResponse } from 'next/server'

async function safeJson(res: Response) {
  const text = await res.text()
  if (!text) return { _empty: true, status: res.status }
  try { return JSON.parse(text) } catch { return { _raw: text, status: res.status } }
}

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json()

    if (!process.env.MPESA_CONSUMER_KEY) return NextResponse.json({ error: 'MISSING_ENV: MPESA_CONSUMER_KEY not set in Vercel' }, { status: 500 })
    if (!process.env.MPESA_CONSUMER_SECRET) return NextResponse.json({ error: 'MISSING_ENV: MPESA_CONSUMER_SECRET not set in Vercel' }, { status: 500 })
    if (!process.env.MPESA_SHORTCODE) return NextResponse.json({ error: 'MISSING_ENV: MPESA_SHORTCODE not set in Vercel' }, { status: 500 })
    if (!process.env.MPESA_PASSKEY) return NextResponse.json({ error: 'MISSING_ENV: MPESA_PASSKEY not set in Vercel' }, { status: 500 })

    const isProd = process.env.MPESA_ENV === 'production'
    const base = isProd ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
    const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } })
    const tokenData = await safeJson(tokenRes)
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'TOKEN_FAILED: Safaricom rejected your Key/Secret', details: tokenData }, { status: 500 })
    }
    const access_token = tokenData.access_token
    let formattedPhone = String(phone).replace(/^0/, '254').replace(/[^0-9]/g, '')
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    // AUTO URL - uses your current Vercel URL, no need to update manually
    const host = req.headers.get('host') || process.env.VERCEL_URL || ''
    const protocol = host.includes('localhost') ? 'http://' : 'https://'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (host ? `${protocol}${host}` : 'https://dukapulse-pos-pro-hardware-v1-299d136r8-muhsin9.vercel.app')

    const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(Number(amount)),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${appUrl}/api/mpesa/callback`,
        AccountReference: 'DukaPulse',
        TransactionDesc: 'DukaPulse Hardware Payment'
      })
    })
    const data = await safeJson(stkRes)
    console.log('STK:', data)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: 'SERVER_ERROR: ' + e.message }, { status: 500 })
  }
}
