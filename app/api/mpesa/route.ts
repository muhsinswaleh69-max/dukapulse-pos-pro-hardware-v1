import { NextResponse } from "next/server";
export async function POST(req: Request) {
 try {
  const t = await req.text(); const {phone,amount}=JSON.parse(t||'{}');
  if(!phone||!amount) return NextResponse.json({error:"No phone/amount"}, {status:200});
  const key=process.env.MPESA_CONSUMER_KEY; const sec=process.env.MPESA_CONSUMER_SECRET;
  const code=process.env.MPESA_SHORTCODE; const pass=process.env.MPESA_PASSKEY;
  const cb=process.env.MPESA_CALLBACK_URL; const env=process.env.MPESA_ENV||"sandbox";
  if(!key||!sec||!code||!pass||!cb) return NextResponse.json({error:`Missing env KEY=${!!key} SEC=${!!sec} CODE=${!!code} PASS=${!!pass} CB=${!!cb}`}, {status:200});
  const auth=Buffer.from(`${key}:${sec}`).toString("base64");
  const base=env==="production"?"https://api.safaricom.co.ke":"https://sandbox.safaricom.co.ke";
  const tr=await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`,{headers:{Authorization:`Basic ${auth}`}});
  const tt=await tr.text(); let td; try{td=JSON.parse(tt)}catch{return NextResponse.json({error:"Token not JSON: "+tt.slice(0,200)}, {status:200});}
  if(!td.access_token) return NextResponse.json({error:"Token fail: "+tt}, {status:200});
  const ts=new Date(); const timestamp=ts.getFullYear()+("0"+(ts.getMonth()+1)).slice(-2)+("0"+ts.getDate()).slice(-2)+("0"+ts.getHours()).slice(-2)+("0"+ts.getMinutes()).slice(-2)+("0"+ts.getSeconds()).slice(-2);
  const pwd=Buffer.from(code+pass+timestamp).toString("base64");
  let f=String(phone).trim(); if(f.startsWith("0")) f="254"+f.slice(1); f=f.replace(/\+/g,"").replace(/\s/g,"");
  const sb={BusinessShortCode:code,Password:pwd,Timestamp:timestamp,TransactionType:"CustomerPayBillOnline",Amount:Number(amount),PartyA:f,PartyB:code,PhoneNumber:f,CallBackURL:cb,AccountReference:"Mumias Hardware",TransactionDesc:"Payment"};
  const sr=await fetch(`${base}/mpesa/stkpush/v1/processrequest`,{method:"POST",headers:{Authorization:`Bearer ${td.access_token}`,"Content-Type":"application/json"},body:JSON.stringify(sb)});
  const st=await sr.text(); let sd; try{sd=JSON.parse(st)}catch{return NextResponse.json({error:"STK not JSON: "+st.slice(0,300)}, {status:200});}
  return NextResponse.json(sd);
 } catch(e:any){ return NextResponse.json({error:e.message||String(e)}, {status:200}); }
}
