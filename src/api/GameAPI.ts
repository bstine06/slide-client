import { HttpError } from "../types/ErrorTypes";
import { ResponseDto, GameDto, CreateGamePayload } from "../types/GameTypes";

const BASE_URL = "http://localhost:8443/api/v1/game";

export async function joinGame(
    gameId: string,
    token: string
): Promise<ResponseDto<GameDto>> {
    try {
        const response = await fetch(`${BASE_URL}/${gameId}`, {
            method: "PATCH", // matches your @PatchMapping
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new HttpError(
                    400,
                    errorBody.message || "Invalid data",
                    "Check your input and try again."
                );
            } else if (response.status === 401) {
                throw new HttpError(
                    401,
                    "Unauthorized: Invalid token",
                    "Please log in again."
                );
            } else if (response.status === 409) {
                throw new HttpError(
                    409,
                    errorBody.message || "Conflict occurred",
                    "Try refreshing."
                );
            } else {
                throw new HttpError(
                    response.status,
                    "Unexpected error",
                    "Please try again later."
                );
            }
        }
        return response.json();
    } catch (error) {
        // If we already have an HttpError, just rethrow
        if (error instanceof HttpError) throw error;

        // Otherwise wrap it
        throw new HttpError(500, (error as Error).message || "Unknown error");
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

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new HttpError(
                    400,
                    errorBody.message || "Invalid data",
                    "Check your input and try again."
                );
            } else if (response.status === 401) {
                throw new HttpError(
                    401,
                    "Unauthorized: Invalid token",
                    "Please log in again."
                );
            } else if (response.status === 409) {
                throw new HttpError(
                    409,
                    errorBody.message || "Conflict occurred",
                    "Try refreshing."
                );
            } else {
                throw new HttpError(
                    response.status,
                    "Unexpected error",
                    "Please try again later."
                );
            }
        }
        return response.json();
    } catch (error) {
        // If we already have an HttpError, just rethrow
        if (error instanceof HttpError) throw error;

        // Otherwise wrap it
        throw new HttpError(500, (error as Error).message || "Unknown error");
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

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new HttpError(
                    400,
                    errorBody.message || "Invalid data",
                    "Check your input and try again."
                );
            } else if (response.status === 401) {
                throw new HttpError(
                    401,
                    "Unauthorized: Invalid token",
                    "Please log in again."
                );
            } else if (response.status === 409) {
                throw new HttpError(
                    409,
                    errorBody.message || "Conflict occurred",
                    "Try refreshing."
                );
            } else {
                throw new HttpError(
                    response.status,
                    "Unexpected error",
                    "Please try again later."
                );
            }
        }
        return response.json();
    } catch (error) {
        // If we already have an HttpError, just rethrow
        if (error instanceof HttpError) throw error;

        // Otherwise wrap it
        throw new HttpError(500, (error as Error).message || "Unknown error");
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

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new HttpError(
                    400,
                    errorBody.message || "Invalid data",
                    "Check your input and try again."
                );
            } else if (response.status === 401) {
                throw new HttpError(
                    401,
                    "Unauthorized: Invalid token",
                    "Please log in again."
                );
            } else if (response.status === 409) {
                throw new HttpError(
                    409,
                    errorBody.message || "Conflict occurred",
                    "Try refreshing."
                );
            } else {
                throw new HttpError(
                    response.status,
                    "Unexpected error",
                    "Please try again later."
                );
            }
        }
        return response.json();
    } catch (error) {
        // If we already have an HttpError, just rethrow
        if (error instanceof HttpError) throw error;

        // Otherwise wrap it
        throw new HttpError(500, (error as Error).message || "Unknown error");
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

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new HttpError(
                    400,
                    errorBody.message || "Invalid data",
                    "Check your input and try again."
                );
            } else if (response.status === 401) {
                throw new HttpError(
                    401,
                    "Unauthorized: Invalid token",
                    "Please log in again."
                );
            } else if (response.status === 409) {
                throw new HttpError(
                    409,
                    errorBody.message || "Conflict occurred",
                    "Try refreshing."
                );
            } else {
                throw new HttpError(
                    response.status,
                    "Unexpected error",
                    "Please try again later."
                );
            }
        }
        return response.json();
    } catch (error) {
        // If we already have an HttpError, just rethrow
        if (error instanceof HttpError) throw error;

        // Otherwise wrap it
        throw new HttpError(500, (error as Error).message || "Unknown error");
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

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new HttpError(
                    400,
                    errorBody.message || "Invalid data",
                    "Check your input and try again."
                );
            } else if (response.status === 401) {
                throw new HttpError(
                    401,
                    "Unauthorized: Invalid token",
                    "Please log in again."
                );
            } else if (response.status === 409) {
                throw new HttpError(
                    409,
                    errorBody.message || "Conflict occurred",
                    "Try refreshing."
                );
            } else {
                throw new HttpError(
                    response.status,
                    "Unexpected error",
                    "Please try again later."
                );
            }
        }
        return response.json();
    } catch (error) {
        // If we already have an HttpError, just rethrow
        if (error instanceof HttpError) throw error;

        // Otherwise wrap it
        throw new HttpError(500, (error as Error).message || "Unknown error");
    }
}
