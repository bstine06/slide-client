import { HttpError } from "../types/ErrorTypes";
import { ResponseDto, GameDto, CreateGamePayload } from "../types/GameTypes";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/v1/game`;

// //TODO configure this so it comes from env
// const BASE_URL = "http://192.168.68.67:8443/api/v1/game"

export async function joinGame(
    gameId: string,
    token: string
): Promise<ResponseDto<GameDto>> {
    try {
        const response = await fetch(`${BASE_URL}/${gameId}`, {
            method: "PATCH",
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

export async function leaveGame(token: string): Promise<ResponseDto<GameDto>> {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: "PATCH", // matches your @PatchMapping
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

export async function deleteGame(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: "DELETE",
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

export async function createGame(
    createGamePayload: CreateGamePayload,
    token: string
): Promise<ResponseDto<GameDto>> {
    console.log(JSON.stringify(createGamePayload));
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(createGamePayload),
        });

        if (!response.ok) await HttpError.fromResponse(response);
        return response.json();
    } catch (err) {
        throw HttpError.fromUnknown(err);
    }
}

export async function getGame(token: string): Promise<ResponseDto<GameDto>> {
    try {
        const response = await fetch(`${BASE_URL}`, {
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

export async function getGameById(
    gameId: string,
    token: string
): Promise<ResponseDto<GameDto>> {
    try {
        const response = await fetch(`${BASE_URL}/${gameId}`, {
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
