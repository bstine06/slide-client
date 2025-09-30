import { GameDto, Player } from "../../../../types/GameTypes";

import { PlayerUpdatePayload } from "../../../../types/WebSocketMessageTypes";

type EngineEventCallback = (update: PlayerUpdatePayload) => void;

export class GameEngine {
    private state: GameDto;
    private localUsername: string;
    private ACCELERATION: number = 1.02;
    private VELOCITY: number = 1;

    private listeners: EngineEventCallback[] = [];
    private lastSentLocal: PlayerUpdatePayload | null = null;

    constructor(initialState: GameDto, localUsername: string) {
        this.state = initialState;
        this.localUsername = localUsername;
    }

    onPlayerUpdate(callback: EngineEventCallback) {
        this.listeners.push(callback);
    }

    offPlayerUpdate(callback: EngineEventCallback) {
        this.listeners = this.listeners.filter((l) => l !== callback);
    }

    private emitPlayerUpdate(update: PlayerUpdatePayload) {
        this.listeners.forEach((l) => l(update));
    }

    private isEqualPlayerState(
        a: PlayerUpdatePayload,
        b: PlayerUpdatePayload
    ): boolean {
        return (
            a.level === b.level &&
            a.x === b.x &&
            a.y === b.y &&
            a.vx === b.vx &&
            a.vy === b.vy &&
            a.nextMove === b.nextMove &&
            a.stopX === b.stopX &&
            a.stopY === b.stopY
        );
    }

