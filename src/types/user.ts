export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  accessToken: string;
  refreshToken?: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
}
