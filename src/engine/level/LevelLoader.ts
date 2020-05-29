import Resource from '../resource/Resource';
import Level from './Level';
import Tile, {TileType} from '../tile/Tile';
import LevelTileMap from '../tile/LevelTileMap';

export default class LevelLoader {
    private static readonly RENDER_PILLARS = true;
    private static readonly RENDER_PONDS = true;

    private cache: Array<Level> = [];

    private floorTileMap: LevelTileMap;
    private waterTileMap: LevelTileMap;
    private voidTileMap: LevelTileMap;

    constructor(floorTileMap: LevelTileMap, waterTileMap: LevelTileMap, voidTileMap: LevelTileMap) {
        this.floorTileMap = floorTileMap;
        this.waterTileMap = waterTileMap;
        this.voidTileMap = voidTileMap;
    }

    /**
     * Loads the given levels using the the given world tile map.
     * @param resourceList
     */
    public load = (resourceList: Array<Resource>): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            resourceList.forEach((resource) => {
                console.debug(`Loading level ${resource.src}...`);

                let tileTypeMap: Array<Array<TileType>> = [[]];
                const playerPosition: [number, number] = [0, 0];
                const boxPositionList: Array<[number, number]> = [];
                const destinationPositionList: Array<[number, number]> = [];

                this.parse(resource, tileTypeMap, playerPosition, boxPositionList, destinationPositionList);
                this.fillRows(tileTypeMap);
                this.floodFillFloor(tileTypeMap, playerPosition, boxPositionList, destinationPositionList);
                this.removeWalls(tileTypeMap);
                if (LevelLoader.RENDER_PONDS) {
                    this.floodFillVoid(tileTypeMap);
                    this.floodFillPonds(tileTypeMap);
                } else {
                    this.fillVoid(tileTypeMap);
                }
                tileTypeMap = this.removeEmptyRows(tileTypeMap, playerPosition, boxPositionList, destinationPositionList);
                tileTypeMap = this.removeEmptyColumns(tileTypeMap, playerPosition, boxPositionList, destinationPositionList);
                tileTypeMap = this.addEmptyRows(tileTypeMap, 3);

                this.cache.push(
                    new Level(
                        resource.src,
                        this.convertToTiles(tileTypeMap),
                        playerPosition,
                        boxPositionList,
                        destinationPositionList
                    )
                );
            });

