import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("MPESA CALLBACK:", JSON.stringify(body))

    const callback = body?.Body?.stkCallback
    const resultCode = callback?.ResultCode
    const metadata = callback?.CallbackMetadata?.Item || []

    let lastTx = ""
    let amount = 0
    let phone = ""

    for (const item of metadata) {
      if (item.Name === "MpesaReceiptNumber") lastTx = item.Value
      if (item.Name === "Amount") amount = item.Value
      if (item.Name === "PhoneNumber") phone = item.Value
    }

    if (resultCode === 0) {
      console.log("PAID:", lastTx, amount, phone)
      // TODO: Here save to DB / mark sale as paid
    } else {
      console.log("NOT PAID:", callback?.ResultDesc)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "OK" })
  } catch (e) {
    console.log("Callback error", e)
    return NextResponse.json({ ResultCode: 0, ResultDesc: "OK" })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Callback is live" })
}
