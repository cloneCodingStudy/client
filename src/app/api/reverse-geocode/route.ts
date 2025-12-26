import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  console.log('Client ID:', process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID);
  console.log('Client Secret exists:', !!process.env.NAVER_MAP_CLIENT_SECRET);
  console.log('Client Secret length:', process.env.NAVER_MAP_CLIENT_SECRET?.length);

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&output=json`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID!,
          'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET!,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Naver API error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json({ error: 'Reverse geocoding failed' }, { status: 500 });
  }
}