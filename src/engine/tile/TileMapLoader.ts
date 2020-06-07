import Resource from '../resource/Resource';
import ResourceLoader from '../resource/ResourceLoader';
import TileMap, { TileMapDefinition } from './TileMap';

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
    public load = (inputList: Array<TileMapDefinition>): Promise<Array<TileMap>> => {
        return new Promise((resolve) => {
            let resource: Resource;
            inputList.forEach((input) => {
                resource = this.resourceLoader.get(input.src);
                this.cache.push(
                    new TileMap(
                        TileMap.createTileTable(
                            resource,
                            input.rows,
                            input.columns,
                            input.offsetRows,
                            input.offsetColumns,
                            input.tileWidth,
                            input.tileHeight,
                            input.grid
                        ),
                        resource,
                        input.patternTileDefinitionList,
                        input.weightedTileDefinitionList
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
        const result = this.cache.find((tileMap) => tileMap.resource.src === src);
        if (result === undefined) {
            throw new Error('Invalid src.');
        }
        return result;
    };
}
