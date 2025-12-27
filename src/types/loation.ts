export interface UserLocation {
  neighborhood: string;
  region?: string; 
  city?: string;
  district?: string;
  lat?: number;
  lng?: number;
}

export interface LocationState {
  location: UserLocation | null;
  setLocation: (loc: UserLocation) => void;
  clearLocation: () => void;
}
