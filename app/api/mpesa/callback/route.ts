import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('CALLBACK RECEIVED:', JSON.stringify(body))
  } catch (e) {
    console.log('Callback parse error', e)
  }
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