            console.log('Levels finished loading...');
            resolve(this.cache);
        });
    };

    /**
     * Returns the level with the given src.
     *
     * @param src
     */
    public get = (src: string): Level => {
        let result = this.cache.find((value) => value.src === src);
        if (result === undefined) {
            throw new Error();
        }
        return result;
    };

    /**
     * Parses the level file and creates an two dimensional array.
     * @param resource
     * @param tileTypeMap
     * @param playerPosition
     * @param boxPositionList
     * @param destinationPositionList
     */
    private parse = (
        resource: Resource,
        tileTypeMap: Array<Array<TileType>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ): void => {
        let columnIndex = 0;
        let rowIndex = 0;
        let tempPlayerPosition: [number, number] | undefined = undefined;

        [...resource.data].forEach((character) => {
            switch (character) {
                case '\n':
                    columnIndex = 0;
                    tileTypeMap[++rowIndex] = [];
                    break;
                case '#':
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Wall;
                    break;
                case ' ':
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '@':
                    if (tempPlayerPosition !== undefined) {
                        throw new Error('Invalid level (multiple player)');
                    }

                    console.debug(`Player found at [${columnIndex}, ${rowIndex}]`);

                    tempPlayerPosition = [columnIndex, rowIndex];
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '$':
                    console.debug(`Box found at [${columnIndex}, ${rowIndex}]`);

                    boxPositionList.push([columnIndex, rowIndex]);
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '.':
                    console.debug(`Destination found at [${columnIndex}, ${rowIndex}]`);

                    destinationPositionList.push([columnIndex, rowIndex]);
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
            }
        });

        // Error checks
        if (tempPlayerPosition === undefined) {
            throw new Error('Invalid level (no player)');
        } else {
            playerPosition[0] = tempPlayerPosition[0];
            playerPosition[1] = tempPlayerPosition[1];
        }
        if (boxPositionList.length === 0) {
            throw new Error('Invalid level (no boxes)');
        }
        if (destinationPositionList.length === 0) {
            throw new Error('Invalid level (no destinations)');
        }
        if (boxPositionList.length !== destinationPositionList.length) {
            throw new Error('Invalid level (box and destination count is not equal)');
        }
    };

    /**
     * Makes sure that all rows have the same length.
     * @param tileTypeMap
     */
    private fillRows = (tileTypeMap: Array<Array<TileType>>): void => {
        // Find max row length
        let maxRowLength = 0;
        tileTypeMap.forEach((row) => {
            if (row.length > maxRowLength) {
                maxRowLength = row.length;
            }
        });

        console.debug(`Max row length is ${maxRowLength}`);

        // Fill all rows to match max row length
        tileTypeMap.forEach((row) => {
            let missingColumns = maxRowLength - row.length;
            if (missingColumns > 0) {
                for (let i = 0; i < missingColumns; i++) {
                    row.push(TileType.Undefined);
                }
            }
        });
    };

    /**
     * Flood fills the floor based on the position of the player.
     * @param tileTypeMap
     * @param playerPosition
     * @param boxPositionList
     * @param destinationPositionList
     */
    private floodFillFloor = (
        tileTypeMap: Array<Array<TileType>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ): void => {
        this.floodFill(playerPosition[0], playerPosition[1], TileType.Floor, tileTypeMap);

        // Error checks
        boxPositionList.forEach((boxPosition) => {
            if (tileTypeMap[boxPosition[1]][boxPosition[0]] !== TileType.Floor) {
                throw new Error('Invalid level (box position not on floor)');
            }
        });
        destinationPositionList.forEach((destinationPosition) => {
            if (tileTypeMap[destinationPosition[1]][destinationPosition[0]] !== TileType.Floor) {
                throw new Error('Invalid level (destination position not on floor)');
            }
        });
    };

    /**
     * Replaces all walls with void.
     * @param tileTypeMap
     */
    private removeWalls = (tileTypeMap: Array<Array<TileType>>): void => {
        tileTypeMap.forEach((row) => {
            row.forEach((cell, columnIndex) => {
                if (cell === TileType.Wall) {
                    row[columnIndex] = TileType.Undefined;
                }
            });
        });
    };

    /**
     * Flood fills the void.
     * @param tileTypeMap
     */
    private floodFillVoid = (tileTypeMap: Array<Array<TileType>>): void => {
        // Error checks
        if (tileTypeMap[0][0] !== TileType.Undefined) {
            throw new Error('Invalid level (position [0,0] cannot be floor)');
        }

        this.floodFill(0, 0, TileType.Void, tileTypeMap);
    };

    /**
     * Finds and flood fills all ponds.
     * @param tileTypeMap
     */
    private floodFillPonds = (tileTypeMap: Array<Array<TileType>>): void => {
        // Find pond
        for (let rowIndex = 0; rowIndex < tileTypeMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < tileTypeMap[0].length; columnIndex++) {
                if (tileTypeMap[rowIndex][columnIndex] === TileType.Undefined) {
                    console.debug(`Pond found at [${columnIndex}, ${rowIndex}]`);

                    // Fill pond
                    this.floodFill(columnIndex, rowIndex, TileType.Water, tileTypeMap);
                }
            }
        }
    };

    /**
     * Replaces all undefined tiles with void.
     * @param tileTypeMap
     */
    private fillVoid = (tileTypeMap: Array<Array<TileType>>): void => {
        // Find pond
        for (let rowIndex = 0; rowIndex < tileTypeMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < tileTypeMap[0].length; columnIndex++) {
                if (tileTypeMap[rowIndex][columnIndex] === TileType.Undefined) {
                    tileTypeMap[rowIndex][columnIndex] = TileType.Void;
                }
            }
        }
    };

    /**
     * Removes all empty rows.
     * @param tileTypeMap
     * @param playerPosition
     * @param boxPositionList
     * @param destinationPositionList
     */
    private removeEmptyRows = (
        tileTypeMap: Array<Array<TileType>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ): Array<Array<TileType>> => {
        // Detect empty rows
        const emptyRowList = (tileTypeMap || []).map((_row, index) => tileTypeMap[index].some(tileType => tileType !== TileType.Void));

        // Update positions
        const leadingEmptyRowCount = emptyRowList.reduce<number>(
            (result, value, index) => !value && (index === 0 || !emptyRowList[index - 1]) ? result + 1 : result,
            0
        );
        playerPosition[1] -= leadingEmptyRowCount;
        boxPositionList.forEach(boxPosition => { boxPosition[1] -= leadingEmptyRowCount });
        destinationPositionList.forEach(destinationPosition => { destinationPosition[1] -= leadingEmptyRowCount });

        // Filter empty rows
        return tileTypeMap.filter((_row, index) => emptyRowList[index]);
    };

    /**
     * Removes all empty columns.
     * @param tileTypeMap
     * @param playerPosition
     * @param boxPositionList
     * @param destinationPositionList
     */
    private removeEmptyColumns = (
        tileTypeMap: Array<Array<TileType>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ): Array<Array<TileType>> => {
        // Detect empty columns
        const emptyColumnList = (tileTypeMap[0] || []).map((_tileType, index) => tileTypeMap.some(row => row[index] !== TileType.Void));

        // Update positions
        const leadingEmptyColumnsCount = emptyColumnList.reduce<number>(
            (result, value, index) => !value && (index === 0 || !emptyColumnList[index - 1]) ? result + 1 : result,
            0
        );
        playerPosition[0] -= leadingEmptyColumnsCount;
        boxPositionList.forEach(boxPosition => { boxPosition[0] -= leadingEmptyColumnsCount });
        destinationPositionList.forEach(destinationPosition => { destinationPosition[0] -= leadingEmptyColumnsCount });

        // Filter empty columns
        return tileTypeMap.map(row => row.filter((_tileType, index) => emptyColumnList[index]));
    };

    /**
     * Adds the desired amount of empty rows to the bottom of the array.
     * @param tileTypeMap
     * @param rowCount
     */
    private addEmptyRows = (tileTypeMap: Array<Array<TileType>>, rowCount: number): Array<Array<TileType>> => {
        // Create empty row
        let row:Array<TileType> = [];
        for (let columnIndex = 0; columnIndex < tileTypeMap[0].length; columnIndex++) {
            row.push(TileType.Void);
        }

        // Add empty rows
        for (let i = 0; i < rowCount; i++) {
            tileTypeMap.push(row);
        }

        return tileTypeMap;
    }

    /**
     * Converts tile types into tiles.
     * @param tileTypeMap
     */
    private convertToTiles = (tileTypeMap: Array<Array<TileType>>): Array<Array<Tile>> => {
        /**
         * Checks if the given tile type is at the given coordinates.
         * @param columnIndex
         * @param rowIndex
         * @param tileType
         */
        const isTileTypeAt = (columnIndex: number, rowIndex: number, tileType: TileType): boolean => {
            if (
                columnIndex < 0 ||
                columnIndex >= tileTypeMap[0].length ||
                rowIndex < 0 ||
                rowIndex >= tileTypeMap.length
            ) {
                return false;
            }
            return tileTypeMap[rowIndex][columnIndex] === tileType;
        };

        /**
         * Returns a pattern describing the surroundings of the given coordinates.
         * @param columnIndex
         * @param rowIndex
         * @param tileType
         */
        const getPatternAt = (columnIndex: number, rowIndex: number, tileType: TileType): string => {
            let pattern = '';
            pattern += isTileTypeAt(columnIndex - 1, rowIndex - 1, tileType) ? '0' : '1';
            pattern += isTileTypeAt(columnIndex, rowIndex - 1, tileType) ? '0' : '1';
            pattern += isTileTypeAt(columnIndex + 1, rowIndex - 1, tileType) ? '0' : '1';
            pattern += isTileTypeAt(columnIndex - 1, rowIndex, tileType) ? '0' : '1';
            pattern += isTileTypeAt(columnIndex + 1, rowIndex, tileType) ? '0' : '1';
            pattern += isTileTypeAt(columnIndex - 1, rowIndex + 1, tileType) ? '0' : '1';
            pattern += isTileTypeAt(columnIndex, rowIndex + 1, tileType) ? '0' : '1';
            pattern += isTileTypeAt(columnIndex + 1, rowIndex + 1, tileType) ? '0' : '1';
            return pattern;
        };

        const levelMap: Array<Array<Tile>> = [];

        for (let rowIndex = 0; rowIndex < tileTypeMap.length; rowIndex++) {
            // Add row if the pillar effect has not already
            if (levelMap[rowIndex] === undefined) {
                levelMap[rowIndex] = [];
            }

            for (let columnIndex = 0; columnIndex < tileTypeMap[0].length; columnIndex++) {
                switch (tileTypeMap[rowIndex][columnIndex]) {
                    case TileType.Floor:
                        // Add floor tile
                        levelMap[rowIndex][columnIndex] = this.floorTileMap.getTileListByPattern(
                            getPatternAt(columnIndex, rowIndex, TileType.Floor)
                        )[0];

                        // Add pillar effect
                        if (LevelLoader.RENDER_PILLARS && isTileTypeAt(columnIndex, rowIndex + 1, TileType.Void)) {
                            // Get pillar tile list
                            this.voidTileMap
                                .getTileListByPattern(getPatternAt(columnIndex, rowIndex, TileType.Floor))
                                .forEach((value, index) => {
                                    const pillarRowIndex = rowIndex + 1 + index;
                                    if (isTileTypeAt(columnIndex, pillarRowIndex, TileType.Void)) {
                                        // Add row
                                        if (levelMap[pillarRowIndex] === undefined) {
                                            levelMap[pillarRowIndex] = [];
                                        }

                                        // Add pillar tile
                                        levelMap[pillarRowIndex][columnIndex] = value;
                                    }
                                });
                        }

                        break;
                    case TileType.Water:
                        // Add water tile
                        levelMap[rowIndex][columnIndex] = this.waterTileMap.getTileListByPattern(
                            getPatternAt(columnIndex, rowIndex, TileType.Water)
                        )[0];
                        break;
                    case TileType.Void:
                        // Add void tile if not already pillar
                        if (levelMap[rowIndex][columnIndex] === undefined) {
                            levelMap[rowIndex][columnIndex] = this.voidTileMap.get(2, 5);
                        }
                        break;
                }
            }
        }

        return levelMap;
    };

    /**
     * Flood fill algorithm based on http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
     *
     * @param startX
     * @param startY
     * @param fillTile
     * @param levelMap
     */
    private floodFill = (
        startX: number,
        startY: number,
        fillTile: TileType,
        levelMap: Array<Array<TileType>>
    ): void => {
        let startTileType = levelMap[startY][startX];
        let levelWidth = levelMap[0].length;
        let levelHeight = levelMap.length;

        let positionStack: Array<Array<number>> = [[startX, startY]];
        while (positionStack.length) {
            let position = positionStack.pop()!;
            let columnIndex = position[0];
            let rowIndex = position[1];

            // Travel up
            while (rowIndex >= 0 && levelMap[rowIndex][columnIndex] === startTileType) {
                rowIndex--;
            }
            rowIndex++;

            // Travel down
            let reachLeft = false;
            let reachRight = false;
            while (rowIndex < levelHeight && levelMap[rowIndex][columnIndex] === startTileType) {
                levelMap[rowIndex][columnIndex] = fillTile;

                // Reach left
                if (columnIndex > 0) {
                    if (levelMap[rowIndex][columnIndex - 1] === startTileType) {
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
                    if (levelMap[rowIndex][columnIndex + 1] === startTileType) {
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
}
