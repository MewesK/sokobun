import Resource from '../resource/Resource';
import ResourceLoader from '../resource/ResourceLoader';
import PatternTileMap, { PatternTileMapDefinition } from './PatternTileMap';
import RandomTileMap, { RandomTileMapDefinition } from './RandomTileMap';
import Tile from './Tile';
import TileMap, { TileMapDefinition } from './TileMap';

export default class TileMapLoader {
    private readonly resourceLoader: ResourceLoader;
    private readonly cache: Array<TileMap> = [];

    constructor(resourceLoader: ResourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * Loads tile maps from a list of data URLs.
     * @param inputList [[tile map constructor, tile map URL, rows, columns, row offset, column offset, tile width, tile height, grid, optional argument]]
     */
    public load = (inputList: Array<TileMapDefinition>): Promise<Array<TileMap>> => {
        return new Promise((resolve) => {
            let resource: Resource;
            let tileTable: Array<Array<Tile>>;
            inputList.forEach((input) => {
                resource = this.resourceLoader.get(input.src);
                tileTable = TileMap.createTileTable(
                    resource,
                    input.rows,
                    input.columns,
                    input.offsetRows,
                    input.offsetColumns,
                    input.tileWidth,
                    input.tileHeight,
                    input.grid
                );
                if ((<PatternTileMapDefinition>input).patternTileDefinitionList) {
                    this.cache.push(
                        new PatternTileMap(
                            tileTable,
                            resource,
                            (<PatternTileMapDefinition>input).patternTileDefinitionList
                        )
                    );
                } else if ((<RandomTileMapDefinition>input).weightedTileDefinitionList) {
                    this.cache.push(
                        new RandomTileMap(
                            tileTable,
                            resource,
                            (<RandomTileMapDefinition>input).weightedTileDefinitionList
                        )
                    );
                } else {
                    this.cache.push(new TileMap(tileTable, resource));
                }
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
