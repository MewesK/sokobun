import { TileType } from '../tile/Tile';

export default class Level {
    public readonly src: string;
    public readonly tileTypeMap: Array<Array<TileType>> = [[]];
    public readonly playerPosition: [number, number];
    public readonly boxPositionList: Array<[number, number]>;
    public readonly destinationPositionList: Array<[number, number]>;

    public readonly rows: number;
    public readonly columns: number;

    constructor(
        src: string,
        tileTypeMap: Array<Array<TileType>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ) {
        this.src = src;
        this.tileTypeMap = tileTypeMap;
        this.playerPosition = playerPosition;
        this.boxPositionList = boxPositionList;
        this.destinationPositionList = destinationPositionList;

        this.rows = tileTypeMap.length;
        this.columns = tileTypeMap[0].length;
    }

    /**
     * Returns a pattern describing the surroundings of the given coordinates.
     * @param columnIndex
     * @param rowIndex
     * @param tileType
     */
    public getPatternAt = (columnIndex: number, rowIndex: number, tileType: TileType): string => {
        // Check all 8 neighboring cells and create pattern describing if they have the given tile type
        return [
            [columnIndex - 1, rowIndex - 1],
            [columnIndex, rowIndex - 1],
            [columnIndex + 1, rowIndex - 1],
            [columnIndex - 1, rowIndex],
            [columnIndex + 1, rowIndex],
            [columnIndex - 1, rowIndex + 1],
            [columnIndex, rowIndex + 1],
            [columnIndex + 1, rowIndex + 1]
        ]
            .map((coordinates) => this.isTileTypeAt(coordinates[0], coordinates[1], tileType))
            .reduce((pattern: string, isGivenTileType: boolean) => pattern.concat(isGivenTileType ? '1' : '0'), '');
    };

    /**
     * Checks if the given tile type is at the given coordinates.
     * @param columnIndex
     * @param rowIndex
     * @param tileType
     */
    public isTileTypeAt = (columnIndex: number, rowIndex: number, tileType: TileType): boolean => {
        // Check if coordinates are valid
        if (
            columnIndex < 0 ||
            columnIndex >= this.tileTypeMap[0].length ||
            rowIndex < 0 ||
            rowIndex >= this.tileTypeMap.length
        ) {
            return false;
        }

        // Check if cell has the given tile type
        return this.tileTypeMap[rowIndex][columnIndex] === tileType;
    };
}
