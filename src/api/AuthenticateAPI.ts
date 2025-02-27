// src/services/authService.ts

const BASE_URL = 'http://localhost:8443/api/v1/auth';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload): Promise<string> {
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

    const data = await response.json();
    return data.message || 'Registration successful';
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}
