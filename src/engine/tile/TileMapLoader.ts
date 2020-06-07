import TileMap from './TileMap';

export default class TileMapLoader {
    private readonly cache: Array<TileMap> = [];

    /**
     * Loads tile maps from a list of data URLs.
     * @param inputList
     */
    public load = (inputList: Array<TileMap>): Promise<Array<TileMap>> => {
        return new Promise((resolve) => {
            this.cache.push(...inputList);
            resolve();
        });
    };

    /**
     * Returns the tile map with the given data URL.
     * @param src
     */
    public get = (src: string): TileMap => {
        let result = this.cache.find((tileMap) => tileMap.resource.src === src);
        if (result === undefined) {
            throw new Error('Invalid src.');
        }
        return result;
    };
}
