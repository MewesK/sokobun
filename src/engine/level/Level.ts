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
            .reduce((previousValue: string, currentValue: boolean) => {
                previousValue += currentValue ? '1' : '0';
                return previousValue;
            }, '');
    };

    /**
     * Checks if the given tile type is at the given coordinates.
     * @param columnIndex
     * @param rowIndex
     * @param tileType
     */
    public isTileTypeAt = (columnIndex: number, rowIndex: number, tileType: TileType): boolean => {
        if (
            columnIndex < 0 ||
            columnIndex >= this.tileTypeMap[0].length ||
            rowIndex < 0 ||
            rowIndex >= this.tileTypeMap.length
        ) {
            return false;
        }

        return this.tileTypeMap[rowIndex][columnIndex] === tileType;
    };
}
