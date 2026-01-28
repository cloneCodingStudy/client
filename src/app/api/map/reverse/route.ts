import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { message: '위도(lat)와 경도(lng)가 모두 필요합니다.' }, 
      { status: 400 }
    );
  }

  try {
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}&language=ko&region=kr`
    );

    const data = await response.json();

    if (!response.ok || data.status !== "OK") {
      console.error('Google Reverse Geocoding Error:', data.error_message || data.status);
      return NextResponse.json(
        { 
          message: data.error_message || '주소 변환에 실패했습니다.', 
          status: data.status 
        },
        { status: response.status === 200 ? 400 : response.status } 
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { message: '서버 내부 에러가 발생했습니다.' }, 
      { status: 500 }
    );
  }
}