import Resource from '../resource/Resource';
import TileMap from '../tile/TileMap';
import Level, {TileStyle} from './Level';

enum TileType {
    Undefined,
    Wall,
    Floor,
    Void,
    Water
}

export default class LevelLoader {
    cache: Array<Level> = [];

    load = (resourceList: Array<Resource>, tileMap: TileMap): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            resourceList.forEach((resource) => {
                console.debug(`Loading level ${resource.src}...`);

                const level = new Level(resource.src, tileMap);
                const tileTypeMap: Array<Array<TileType>> = [[]];

                this.parse(resource, level, tileTypeMap);
                this.fillRows(tileTypeMap);
                this.floodFillFloor(level, tileTypeMap);
                this.removeWalls(tileTypeMap);
                this.floodFillVoid(tileTypeMap);
                this.floodFillPonds(tileTypeMap);
                // TODO: Remove empty rows
                // TODO: Remove empty columns
                // TODO: Add pillar effect
                this.convertToTiles(level, tileTypeMap);

                this.cache.push(level);
            });

            console.log('Levels finished loading...');
            resolve(this.cache);
        });
    }

    /**
     * Returns the level with the given src.
     *
     * @param src
     */
    get = (src: string): Level => {
        let result = this.cache.find(value => value.src === src);
        if (result === undefined) {
            throw new Error();
        }
        return result;
    }

    /**
     * Parses the level file and creates an two dimensional array.
     *
     * @param resource
     * @param level
     * @param tileTypeMap
     */
    private parse = (resource: Resource, level: Level, tileTypeMap: Array<Array<TileType>>): void => {
        let columnIndex = 0;
        let rowIndex = 0;
        let playerPosition: [number, number]|undefined = undefined;

        [...resource.data].forEach(character => {
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
                    if (playerPosition !== undefined) {
                        throw new Error('Invalid level (multiple player)');
                    }

                    console.debug(`Player found at [${columnIndex}, ${rowIndex}]`)

                    playerPosition = [columnIndex, rowIndex];
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '$':
                    console.debug(`Box found at [${columnIndex}, ${rowIndex}]`)

                    level.boxPositionList.push([columnIndex, rowIndex]);
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
                case '.':
                    console.debug(`Destination found at [${columnIndex}, ${rowIndex}]`)

                    level.destinationPositionList.push([columnIndex, rowIndex]);
                    tileTypeMap[rowIndex][columnIndex++] = TileType.Undefined;
                    break;
            }
        });

        // Error checks
        if (playerPosition === undefined) {
            throw new Error('Invalid level (no player)');
        } else {
            level.playerPosition = playerPosition;
        }
        if (level.boxPositionList.length === 0) {
            throw new Error('Invalid level (no boxes)');
        }
        if (level.destinationPositionList.length === 0) {
            throw new Error('Invalid level (no destinations)');
        }
        if (level.boxPositionList.length !== level.destinationPositionList.length) {
            throw new Error('Invalid level (box and destination count is not equal)');
        }
    }

    /**
     * Makes sure that all rows have the same length.
     *
     * @param tileTypeMap
     */
    private fillRows = (tileTypeMap: Array<Array<TileType>>): void => {
        // Find max row length
        let maxRowLength = 0;
        tileTypeMap.forEach(row => {
            if (row.length > maxRowLength) {
                maxRowLength = row.length;
            }
        });

        console.debug(`Max row length is ${maxRowLength}`)

        // Fill all rows to match max row length
        tileTypeMap.forEach(row => {
            let missingColumns = maxRowLength - row.length;
            if (missingColumns > 0) {
                for (let i = 0; i < missingColumns; i++) {
                    row.push(TileType.Undefined);
                }
            }
        });
    }

    /**
     * Flood fills the floor based on the position of the player.
     *
     * @param level
     * @param tileTypeMap
     */
    private floodFillFloor = (level: Level, tileTypeMap: Array<Array<TileType>>): void => {
        this.floodFill(
            level.playerPosition[0],
            level.playerPosition[1],
            TileType.Floor,
            tileTypeMap
        );

        // Error checks
        level.boxPositionList.forEach(boxPosition => {
            if (tileTypeMap[boxPosition[1]][boxPosition[0]] !== TileType.Floor) {
                throw new Error('Invalid level (box position not on floor)');
            }
        });
        level.destinationPositionList.forEach(destinationPosition => {
            if (tileTypeMap[destinationPosition[1]][destinationPosition[0]] !== TileType.Floor) {
                throw new Error('Invalid level (destination position not on floor)');
            }
        });
    }

    /**
     * Replaces all walls with void.
     *
     * @param tileTypeMap
     */
    private removeWalls = (tileTypeMap: Array<Array<TileType>>): void => {
        tileTypeMap.forEach(row => {
            row.forEach((cell, columnIndex) => {
                if (cell === TileType.Wall) {
                    row[columnIndex] = TileType.Undefined;
                }
            })
        });
    }

    /**
     * Flood fills the void.
     *
     * @param tileTypeMap
     */
    private floodFillVoid = (tileTypeMap: Array<Array<TileType>>): void => {
        // Error checks
        if (tileTypeMap[0][0] !== TileType.Undefined) {
            throw new Error('Invalid level (position [0,0] cannot be floor)');
        }

        this.floodFill(
            0,
            0,
            TileType.Void,
            tileTypeMap
        );
    }

    /**
     * Finds and flood fills all ponds.
     *
     * @param tileTypeMap
     */
    private floodFillPonds = (tileTypeMap: Array<Array<TileType>>): void => {
        // Find pond
        for (let rowIndex = 0; rowIndex < tileTypeMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < tileTypeMap[0].length; columnIndex++) {
                if (tileTypeMap[rowIndex][columnIndex] === TileType.Undefined) {
                    console.debug(`Pond found at [${columnIndex}, ${rowIndex}]`)

                    // Fill pond
                    this.floodFill(
                        columnIndex,
                        rowIndex,
                        TileType.Water,
                        tileTypeMap
                    );
                }
            }
        }
    }

    /**
     * Removes all empty rows at the top and bottom of the level.
     *
     * @param tileTypeMap
     */
    // @ts-ignore
    private removeEmptyRows = (tileTypeMap: Array<Array<TileType>>): void => {
        // TODO: Adjust player/box/destination positions
        let oldLevelMap;
        do {
            oldLevelMap = tileTypeMap;
            tileTypeMap = tileTypeMap.filter(
                (row, rowIndex) => !(
                    (rowIndex === 0 || rowIndex === tileTypeMap.length - 1) &&
                    row.every(cell => cell === TileType.Undefined)
                )
            );
        } while (oldLevelMap.length !== tileTypeMap.length);
    }

    /**
     * Converts tile types into tiles.
     *
     * @param level
     * @param tileTypeMap
     */
    private convertToTiles = (level: Level, tileTypeMap: Array<Array<TileType>>): void => {
        /**
         * Returns a single bit of the pattern for the given coordinates.
         *
         * @param columnIndex
         * @param rowIndex
         * @param tileType
         */
        const getTileTypeAt = (columnIndex: number, rowIndex: number, tileType: TileType): number => {
            if (
                columnIndex < 0 ||
                columnIndex >= tileTypeMap[0].length ||
                rowIndex < 0 ||
                rowIndex >= tileTypeMap.length
            ) {
                return 1;
            }
            return tileTypeMap[rowIndex][columnIndex] === tileType ? 0 : 1;
        };

        /**
         * Returns a pattern describing the surroundings of the given coordinates.
         *
         * @param columnIndex
         * @param rowIndex
         * @param tileType
         */
        const getPatternAt = (columnIndex: number, rowIndex: number, tileType: TileType): number => {
            let pattern = 0b00000000;
            pattern |= getTileTypeAt(rowIndex - 1, columnIndex - 1, tileType) ? 0b10000000 : pattern;
            pattern |= getTileTypeAt(rowIndex - 1, columnIndex, tileType) ? 0b01000000 : pattern;
            pattern |= getTileTypeAt(rowIndex - 1, columnIndex + 1, tileType) ? 0b00100000 : pattern;
            pattern |= getTileTypeAt(rowIndex, columnIndex - 1, tileType) ? 0b00010000 : pattern;
            pattern |= getTileTypeAt(rowIndex, columnIndex + 1, tileType) ? 0b00001000 : pattern;
            pattern |= getTileTypeAt(rowIndex + 1, columnIndex - 1, tileType) ? 0b00000100 : pattern;
            pattern |= getTileTypeAt(rowIndex + 1, columnIndex, tileType) ? 0b00000010 : pattern;
            pattern |= getTileTypeAt(rowIndex + 1, columnIndex + 1, tileType) ? 0b00000001 : pattern;
            return pattern;
        };

        for (let rowIndex = 0; rowIndex < tileTypeMap.length; rowIndex++) {
            level.levelMap[rowIndex] = [];
            for (let columnIndex = 0; columnIndex < tileTypeMap[0].length; columnIndex++) {
                switch (tileTypeMap[rowIndex][columnIndex]) {
                    case TileType.Floor:
                        level.levelMap[rowIndex][columnIndex] = level.getTileByPattern(
                            getPatternAt(columnIndex, rowIndex, TileType.Floor),
                            TileStyle.Grass
                        );
                        break;
                    case TileType.Water:
                        level.levelMap[rowIndex][columnIndex] = level.getTileByPattern(
                            getPatternAt(columnIndex, rowIndex, TileType.Water),
                            TileStyle.Water
                        );
                        break;
                    case TileType.Void:
                        level.levelMap[rowIndex][columnIndex] = level.tileMap.get(8, 21);
                        break;
                }
            }
        }
    }

    /**
     * Flood fill algorithm based on http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
     *
     * @param startX
     * @param startY
     * @param fillTile
     * @param levelMap
     */
    private floodFill = (startX: number, startY: number, fillTile: TileType, levelMap: Array<Array<TileType>>): void => {
        let startTileType = levelMap[startY][startX];
        let levelWidth = levelMap[0].length;
        let levelHeight = levelMap.length;

        let positionStack: Array<Array<number>> = [[startX, startY]];
        while(positionStack.length) {
            let position = positionStack.pop()!;
            let columnIndex = position[0];
            let rowIndex = position[1];

            // Travel up
            while(rowIndex >= 0 && levelMap[rowIndex][columnIndex] === startTileType) {
                rowIndex--;
            }
            rowIndex++;

            // Travel down
            let reachLeft = false;
            let reachRight = false;
            while(rowIndex < levelHeight && levelMap[rowIndex][columnIndex] === startTileType) {
                levelMap[rowIndex][columnIndex] = fillTile;

                // Reach left
                if(columnIndex > 0) {
                    if(levelMap[rowIndex][columnIndex - 1] === startTileType) {
                        if(!reachLeft) {
                            positionStack.push([columnIndex - 1, rowIndex]);
                            reachLeft = true;
                        }
                    } else if(reachLeft) {
                        reachLeft = false;
                    }
                }

                // Reach right
                if(columnIndex < levelWidth - 1) {
                    if(levelMap[rowIndex][columnIndex + 1] === startTileType) {
                        if(!reachRight) {
                            positionStack.push([columnIndex + 1, rowIndex]);
                            reachRight = true;
                        }
                    } else if(reachRight) {
                        reachRight = false;
                    }
                }

                rowIndex++;
            }
        }
    }
}
