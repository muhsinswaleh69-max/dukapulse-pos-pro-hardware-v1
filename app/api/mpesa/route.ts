import { NextResponse } from 'next/server'

// This holds the last payment so your POS can check it
let lastTx: any = null

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("MPESA CALLBACK:", JSON.stringify(body))

    const callback = body?.Body?.stkCallback
    const resultCode = callback?.ResultCode
    const items = callback?.CallbackMetadata?.Item || []

    let receipt = ""
    let amount = 0
    let phone = ""

    for (const item of items) {
      if (item.Name === "MpesaReceiptNumber") receipt = item.Value
      if (item.Name === "Amount") amount = item.Value
      if (item.Name === "PhoneNumber") phone = item.Value
    }

    if (resultCode === 0) {
      lastTx = { receipt, amount, phone, status: "PAID", time: new Date().toISOString() }
      console.log("PAID:", lastTx)
    } else {
      lastTx = { status: "FAILED", desc: callback?.ResultDesc }
      console.log("FAILED:", callback?.ResultDesc)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "OK" })
  } catch (e) {
    console.log("Callback error", e)
    return NextResponse.json({ ResultCode: 0, ResultDesc: "OK" })
  }
}

export async function GET() {
  return NextResponse.json(lastTx || { status: "WAITING" })
}
