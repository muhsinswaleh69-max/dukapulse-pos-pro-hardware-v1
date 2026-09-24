import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  console.log("M-Pesa Callback:", JSON.stringify(data, null, 2));
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
