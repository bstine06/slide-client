import { CredentialsCheckResponse, UserProfileResponse } from "../types/AuthenticationTypes";
import { ResponseDto } from "../types/GameTypes";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/v1/user`;

// //TODO configure this so it comes from env
// const BASE_URL = "http://192.168.68.67:8443/api/v1/user"

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/check/username?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Username availability check failed');
      }
  
      const data : CredentialsCheckResponse = await response.json();
      return data.isAvailable;
    } catch (error) {
      console.error('Error during username availability check:', error);
      throw error;
    }
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/check/email?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Email availability check failed');
      }
  
      const data : CredentialsCheckResponse = await response.json();
      return data.isAvailable;
    } catch (error) {
      console.error('Error during email availability check:', error);
      throw error;
    }
  }

  export async function getUserProfile(username: string, token: string): Promise<UserProfileResponse> {
    try {
      const response = await fetch(`${BASE_URL}/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        throw new Error('User profile fetch failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error while fetching user profile:', error);
      throw error;
    }
  }

  export async function updateUserColor(username: string, color: string, token: string): Promise<UserProfileResponse> {
    try {
      const response = await fetch(`${BASE_URL}/${username}/color`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({'color':color})
      });
  
      if (!response.ok) {
        throw new Error('Update user color failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error while updating user color:', error);
      throw error;
    }
  }