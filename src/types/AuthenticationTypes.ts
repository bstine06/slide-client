export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthenticatePayload {
    username: string;
    password: string;
}