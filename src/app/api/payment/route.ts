import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.imp_uid || !body?.merchant_uid) {
    return NextResponse.json(
      { message: "결제 정보가 누락되었습니다." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "테스트 결제 검증 완료",
    imp_uid: body.imp_uid,
    merchant_uid: body.merchant_uid,
    amount: body.amount ?? null,
  });
}