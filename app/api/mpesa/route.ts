import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const checkoutId = url.searchParams.get('id')
    if (!checkoutId) return NextResponse.json({ status: 'waiting' })

    const isProd = process.env.MPESA_ENV === 'production'
    const base = isProd ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'

    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
    const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } })
    const tokenData = await tokenRes.json()
    const access_token = tokenData.access_token
    if (!access_token) return NextResponse.json({ status: 'waiting', error: 'No token' })

    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const queryRes = await fetch(`${base}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutId
      })
    })
    const data = await queryRes.json()
    console.log('QUERY:', data)

    // ResultCode 0 = FULLY PAID - release items
    if (data.ResultCode === '0' || data.ResultCode === 0) {
      let mpesaCode = 'Auto-confirmed'
      let amount = 0
      if (data.CallbackMetadata?.Item) {
        for (const item of data.CallbackMetadata.Item) {
          if (item.Name === 'MpesaReceiptNumber') mpesaCode = item.Value
          if (item.Name === 'Amount') amount = item.Value
        }
      }
      return NextResponse.json({ status: 'paid', mpesaCode, amount })
    }

    // Failed cases
    if (data.ResultCode === '1032' || data.ResultCode === '1037' || data.ResultCode === '2001') {
      return NextResponse.json({ status: 'failed', resultDesc: data.ResultDesc || 'Payment failed / cancelled' })
    }
    const desc = (data.ResultDesc || '').toLowerCase()
    if (desc.includes('cancel') || desc.includes('timeout') || desc.includes('wrong') || desc.includes('invalid')) {
      return NextResponse.json({ status: 'failed', resultDesc: data.ResultDesc })
    }

    // Still waiting - customer has not entered PIN yet
    return NextResponse.json({ status: 'waiting', raw: data })
  } catch (e: any) {
    return NextResponse.json({ status: 'waiting', error: e.message })
  }
}
