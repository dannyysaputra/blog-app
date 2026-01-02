export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    token: string;
  };
}
