export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthenticatePayload {
    username: string;
    password: string;
}

export interface AuthResponse {
  token: string;
  message: string | null;
}

export interface CredentialsCheckResponse {
  isAvailable: boolean;
  message: string | null;
}

export interface UserProfileResponse {
    username: string;
    email: string;
    currentGameId: string;
    color: string;
}