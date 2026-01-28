export interface User {
  birthDate: string;
  phoneNumber: string;
  email: string;
  id: number;
  username: string;
  nickname: string;
  address: string;
  accessToken?: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
}
