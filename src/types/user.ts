export interface User {
  email: string;
  name: string;
  nickname: string;
  accessToken: string;
  refreshToken?: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
}
