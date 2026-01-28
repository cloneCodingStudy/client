import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imp_uid, merchant_uid, amount } = body;

    if (!imp_uid || !merchant_uid) {
      return NextResponse.json({ message: "결제 정보가 누락되었습니다." }, { status: 400 });
    }

    return NextResponse.json({
      message: "결제 검증 요청 성공",
      data: { imp_uid, merchant_uid, amount }
    });
  } catch (error) {
    return NextResponse.json({ message: "서버 내부 에러" }, { status: 500 });
  }
}