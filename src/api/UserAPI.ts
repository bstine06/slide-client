import {
    CredentialsCheckResponse,
    UserProfileResponse,
} from "../types/AuthenticationTypes";
import { HttpError } from "../types/ErrorTypes";
import { ResponseDto } from "../types/GameTypes";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/v1/user`;

// //TODO configure this so it comes from env
// const BASE_URL = "http://192.168.68.67:8443/api/v1/user"

export async function checkUsernameAvailability(
    username: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `${BASE_URL}/check/username?username=${username}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) await HttpError.fromResponse(response);
        const data: CredentialsCheckResponse = await response.json();
        return data.isAvailable;
    } catch (err) {
        throw HttpError.fromUnknown(err);
    }
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
    try {
        const response = await fetch(`${BASE_URL}/check/email?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) await HttpError.fromResponse(response);
        const data: CredentialsCheckResponse = await response.json();
        return data.isAvailable;
    } catch (err) {
        throw HttpError.fromUnknown(err);
    }
}

export async function getUserProfile(
    username: string,
    token: string
): Promise<UserProfileResponse> {
    try {
        const response = await fetch(`${BASE_URL}/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) await HttpError.fromResponse(response);
        return response.json();
    } catch (err) {
        throw HttpError.fromUnknown(err);
    }
}

export async function updateUserColor(
    username: string,
    color: string,
    token: string
): Promise<UserProfileResponse> {
    try {
        const response = await fetch(`${BASE_URL}/${username}/color`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ color: color }),
        });

        if (!response.ok) await HttpError.fromResponse(response);
        return response.json();
    } catch (err) {
        throw HttpError.fromUnknown(err);
    }
}
