import TileOffset from '../core/TileOffset';
import TilePosition from '../core/TilePosition';
import TileSize from '../core/TileSize';
import Game from '../Game';
import Resource from '../resource/Resource';
import { TileType } from '../tile/Tile';
import Level from './Level';

export default class LevelParser {
    private tileTypeMap: Array<Array<TileType>> = [[]];
    private playerPosition: TilePosition | undefined;
    private boxPositionList: Array<TilePosition> = [];
    private destinationPositionList: Array<TilePosition> = [];

    /**
     * Parses the level file and returns a level instance.
     * @param resource
     */
    public parse = (resource: Resource): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            resolve(
                [...(<string>resource.data).matchAll(/[\r\n]*([ #$@*.\r\n]*); *(.+)/g)].map((match) => {
                    this.tileTypeMap = [[]];
                    this.playerPosition = undefined;
                    this.boxPositionList = [];
                    this.destinationPositionList = [];

                    this.doParse(match[1]);
                    this.fillRows();
                    this.floodFillFloor();
                    this.removeWalls();
                    this.removeEmptyRows();
                    this.removeEmptyColumns();
                    this.addBorder();
                    if (Game.RENDER_PONDS) {
                        this.floodFillVoid();
                        this.floodFillPonds();
                    } else {
                        this.fillVoid();
                    }

                    return new Level(
                        match[2],
                        this.tileTypeMap,
                        this.getPlayerPosition(),
                        this.boxPositionList,
                        this.destinationPositionList
                    );
                })
            );
        });
    };

    /**
     * Parses the level file and creates an two dimensional array.
     * @param source
     */
    private doParse = (source: string): void => {
        let x = 0;
        let y = 0;

        [...source].forEach((character) => {
            switch (character) {
                case '\n':
                    x = 0;
                    this.tileTypeMap[++y] = [];
                    break;
                case '#':
                    this.tileTypeMap[y][x++] = TileType.Wall;
                    break;
                case ' ':
                    this.tileTypeMap[y][x++] = TileType.Undefined;
                    break;
                case '@':
                    if (this.playerPosition !== undefined) {
                        throw new Error('Invalid level (multiple player)');
                    }

                    console.debug(`Player found at [${x}, ${y}]`);

                    this.playerPosition = new TilePosition(x, y);
                    this.tileTypeMap[y][x++] = TileType.Undefined;
                    break;
                case '$':
                    console.debug(`Box found at [${x}, ${y}]`);

                    this.boxPositionList.push(new TilePosition(x, y));
                    this.tileTypeMap[y][x++] = TileType.Undefined;
                    break;
                case '.':
                    console.debug(`Destination found at [${x}, ${y}]`);

                    this.destinationPositionList.push(new TilePosition(x, y));
                    this.tileTypeMap[y][x++] = TileType.Undefined;
                    break;
                case '*':
                    console.debug(`Box on destination found at [${x}, ${y}]`);

                    this.boxPositionList.push(new TilePosition(x, y));
                    this.destinationPositionList.push(new TilePosition(x, y));
                    this.tileTypeMap[y][x++] = TileType.Undefined;
                    break;
            }
        });

        // Error checks
        if (this.playerPosition === undefined) {
            throw new Error('Invalid level (no player)');
        }
        if (this.boxPositionList.length === 0) {
            throw new Error('Invalid level (no boxes)');
        }
        if (this.destinationPositionList.length === 0) {
            throw new Error('Invalid level (no destinations)');
        }
        if (this.boxPositionList.length !== this.destinationPositionList.length) {
            throw new Error('Invalid level (box and destination count is not equal)');
        }
    };

    /**
     * Makes sure that all rows have the same length.
     */
    private fillRows = (): void => {
        // Find max row length
        let maxRowLength = 0;
        this.tileTypeMap.forEach((row) => {
            if (row.length > maxRowLength) {
                maxRowLength = row.length;
            }
        });

        console.debug(`Max row length is ${maxRowLength}`);

        // Fill all rows to match max row length
        this.tileTypeMap = this.tileTypeMap.map((row) => {
            const missingColumns = maxRowLength - row.length;
            if (missingColumns > 0) {
                for (let i = 0; i < missingColumns; i++) {
                    row.push(TileType.Undefined);
                }
            }
            return row;
        });
    };

    /**
     * Flood fills the floor based on the position of the player.
     */
    private floodFillFloor = (): void => {
        this.floodFill(this.getPlayerPosition(), TileType.Floor);

        // Error checks
        this.boxPositionList.forEach((boxPosition) => {
            if (this.tileTypeMap[boxPosition.y][boxPosition.x] !== TileType.Floor) {
                throw new Error('Invalid level (box position not on floor)');
            }
        });
        this.destinationPositionList.forEach((destinationPosition) => {
            if (this.tileTypeMap[destinationPosition.y][destinationPosition.x] !== TileType.Floor) {
                throw new Error('Invalid level (destination position not on floor)');
            }
        });
    };

    /**
     * Replaces all walls with void.
     */
    private removeWalls = (): void => {
        this.tileTypeMap.forEach((row) => {
            row.forEach((cell, columnIndex) => {
                if (cell === TileType.Wall) {
                    row[columnIndex] = TileType.Undefined;
                }
            });
        });
    };

    /**
     * Removes all empty rows.
     */
    private removeEmptyRows = (): void => {
        // Detect empty rows
        const emptyRowList = (this.tileTypeMap || []).map((_row, index) =>
            this.tileTypeMap[index].some((tileType) => tileType !== TileType.Void)
        );

        // Update positions
        let leadingEmptyRowCount = 0;
        for (let emptyRowIndex = 0; emptyRowIndex < emptyRowList.length; emptyRowIndex++) {
            if (!emptyRowList[emptyRowIndex] && (emptyRowIndex === 0 || !emptyRowList[emptyRowIndex - 1])) {
                leadingEmptyRowCount++;
            } else {
                break;
            }
        }
        this.updatePositions(new TileOffset(0, -leadingEmptyRowCount));

        // Filter empty rows
        this.tileTypeMap = this.tileTypeMap.filter((_row, index) => emptyRowList[index]);
    };

    /**
     * Removes all empty columns.
     */
    private removeEmptyColumns = (): void => {
        // Detect empty columns
        const emptyColumnList = (this.tileTypeMap[0] || []).map((_tileType, index) =>
            this.tileTypeMap.some((row) => row[index] !== TileType.Void)
        );

        // Update positions
        let leadingEmptyColumnsCount = 0;
        for (let emptyRowIndex = 0; emptyRowIndex < emptyColumnList.length; emptyRowIndex++) {
            if (!emptyColumnList[emptyRowIndex] && (emptyRowIndex === 0 || !emptyColumnList[emptyRowIndex - 1])) {
                leadingEmptyColumnsCount++;
            } else {
                break;
            }
        }
        this.updatePositions(new TileOffset(-leadingEmptyColumnsCount, 0));

        // Filter empty columns
        this.tileTypeMap = this.tileTypeMap.map((row) => row.filter((_tileType, index) => emptyColumnList[index]));
    };

    /**
     * Adds the desired amount of empty rows to the bottom of the array.
     */
    private addBorder = (): void => {
        // Create empty row
        const row = this.createEmptyRow();

        // Create border
        this.tileTypeMap = [row, ...this.tileTypeMap, ...(Game.RENDER_PILLARS ? [row, row, row] : [row])].map((row) => [
            TileType.Undefined,
            ...row,
            TileType.Undefined
        ]);

        // Update positions
        this.updatePositions(new TileOffset(1, 1));
    };

    /**
     * Flood fills the void.
     */
    private floodFillVoid = (): void => {
        // Flood fill void now that everything is connected
        this.floodFill(new TilePosition(0, 0), TileType.Void);
    };

    /**
     * Finds and flood fills all ponds.
     */
    private floodFillPonds = (): void => {
        // Find pond
        for (let y = 0; y < this.tileTypeMap.length; y++) {
            for (let x = 0; x < this.tileTypeMap[0].length; x++) {
                if (this.tileTypeMap[y][x] === TileType.Undefined) {
                    console.debug(`Pond found at [${x}, ${y}]`);

                    // Fill pond
                    this.floodFill(new TilePosition(x, y), TileType.Water);
                }
            }
        }
    };

    /**
     * Replaces all undefined tiles with void.
     */
    private fillVoid = (): void => {
        // Find pond
        for (let y = 0; y < this.tileTypeMap.length; y++) {
            for (let x = 0; x < this.tileTypeMap[0].length; x++) {
                if (this.tileTypeMap[y][x] === TileType.Undefined) {
                    this.tileTypeMap[y][x] = TileType.Void;
                }
            }
        }
    };

    /**
     * Creates a row with the correct length filled with void.
     */
    private createEmptyRow = (): Array<TileType> => {
        const row: Array<TileType> = [];
        for (let x = 0; x < this.tileTypeMap[0].length; x++) {
            row.push(TileType.Void);
        }
        return row;
    };

    /**
     * Flood fill algorithm based on http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
     * @param startPosition
     * @param fillTile
     */
    private floodFill = (startPosition: TilePosition, fillTile: TileType): void => {
        const startTileType = this.tileTypeMap[startPosition.y][startPosition.x];
        const levelSize = new TileSize(this.tileTypeMap[0].length, this.tileTypeMap.length);

        const positionStack: Array<TilePosition> = [startPosition];
        while (positionStack.length) {
            const position = positionStack.pop();
            if (!position) {
                continue;
            }

            const currentPosition = new TilePosition(position.x, position.y);

            // Travel up
            while (currentPosition.y >= 0 && this.tileTypeMap[currentPosition.y][currentPosition.x] === startTileType) {
                currentPosition.y--;
            }
            currentPosition.y++;

            // Travel down
            let reachLeft = false;
            let reachRight = false;
            while (
                currentPosition.y < levelSize.height &&
                this.tileTypeMap[currentPosition.y][currentPosition.x] === startTileType
            ) {
                this.tileTypeMap[currentPosition.y][currentPosition.x] = fillTile;

                // Reach left
                if (currentPosition.x > 0) {
                    if (this.tileTypeMap[currentPosition.y][currentPosition.x - 1] === startTileType) {
                        if (!reachLeft) {
                            positionStack.push(new TilePosition(currentPosition.x - 1, currentPosition.y));
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                // Reach right
                if (currentPosition.x < levelSize.width - 1) {
                    if (this.tileTypeMap[currentPosition.y][currentPosition.x + 1] === startTileType) {
                        if (!reachRight) {
                            positionStack.push(new TilePosition(currentPosition.x + 1, currentPosition.y));
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                currentPosition.y++;
            }
        }
    };

    /**
     * Return the player position or throws an error.
     */
    private getPlayerPosition = (): TilePosition => {
        if (this.playerPosition === undefined) {
            throw new Error('Player position is undefined');
        }
        return this.playerPosition;
    };

    /**
     * Updates all sprite positions by the given offset.
     * @param offset
     */
    private updatePositions = (offset: TileOffset): void => {
        this.getPlayerPosition().x += offset.x;
        this.getPlayerPosition().y += offset.y;

        this.boxPositionList.forEach((boxPosition) => {
            boxPosition.x += offset.x;
            boxPosition.y += offset.y;
        });

        this.destinationPositionList.forEach((destinationPosition) => {
            destinationPosition.x += offset.x;
            destinationPosition.y += offset.y;
        });
    };
}
