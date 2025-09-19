const BASE_URL = 'http://localhost:8443/api/v1/auth';

import { AuthenticatePayload, RegisterPayload, AuthResponse } from "../types/AuthenticationTypes";

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
    const token = await response.json();
    return token;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

export async function authenticateUser(payload: AuthenticatePayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const token = await response.json();
    return token;
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }
}
