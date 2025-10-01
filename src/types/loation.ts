export interface UserLocation {
  region: string; //전체 주소
  city: string; //시
  district: string; //구
  neighborhood: string; //동
  lat: number; //위도
  lon: number; //경도
}

export interface LocationState {
  location: UserLocation | null;
  setLocation: (loc: UserLocation) => void;
  clearLocation: () => void;
}
