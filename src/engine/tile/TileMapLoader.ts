import TileMap from './TileMap';
import ResourceLoader from '../resource/ResourceLoader';
import Resource from '../resource/Resource';

export default class TileMapLoader {
    private readonly resourceLoader: ResourceLoader;
    private readonly cache: Array<TileMap> = [];

    constructor(resourceLoader: ResourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * Loads tile maps from a list of data URLs.
     * @param inputList
     */
    public load = (
        inputList: Array<
            [new (...args: any[]) => TileMap, string, number, number, number, number, number, number, number, any]
        >
    ): Promise<Array<TileMap>> => {
        return new Promise((resolve) => {
            let resource: Resource;
            inputList.forEach((input) => {
                resource = this.resourceLoader.get(input[1]);
                this.cache.push(
                    new input[0](
                        TileMap.createTileTable(
                            resource,
                            input[2],
                            input[3],
                            input[4],
                            input[5],
                            input[6],
                            input[7],
                            input[8]
                        ),
                        resource,
                        input[9] // Optional
                    )
                );
            });
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
