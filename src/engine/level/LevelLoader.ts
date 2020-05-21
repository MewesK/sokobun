import Resource from '../resource/Resource';
import TileMap from '../TileMap';
import Level, {LevelTile} from './Level';

export default class LevelLoader {
    cache: Array<Level> = [];

    load = (resourceList: Array<Resource>, tileMap: TileMap): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            resourceList.forEach((resource) => {
                const level = new Level(resource.src, tileMap);

                this.parse(resource, level);
                this.fillRows(level);
                this.floodFillFloor(level);
                this.removeWalls(level);
                //this.removeEmptyRows(level);
                // TODO: Remove empty columns
                // TODO: Edge detection

                console.log(level);

                this.cache.push(level);
            });

            console.log('Levels finished loading...');
            resolve(this.cache);
        });
    }

    get = (src: string): Level => {
        let result = this.cache.find(value => value.src === src);
        if (result === undefined) {
            throw new Error();
        }
        return result;
    }

    /**
     * This function parses the level file and creates an two dimensional array.
     *
     * @param resource
     * @param level
     */
    private parse = (resource: Resource, level: Level): Level => {
        let columnIndex = 0;
        let rowIndex = 0;

        [...resource.resource].forEach(character => {
            switch (character) {
                case '\n':
                    columnIndex = 0;
                    level.levelMap[++rowIndex] = [];
                    break;
                case '#':
                    level.levelMap[rowIndex][columnIndex++] = LevelTile.Wall;
                    break;
                case ' ':
                    level.levelMap[rowIndex][columnIndex++] = LevelTile.Void;
                    break;
                case '@':
                    level.playerPosition = [columnIndex, rowIndex];
                    level.levelMap[rowIndex][columnIndex++] = LevelTile.Void;
                    break;
                case '$':
                    level.boxPositionList.push([columnIndex, rowIndex]);
                    level.levelMap[rowIndex][columnIndex++] = LevelTile.Void;
                    break;
                case '.':
                    level.destinationPositionList.push([columnIndex, rowIndex]);
                    level.levelMap[rowIndex][columnIndex++] = LevelTile.Void;
                    break;
            }
        });

        // Error checks
        if (level.playerPosition.length === 0) {
            throw new Error('Invalid level (no player)');
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

        return level;
    }

    /**
     * This function makes sure that all rows have the same length.
     *
     * @param level
     */
    private fillRows = (level: Level): Level => {
        // Find max row length
        let maxRowLength = 0;
        level.levelMap.forEach(row => {
            if (row.length > maxRowLength) {
                maxRowLength = row.length;
            }
        });

        // Fill all rows to match max row length
        level.levelMap.forEach(row => {
            let missingColumns = maxRowLength - row.length;
            if (missingColumns > 0) {
                for (let i = 0; i < missingColumns; i++) {
                    row.push(LevelTile.Void);
                }
            }
        });

        return level;
    }

    /**
     * This function flood fills the floor based on the position of the player.
     *
     * @param level
     */
    private floodFillFloor = (level: Level): Level => {
        let levelWidth = level.levelMap[0].length;
        let levelHeight = level.levelMap.length;

        let cellStack: Array<Array<number>> = [level.playerPosition];
        while(cellStack.length) {
            let newCell = cellStack.pop()!;
            let columnIndex = newCell[0];
            let rowIndex = newCell[1];

            // Travel up
            while(rowIndex >= 0 && level.levelMap[rowIndex][columnIndex] === LevelTile.Void) {
                rowIndex--;
            }

            // Travel down
            rowIndex++;
            let reachLeft = false;
            let reachRight = false;
            while(rowIndex < levelHeight - 1 && level.levelMap[rowIndex][columnIndex] === LevelTile.Void) {
                level.levelMap[rowIndex][columnIndex] = LevelTile.Floor;

                // Check right
                if(columnIndex > 0) {
                    if(level.levelMap[rowIndex][columnIndex - 1] === LevelTile.Void) {
                        if(!reachLeft) {
                            cellStack.push([columnIndex - 1, rowIndex]);
                            reachLeft = true;
                        }
                    } else if(reachLeft) {
                        reachLeft = false;
                    }
                }

                // Check left
                if(columnIndex < levelWidth - 1) {
                    if(level.levelMap[rowIndex][columnIndex + 1] === LevelTile.Void) {
                        if(!reachRight) {
                            cellStack.push([columnIndex + 1, rowIndex]);
                            reachRight = true;
                        }
                    } else if(reachRight) {
                        reachRight = false;
                    }
                }

                rowIndex++;
            }
        }

        // Error checks
        level.boxPositionList.forEach(boxPosition => {
            if (level.levelMap[boxPosition[1]][boxPosition[0]] !== LevelTile.Floor) {
                throw new Error('Invalid level (box position not on floor)');
            }
        });
        level.destinationPositionList.forEach(destinationPosition => {
            if (level.levelMap[destinationPosition[1]][destinationPosition[0]] !== LevelTile.Floor) {
                throw new Error('Invalid level (destination position not on floor)');
            }
        });

        return level;
    }

    /**
     * This function replaces all walls with void.
     *
     * @param level
     */
    private removeWalls = (level: Level): Level => {
        level.levelMap.forEach(row => {
            row.forEach((cell, columnIndex) => {
                if (cell === LevelTile.Wall) {
                    row[columnIndex] = LevelTile.Void;
                }
            })
        });

        return level;
    }

    /**
     * This function removes all empty rows at the top and bottom of the level.
     *
     * @param level
     */
    // @ts-ignore
    private removeEmptyRows = (level: Level): Level => {
        // TODO: Adjust player/box/destination positions
        let oldLevelMap;
        do {
            oldLevelMap = level.levelMap;
            level.levelMap = level.levelMap.filter(
                (row, rowIndex) => !(
                    (rowIndex === 0 || rowIndex === level.levelMap.length - 1) &&
                    row.every(cell => cell === LevelTile.Void)
                )
            );
        } while (oldLevelMap.length !== level.levelMap.length);

        return level;
    }
}
