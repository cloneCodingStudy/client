import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('query');

  if (!address) {
    return NextResponse.json({ message: '주소가 필요합니다.' }, { status: 400 });
  }

  try {
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}&language=ko&region=kr`
    );

    const data = await response.json();

    if (!response.ok || data.status !== "OK") {
      return NextResponse.json(
        { message: data.error_message || '구글 지오코딩 실패', status: data.status },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: '서버 내부 에러 발생' }, { status: 500 });
  }
}