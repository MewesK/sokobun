import Resource from '../resource/Resource';
import Level from './Level';
import { TileType } from '../tile/Tile';
import Game from '../Game';

export default class LevelParser {
    private tileTypeMap: Array<Array<TileType>> = [[]];
    private playerPosition: [number, number] | undefined;
    private boxPositionList: Array<[number, number]> = [];
    private destinationPositionList: Array<[number, number]> = [];

    /**
     * Parses the level file and returns a level instance.
     * @param resource
     */
    public parse = (resource: Resource): Promise<Level> => {
        return new Promise((resolve) => {
            this.doParse(resource);
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

            resolve(
                new Level(
                    resource.src,
                    this.tileTypeMap,
                    this.getPlayerPosition(),
                    this.boxPositionList,
                    this.destinationPositionList
                )
            );
        });
    };

    /**
     * Parses the level file and creates an two dimensional array.
     * @param resource
     */
    private doParse = (resource: Resource): void => {
        let columnIndex = 0;
        let rowIndex = 0;

        [...resource.data].forEach((character) => {
            switch (character) {
                case '\n':
                    columnIndex = 0;
                    this.tileTypeMap[++rowIndex] = [];
                    break;
                case '#':
                    this.tileTypeMap[rowIndex][columnIndex++] = TileType.Wall;
                    break;
                case ' ':
                    this.tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '@':
                    if (this.playerPosition !== undefined) {
                        throw new Error('Invalid level (multiple player)');
                    }

                    console.debug(`Player found at [${columnIndex}, ${rowIndex}]`);

                    this.playerPosition = [columnIndex, rowIndex];
                    this.tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '$':
                    console.debug(`Box found at [${columnIndex}, ${rowIndex}]`);

                    this.boxPositionList.push([columnIndex, rowIndex]);
                    this.tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '.':
                    console.debug(`Destination found at [${columnIndex}, ${rowIndex}]`);

                    this.destinationPositionList.push([columnIndex, rowIndex]);
                    this.tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
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
            let missingColumns = maxRowLength - row.length;
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
        this.floodFill(this.getPlayerPosition()[0], this.getPlayerPosition()[1], TileType.Floor);

        // Error checks
        this.boxPositionList.forEach((boxPosition) => {
            if (this.tileTypeMap[boxPosition[1]][boxPosition[0]] !== TileType.Floor) {
                throw new Error('Invalid level (box position not on floor)');
            }
        });
        this.destinationPositionList.forEach((destinationPosition) => {
            if (this.tileTypeMap[destinationPosition[1]][destinationPosition[0]] !== TileType.Floor) {
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
        this.updatePositions(0, -leadingEmptyRowCount);

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
        this.updatePositions(-leadingEmptyColumnsCount, 0);

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
        this.updatePositions(1, 1);
    };

    /**
     * Flood fills the void.
     */
    private floodFillVoid = (): void => {
        // Flood fill void now that everything is connected
        this.floodFill(0, 0, TileType.Void);
    };

    /**
     * Finds and flood fills all ponds.
     */
    private floodFillPonds = (): void => {
        // Find pond
        for (let rowIndex = 0; rowIndex < this.tileTypeMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.tileTypeMap[0].length; columnIndex++) {
                if (this.tileTypeMap[rowIndex][columnIndex] === TileType.Undefined) {
                    console.debug(`Pond found at [${columnIndex}, ${rowIndex}]`);

                    // Fill pond
                    this.floodFill(columnIndex, rowIndex, TileType.Water);
                }
            }
        }
    };

    /**
     * Replaces all undefined tiles with void.
     */
    private fillVoid = (): void => {
        // Find pond
        for (let rowIndex = 0; rowIndex < this.tileTypeMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.tileTypeMap[0].length; columnIndex++) {
                if (this.tileTypeMap[rowIndex][columnIndex] === TileType.Undefined) {
                    this.tileTypeMap[rowIndex][columnIndex] = TileType.Void;
                }
            }
        }
    };

    /**
     * Creates a row with the correct length filled with void.
     */
    private createEmptyRow = (): Array<TileType> => {
        let row: Array<TileType> = [];
        for (let columnIndex = 0; columnIndex < this.tileTypeMap[0].length; columnIndex++) {
            row.push(TileType.Void);
        }
        return row;
    };

    /**
     * Flood fill algorithm based on http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
     * @param startX
     * @param startY
     * @param fillTile
     */
    private floodFill = (startX: number, startY: number, fillTile: TileType): void => {
        let startTileType = this.tileTypeMap[startY][startX];
        let levelWidth = this.tileTypeMap[0].length;
        let levelHeight = this.tileTypeMap.length;

        let positionStack: Array<Array<number>> = [[startX, startY]];
        while (positionStack.length) {
            let position = positionStack.pop()!;
            let columnIndex = position[0];
            let rowIndex = position[1];

            // Travel up
            while (rowIndex >= 0 && this.tileTypeMap[rowIndex][columnIndex] === startTileType) {
                rowIndex--;
            }
            rowIndex++;

            // Travel down
            let reachLeft = false;
            let reachRight = false;
            while (rowIndex < levelHeight && this.tileTypeMap[rowIndex][columnIndex] === startTileType) {
                this.tileTypeMap[rowIndex][columnIndex] = fillTile;

                // Reach left
                if (columnIndex > 0) {
                    if (this.tileTypeMap[rowIndex][columnIndex - 1] === startTileType) {
                        if (!reachLeft) {
                            positionStack.push([columnIndex - 1, rowIndex]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                // Reach right
                if (columnIndex < levelWidth - 1) {
                    if (this.tileTypeMap[rowIndex][columnIndex + 1] === startTileType) {
                        if (!reachRight) {
                            positionStack.push([columnIndex + 1, rowIndex]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                rowIndex++;
            }
        }
    };

    /**
     * Return the player position or throws an error.
     */
    private getPlayerPosition = (): [number, number] => {
        if (this.playerPosition === undefined) {
            throw new Error('Player position is undefined');
        }
        return this.playerPosition;
    };

    /**
     * Updates all sprite positions by the given offset.
     * @param offsetX
     * @param offsetY
     */
    private updatePositions = (offsetX: number, offsetY: number): void => {
        this.getPlayerPosition()[0] += offsetX;
        this.getPlayerPosition()[1] += offsetY;

        this.boxPositionList.forEach((boxPosition) => {
            boxPosition[0] += offsetX;
            boxPosition[1] += offsetY;
        });

        this.destinationPositionList.forEach((destinationPosition) => {
            destinationPosition[0] += offsetX;
            destinationPosition[1] += offsetY;
        });
    };
}
