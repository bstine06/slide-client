export class HttpError extends Error {
    status: number;
    advice?: string;

    constructor(status: number, message: string, advice?: string) {
        super(message);
        this.status = status;
        this.advice = advice;
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    /** Converts a failed fetch Response into an HttpError */
    static async fromResponse(response: Response): Promise<never> {
        const body = await response.json().catch(() => ({}));
        const message = body.message || "Unexpected error";

        switch (response.status) {
            case 400:
                throw new HttpError(
                    400,
                    message || "Invalid data",
                    "Check your input and try again."
                );
            case 401:
                throw new HttpError(
                    401,
                    "Unauthorized: Invalid token",
                    "Please log in again."
                );
            case 409:
                throw new HttpError(
                    409,
                    message || "Conflict occurred",
                    "Try refreshing."
                );
            default:
                throw new HttpError(
                    response.status,
                    message,
                    "Please try again later."
                );
        }
    }

    /** Wraps non-HTTP errors (network, parsing, etc.) */
    static fromUnknown(error: unknown): HttpError {
        // If we already have an HttpError, just rethrow
        if (error instanceof HttpError) throw error;

        // If we can't establish a connection to the backend server
        if ((error as Error).message.startsWith("NetworkError")) {
            throw new HttpError(
                503,
                "There was a problem connecting to the server"
            );
        }

        // Otherwise wrap it
        throw new HttpError(500, (error as Error).message || "Unknown error");
    }
}
