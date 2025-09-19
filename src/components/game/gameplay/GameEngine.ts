import { GameDto, Player } from "../../../types/GameTypes";

export class GameEngine {
    private state: GameDto;
    private ACCELERATION: number = 1.02;
    private VELOCITY: number = 0.8;
    private VELOCITY_CAP: number = 5;

    constructor(initialState: GameDto) {
        this.state = initialState;
    }

    // Called once per frame
    update(delta: number) {
        const updatedPlayers: Record<string, Player> = {};

        for (const [username, p] of Object.entries(this.state.players)) {

            const maze = this.state.mazes[p.level];

            //check for finish
            if (Math.round(p.x) === maze.finishX && Math.round(p.y) === maze.finishY) {
                this.advanceLevel(p.username);
            }

            if (p.vx === 0 && p.vy === 0) {
                if (p.nextMove) {
                    switch (p.nextMove) {
                        case "LEFT": this.moveLeft(p.username, this.VELOCITY_CAP/3); break;
                        case "RIGHT": this.moveRight(p.username, this.VELOCITY_CAP/3); break;
                        case "UP": this.moveUp(p.username, this.VELOCITY_CAP/3); break;
                        case "DOWN": this.moveDown(p.username, this.VELOCITY_CAP/3); break;
                    }
                    p.nextMove = null;
                }
                updatedPlayers[username] = { ...p }; // keep stationary player
                continue;
            }
            const board = maze.board; // for the board that player is on
            let newX = p.x + (p.vx ?? 0) * delta * 10;
            let newY = p.y + (p.vy ?? 0) * delta * 10;

            // --- Collision + acceleration ---

            // Right
            if (p.vx > 0) {
                const intX = Math.floor(newX);
                const intY = Math.floor(newY);
                if (intX > board.length - 2 || board[intY]?.[intX + 1] === 1) {
                    updatedPlayers[username] = { ...p, x: intX, y: intY, vx: 0 };
                    continue;
                }
                const newVx = Math.min(p.vx * this.ACCELERATION, this.VELOCITY_CAP);
                newX = p.x + newVx * delta * 10;
                updatedPlayers[username] = { ...p, x: newX, y: newY, vx: newVx, vy: p.vy };
                continue;
            }

            // Left
            if (p.vx < 0) {
                const intX = Math.ceil(newX);
                const intY = Math.floor(newY);
                if (intX < 1 || board[intY]?.[intX - 1] === 1) {
                    updatedPlayers[username] = { ...p, x: intX, y: intY, vx: 0 };
                    continue;
                }
                const newVx = Math.max(p.vx * this.ACCELERATION, -1 * this.VELOCITY_CAP);
                newX = p.x + newVx * delta * 10;
                updatedPlayers[username] = { ...p, x: newX, y: newY, vx: newVx, vy: p.vy };
                continue;
            }

            // Down
            if (p.vy > 0) {
                const intX = Math.floor(newX);
                const intY = Math.floor(newY);
                if (intY > board.length - 2 || board[intY + 1]?.[intX] === 1) {
                    updatedPlayers[username] = { ...p, x: intX, y: intY, vy: 0 };
                    continue;
                }
                const newVy = Math.min(p.vy * this.ACCELERATION, this.VELOCITY_CAP);
                newY = p.y + newVy * delta * 10;
                updatedPlayers[username] = { ...p, x: newX, y: newY, vy: newVy, vx: p.vx };
                continue;
            }

            // Up
            if (p.vy < 0) {
                const intX = Math.floor(newX);
                const intY = Math.ceil(newY);
                if (intY < 1 || board[intY - 1]?.[intX] === 1) {
                    updatedPlayers[username] = { ...p, x: intX, y: intY, vy: 0 };
                    continue;
                }
                const newVy = Math.max(p.vy * this.ACCELERATION, -1 * this.VELOCITY_CAP);
                newY = p.y + newVy * delta * 10;
                updatedPlayers[username] = { ...p, x: newX, y: newY, vy: newVy, vx: p.vx };
                continue;
            }

            // Default (no collision, no movement)
            updatedPlayers[username] = { ...p, x: newX, y: newY };
        }

        this.state = {
            ...this.state,
            players: updatedPlayers,
        };
    }

    getState(): GameDto {
        return this.state;
    }

    // movement executors
    // initialize movement if player is stationary
    moveLeft(username: string, velocity: number = this.VELOCITY): void {
        const p = this.state.players[username];
        if (p.vx === 0 && p.vy === 0) {
            p.vx = -1 * velocity;
        } else {
            p.nextMove = "LEFT";
        }
    }
    moveRight(username: string, velocity: number = this.VELOCITY): void {
        const p = this.state.players[username];
        if (p.vx === 0 && p.vy === 0) {
            p.vx = velocity;
        } else {
            p.nextMove = "RIGHT";
        }
    }
    moveUp(username: string, velocity: number = this.VELOCITY): void {
        const p = this.state.players[username];
        if (p.vx === 0 && p.vy === 0) {
            p.vy = -1 * velocity;
        } else {
            p.nextMove = "UP";
        }
    }
    moveDown(username: string, velocity: number = this.VELOCITY): void {
        const p = this.state.players[username];
        if (p.vx === 0 && p.vy === 0) {
            p.vy = velocity;
        } else {
            p.nextMove = "DOWN";
        }
    }
    goToStart(username: string) {
        const p = this.state.players[username];
        const maze = this.state.mazes[p.level];
        p.x = maze.startX;
        p.y = maze.startY;
        p.vx = 0;
        p.vy = 0;
        
    }
    advanceLevel(username: string) {
        const p = this.state.players[username];
        const maze = this.state.mazes[++p.level];
        p.x = maze.startX;
        p.y = maze.startY;
        p.vx = 0;
        p.vy = 0;
    }
}