    // Called once per frame
    update(delta: number) {
        const updatedPlayers: Record<string, Player> = {};

        for (const [username, p] of Object.entries(this.state.players)) {
            
            const maze = this.state.mazes[p.level];
            this.VELOCITY = maze.board.length / 15 + 5 / maze.board.length;
            const velocityCap = this.VELOCITY * 5;

            //check for finish
            if (
                Math.round(p.x) === maze.finishX &&
                Math.round(p.y) === maze.finishY
            ) {
                this.advanceLevel(p.username);
            }

            if (p.vx === 0 && p.vy === 0) {
                if (p.nextMove) {
                    switch (p.nextMove) {
                        case "LEFT":
                            this.moveLeft(p.username, velocityCap / 3);
                            break;
                        case "RIGHT":
                            this.moveRight(p.username, velocityCap / 3);
                            break;
                        case "UP":
                            this.moveUp(p.username, velocityCap / 3);
                            break;
                        case "DOWN":
                            this.moveDown(p.username, velocityCap / 3);
                            break;
                    }
                    p.nextMove = null;
                }
                updatedPlayers[username] = { ...p }; // keep stationary player
                continue;
            }
            const board = maze.board; // for the board that player is on
            let newX = p.x + (p.vx ?? 0) * delta * 10;
            let newY = p.y + (p.vy ?? 0) * delta * 10;

            // Right
            if (p.vx > 0) {
                const targetX = Math.min(newX, p.stopX!);
                if (targetX >= p.stopX!) p.vx = 0; // stop at wall
                newX = targetX;
            }

            // Left
            if (p.vx < 0) {
                const targetX = Math.max(newX, p.stopX!);
                if (targetX <= p.stopX!) p.vx = 0;
                newX = targetX;
            }

            // Down
            if (p.vy > 0) {
                const targetY = Math.min(newY, p.stopY!);
                if (targetY >= p.stopY!) p.vy = 0;
                newY = targetY;
            }

            // Up
            if (p.vy < 0) {
                const targetY = Math.max(newY, p.stopY!);
                if (targetY <= p.stopY!) p.vy = 0;
                newY = targetY;
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
        if (p.vy === 0) {
            p.vx = -1 * velocity;
            p.angle = 3 * Math.PI / 2;
            this.recalcStopPosition(p);
        } else {
            p.nextMove = "LEFT";
        }
        this.sendUpdate(p);
    }
    moveRight(username: string, velocity: number = this.VELOCITY): void {
        console.log("ENGINE MOVE RIGHT");
        const p = this.state.players[username];
        if (p.vy === 0) {
            p.vx = velocity;
            p.angle = Math.PI / 2;
            this.recalcStopPosition(p);
        } else {
            p.nextMove = "RIGHT";
        }
        this.sendUpdate(p);
    }
    moveUp(username: string, velocity: number = this.VELOCITY): void {
        const p = this.state.players[username];
        if (p.vx === 0) {
            p.vy = -1 * velocity;
            p.angle = 0;
            this.recalcStopPosition(p);
        } else {
            p.nextMove = "UP";
        }
        this.sendUpdate(p);
    }
    moveDown(username: string, velocity: number = this.VELOCITY): void {
        const p = this.state.players[username];
        if (p.vx === 0) {
            p.vy = velocity;
            p.angle = Math.PI;
            this.recalcStopPosition(p);
        } else {
            p.nextMove = "DOWN";
        }
        this.sendUpdate(p);
    }
    goToStart(username: string) {
        const p = this.state.players[username];
        const maze = this.state.mazes[p.level];
        p.x = maze.startX;
        p.y = maze.startY;
        p.vx = 0;
        p.vy = 0;
        this.sendUpdate(p);
    }
    advanceLevel(username: string) {
        const p = this.state.players[username];
        const maze = this.state.mazes[++p.level];
        p.x = maze.startX;
        p.y = maze.startY;
        p.vx = 0;
        p.vy = 0;
        p.stopX = null;
        p.stopY = null;
        this.sendUpdate(p);
    }
    
    updateOtherPlayers(serverPlayers: Record<string, Player>, localUsername: string) {
        for (const [username, serverPlayer] of Object.entries(serverPlayers)) {
            if (username !== localUsername) {
                this.state.players[username] = { ...serverPlayer };
            }
        }
    }

    sendUpdate(p: Player) {
        if (p.username === this.localUsername) {
                const current: PlayerUpdatePayload = {
                    username: p.username,
                    level: p.level,
                    x: p.x,
                    y: p.y,
                    vx: p.vx,
                    vy: p.vy,
                    nextMove: p.nextMove,
                    stopX: p.stopX!,
                    stopY: p.stopY!,
                };

                if (
                    !this.lastSentLocal ||
                    !this.isEqualPlayerState(this.lastSentLocal, current)
                ) {
                    this.lastSentLocal = { ...current }; // cache for next send
                    this.emitPlayerUpdate(current);
                }
            }
    }

    private recalcStopPosition(p: Player) {
        const board = this.state.mazes[p.level].board;

        // --- Horizontal movement ---
        if (p.vx > 0) {
            // moving right
            let stopX = board[0].length - 1;
            for (let x = Math.floor(p.x) + 1; x < board[0].length; x++) {
                const checkSpace = board[Math.floor(p.y)][x];
                if (checkSpace === 1) {
                    stopX = x - 1;
                    break;
                } else if (checkSpace === 3) {
                    stopX = x;
                    break;
                }
            }
            p.stopX = stopX;
        } else if (p.vx < 0) {
            // moving left
            let stopX = 0;
            for (let x = Math.floor(p.x) - 1; x >= 0; x--) {
                const checkSpace = board[Math.floor(p.y)][x];
                if (checkSpace === 1) {
                    stopX = x + 1;
                    break;
                } else if (checkSpace === 3) {
                    stopX = x;
                    break;
                }
            }
            p.stopX = stopX;
        }

        // --- Vertical movement ---
        if (p.vy > 0) {
            // moving down
            let stopY = board.length - 1;
            for (let y = Math.floor(p.y) + 1; y < board.length; y++) {
                const checkSpace = board[y][Math.floor(p.x)];
                if (checkSpace === 1) {
                    stopY = y - 1;
                    break;
                } else if (checkSpace === 3) {
                    stopY = y;
                    break;
                }
            }
            p.stopY = stopY;
        } else if (p.vy < 0) {
            // moving up
            let stopY = 0;
            for (let y = Math.floor(p.y) - 1; y >= 0; y--) {
                const checkSpace = board[y][Math.floor(p.x)];
                if (checkSpace === 1) {
                    stopY = y + 1;
                    break;
                } else if (checkSpace === 3) {
                    stopY = y;
                    break;
                }
            }
            p.stopY = stopY;
        }
    }
}
