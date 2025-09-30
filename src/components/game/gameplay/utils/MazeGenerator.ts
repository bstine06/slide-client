import { Direction, DirectionNonNull, Maze } from "../../../../types/GameTypes";
import { DensityType } from "../../../../types/MazeGenerationTypes";

interface MovementDelta {
    dx: number;
    dy: number;
}

class MazeGenerator {
    static generateMaze(
        dimension: number,
        startY: number,
        startX: number,
        density: number = 0.3,
        length: number = dimension
    ): Maze {
        // 1 = empty
        const board: number[][] = Array.from({ length: dimension }, () =>
            Array.from({ length: dimension }, () => 1)
        );

        //init a set which stores the solution path
        //coords stored in string format "y,x"
        const pathSet = new Set<string>();
        const wallSet = new Set<string>();
        pathSet.add(`${startY},${startX}`);
        board[startY][startX] = 2;

        //create a Map to store movement increments
        const directions: Record<DirectionNonNull, MovementDelta> = {
            LEFT: { dx: -1, dy: 0 },
            RIGHT: { dx: 1, dy: 0 },
            UP: { dx: 0, dy: -1 },
            DOWN: { dx: 0, dy: 1 },
        };

        //create a random solution path and log every cell on path
        let previousDirection: Direction = null;
        let y = startY;
        let x = startX;
        let limit = dimension - 1;

        let isDeadEnd = false;

        for (let i = 0; i < length; i++) {
            let direction: DirectionNonNull = "UP"; // placeholder value to satisfy compiler
            try {
                direction = this.getRandomDirection({
                    allowLeft:
                        x - 1 >= 0 &&
                        previousDirection != "LEFT" &&
                        previousDirection != "RIGHT" &&
                        !wallSet.has(`${y},${x - 1}`),
                    allowRight:
                        x + 1 <= limit &&
                        previousDirection != "RIGHT" &&
                        previousDirection != "LEFT" &&
                        !wallSet.has(`${y},${x + 1}`),
                    allowUp:
                        y - 1 >= 0 &&
                        previousDirection != "UP" &&
                        previousDirection != "DOWN" &&
                        !wallSet.has(`${y - 1},${x}`),
                    allowDown:
                        y + 1 <= limit &&
                        previousDirection != "DOWN" &&
                        previousDirection != "UP" &&
                        !wallSet.has(`${y + 1},${x}`),
                });
            } catch (error) {
                isDeadEnd = true;
            }

            if (isDeadEnd) break;

            // probe the full distance between here and the edge
            let probeX = x;
            let probeY = y;
            while (
                probeX + directions[direction].dx >= 0 &&
                probeX + directions[direction].dx <= limit &&
                probeY + directions[direction].dy >= 0 &&
                probeY + directions[direction].dy <= limit
            ) {
                probeX += directions[direction].dx;
                probeY += directions[direction].dy;
            }

            // DONT PUT A PIVOT POINT IN A PATH
            // AND DONT PUT A PATH IN A PIVOT POINT

            // choose a random distance to go between here and the edge
            let d = Math.ceil(
                Math.random() * (Math.abs(probeY - y) + Math.abs(probeX - x))
            );
            while (d > 0) {
                // traverse and add each visited cell to the pathSet
                // if a block was already placed there, end this traversal
                let traverseX = x + directions[direction].dx;
                let traverseY = y + directions[direction].dy;
                if (wallSet.has(`${traverseY},${traverseX}`)) {
                    break;
                }
                x = traverseX;
                y = traverseY;
                pathSet.add(`${y},${x}`);
                board[y][x] = 0;
                d--;
            }

            // end of this direction's run.
            //
            // if its not at the edge of the map,
            // we need to add a block to the end of this run
            //
            // BUT WAIT! we cant add a wall to an existing path!
            // so if theres path there:
            //  keep truckin until we arent in a path (or continue until its map edge)

            while (
                pathSet.has(
                    `${y + directions[direction].dy},${
                        x + directions[direction].dx
                    }`
                ) &&
                x > -1 &&
                x < dimension &&
                y > -1 &&
                y < dimension
            ) {
                x += directions[direction].dx;
                y += directions[direction].dy;
            }

            if (
                !(x + directions[direction].dx > limit) &&
                !(x + directions[direction].dx < 0) &&
                !(y + directions[direction].dy > limit) &&
                !(y + directions[direction].dy < 0)
            ) {
                let wallY = y + directions[direction].dy;
                let wallX = x + directions[direction].dx;
                wallSet.add(`${wallY},${wallX}`);
                board[wallY][wallX] = 1;
            }

            previousDirection = direction;
        }

        let finishY = y;
        let finishX = x;
        board[finishY][finishX] = 3;

        // fill board with noise, excluding the defined necessary path & walls

        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                const coords = `${i},${j}`;
                if (!pathSet.has(coords) && !wallSet.has(coords)) {
                    board[i][j] = Math.random() < density ? 1 : 0;
                }
            }
        }

        return {
            board,
            startX,
            startY,
            finishX,
            finishY,
            theme: "SEWER"
        };
    }

    static getRandomDirection(
        options: {
            allowLeft?: boolean;
            allowRight?: boolean;
            allowUp?: boolean;
            allowDown?: boolean;
        } = {}
    ): DirectionNonNull {
        const {
            allowLeft = true,
            allowRight = true,
            allowUp = true,
            allowDown = true,
        } = options;

        const directions: ("LEFT" | "RIGHT" | "UP" | "DOWN")[] = [];

        if (allowLeft) directions.push("LEFT");
        if (allowRight) directions.push("RIGHT");
        if (allowUp) directions.push("UP");
        if (allowDown) directions.push("DOWN");

        if (directions.length === 0) {
            throw new Error(
                "getRandomDirection with all options false is useless"
            );
        }

        const index = Math.floor(Math.random() * directions.length);
        return directions[index];
    }

    static generateMazeArray(
        count: number,
        dimension: number,
        densityType: DensityType,
        enforceShortestPathGreaterThan: number = 0
    ) {
        if (dimension <= 4 && enforceShortestPathGreaterThan)
            throw new Error("Cannot enforce shortest path on tiny mazes");
        if (enforceShortestPathGreaterThan > dimension / 2)
            throw new Error(
                "Cannot enforce shortest path greater than 1/2 of dimension"
            );
        let mazeArray: Maze[] = [];
        let startX = Math.floor(Math.random() * dimension);
        let startY = Math.floor(Math.random() * dimension);
        for (let i = 0; i < count; i++) {
            let density = 0.99;
            // switch (densityType) {
            //     case "BIAS_DENSE_AND_SPARSE":
            //         density =
            //             Math.random() > 0.5
            //                 ? Math.pow(Math.random(), 0.25)
            //                 : Math.pow(Math.random(), 4);
            //         break;
            //     case "SPARSE":
            //         density = Math.pow(Math.random(), 4);
            //         break;
            //     case "DENSE":
            //         // density = Math.pow(Math.min(Math.random(), 0.5), 0.25);
            //         density = 0.99;
            //         break;
            // }
            let maze = this.generateMaze(dimension, startY, startX, density);
            while (
                this.bfsShortestPath(maze) <= enforceShortestPathGreaterThan
            ) {
                maze = this.generateMaze(dimension, startY, startX);
            }
            mazeArray.push(maze);
            startX = maze.finishX;
            startY = maze.finishY;
        }

        //generate an unfinishable buffer maze for the last maze (after finish) to prevent rendering issues
        const bufferBoard = Array.from({ length: dimension }, () =>
            Array(dimension).fill(0)
        );
        bufferBoard[startY][startX] = 2;
        const bufferMaze : Maze = {
            board: bufferBoard, 
            startX,
            startY,
            finishX: -1,
            finishY: -1,
            theme: "SEWER"
        }
        mazeArray.push(bufferMaze);

        return mazeArray;
    }

    static bfsShortestPath(maze: Maze): number {
        const { board, startX, startY, finishX, finishY } = maze;
        const dimension = board.length;
        const queue: Array<[number, number, number]> = [[startY, startX, 0]];
        const visited: boolean[][] = Array.from({ length: dimension }, () =>
            Array(dimension).fill(false)
        );
        visited[startY][startX] = true;

        const directions = [
            { dx: -1, dy: 0 }, //left
            { dx: 1, dy: 0 }, //right
            { dx: 0, dy: -1 }, //up
            { dx: 0, dy: 1 }, //down
        ];

        while (queue.length > 0) {
            let [y, x, dist] = queue.shift()!;

            if (y === finishY && x === finishX) {
                return dist;
            }

            // find all possible moves from this spot
            for (const {dx, dy} of directions) {
                let {stopY, stopX} = this.findStopPosition(
                    board,
                    y,
                    x,
                    dy,
                    dx
                );
                if (!visited[stopY][stopX]) {
                    visited[stopY][stopX] = true;
                    queue.push([stopY, stopX, dist + 1]);
                }
            }
        }

        return Infinity;
    }

    static findStopPosition(
        board: number[][],
        py: number,
        px: number,
        dy: number,
        dx: number
    ) : {stopY: number, stopX: number} {
        let stopX = px;
        let stopY = py;

        // --- Horizontal movement ---
        if (dx > 0) {
            // moving right
            stopX = board[0].length - 1;
            for (let x = px + 1; x < board[0].length; x++) {
                const checkSpace = board[py][x];
                if (checkSpace === 1) {
                    stopX = x - 1;
                    break;
                } else if (checkSpace === 3) {
                    stopX = x;
                    break;
                }
            }
        } else if (dx < 0) {
            // moving left
            stopX = 0;
            for (let x = px - 1; x >= 0; x--) {
                const checkSpace = board[py][x];
                if (checkSpace === 1) {
                    stopX = x + 1;
                    break;
                } else if (checkSpace === 3) {
                    stopX = x;
                    break;
                }
            }
        }

        // --- Vertical movement ---
        if (dy > 0) {
            // moving down
            stopY = board.length - 1;
            for (let y = py + 1; y < board.length; y++) {
                const checkSpace = board[y][px];
                if (checkSpace === 1) {
                    stopY = y - 1;
                    break;
                } else if (checkSpace === 3) {
                    stopY = y;
                    break;
                }
            }
        } else if (dy < 0) {
            // moving up
            stopY = 0;
            for (let y = py - 1; y >= 0; y--) {
                const checkSpace = board[y][Math.floor(px)];
                if (checkSpace === 1) {
                    stopY = y + 1;
                    break;
                } else if (checkSpace === 3) {
                    stopY = y;
                    break;
                }
            }
        }

        return {
            stopY, 
            stopX
        }
    }
}

export default MazeGenerator;
