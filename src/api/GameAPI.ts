import { ResponseDto, GameDto, GameOptions } from "../types/GameTypes";

const BASE_URL = "http://localhost:8443/api/v1/game";

export async function joinGame(gameId: string, token: string): Promise<ResponseDto<GameDto>> {
  try {
    const response = await fetch(`${BASE_URL}/${gameId}`, {
      method: "PATCH", // matches your @PatchMapping
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // attempt to parse backend error message if sent as JSON
      let errorMsg = `Join game failed: ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody?.message) errorMsg = `Join game failed: ${errorBody.message}`;
      } catch {}
      throw new Error(errorMsg);
    }

    // correctly typed as ResponseDto<GameDto>
    const data: ResponseDto<GameDto> = await response.json();
    return data;

  } catch (error) {
    console.error("Error during trying to join game:", error);
    throw error;
  }
}

export async function leaveGame(token: string): Promise<ResponseDto<GameDto>> {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "PATCH", // matches your @PatchMapping
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // attempt to parse backend error message if sent as JSON
      let errorMsg = `Leave game failed: ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody?.message) errorMsg = `Leave game failed: ${errorBody.message}`;
      } catch {}
      throw new Error(errorMsg);
    }

    // correctly typed as ResponseDto<GameDto>
    const data: ResponseDto<GameDto> = await response.json();
    return data;

  } catch (error) {
    console.error("Error during trying to join game:", error);
    throw error;
  }
}

export async function deleteGame(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Delete game failed');
      }
      return response.json();
    } catch (error) {
      console.error('Error during trying to delete game:', error);
      throw error;
    }
}

export async function createGame(gameOptions: GameOptions, token: string): Promise<ResponseDto<GameDto>> {
    console.log(gameOptions);
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gameOptions)
      });
  
      if (!response.ok) {
            // handle specific status codes
            if (response.status === 400) {
                const errorBody = await response.json(); // optional: get error details from backend
                throw new Error(`Bad Request: ${errorBody.message || 'Invalid data'}`);
            } else if (response.status === 401) {
                throw new Error('Unauthorized: Invalid token');
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getGame(token: string): Promise<ResponseDto<GameDto>> {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
            // handle specific status codes
            if (response.status === 400) {
                const errorBody = await response.json(); // optional: get error details from backend
                throw new Error(`Bad Request: ${errorBody.message || 'Invalid data'}`);
            } else if (response.status === 401) {
                throw new Error('Unauthorized: Invalid token');
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getGameById(gameId: string, token: string): Promise<ResponseDto<GameDto>> {
    try {
      const response = await fetch(`${BASE_URL}/${gameId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
            // handle specific status codes
            if (response.status === 400) {
                const errorBody = await response.json(); // optional: get error details from backend
                throw new Error(`Bad Request: ${errorBody.message || 'Invalid data'}`);
            } else if (response.status === 401) {
                throw new Error('Unauthorized: Invalid token');
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}