  import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.MPESA_CONSUMER_KEY || ''
  const secret = process.env.MPESA_CONSUMER_SECRET || ''
  const shortcode = process.env.MPESA_SHORTCODE || ''
  const env = process.env.MPESA_ENV || 'NOT SET'
  const passkey = process.env.MPESA_PASSKEY || ''
  const isProd = env === 'production'
  const base = isProd ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
  const auth = Buffer.from(`${key}:${secret}`).toString('base64')
  let tokenResult: any = {}
  try {
    const r = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } })
    const text = await r.text()
    try { tokenResult = JSON.parse(text) } catch { tokenResult = { raw: text } }
  } catch (e: any) { tokenResult = { error: e.message } }
  return NextResponse.json({
    ENV: env,
    BASE_URL: base,
    KEY_EXISTS: key ? 'YES' : 'NO',
    KEY_LENGTH: key.length + ' chars (should be 30-40)',
    KEY_STARTS: key.slice(0, 4) + '...',
    SECRET_EXISTS: secret ? 'YES' : 'NO',
    SECRET_LENGTH: secret.length + ' chars (should be 30-40)',
    SHORTCODE: shortcode,
    PASSKEY_LENGTH: passkey.length + ' chars (should be 64)',
    SAFARICOM_SAYS: tokenResult,
    RESULT: tokenResult.access_token ? 'TOKEN SUCCESS' : 'TOKEN FAILED'
  })
} 
