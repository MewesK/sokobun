import Resource from '../resource/Resource';
import ResourceLoader from '../resource/ResourceLoader';
import { TileMapDefinition } from './definition/TileMapDefinition';
import { OffsetTile } from './OffsetTile';
import { PatternOffsetTileList } from './PatternOffsetTileList';
import { RandomTile } from './RandomTile';
import TileMap from './TileMap';
import PixelPosition from "../core/PixelPosition";

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
                        TileMap.createTileTable(resource, input.size, input.offset, input.tileSize, input.grid),
                        resource,
                        input.randomTileDefinitionList?.map(
                            (randomTileDefinition) =>
                                new RandomTile(
                                    resource,
                                    new PixelPosition(
                                        randomTileDefinition.position.x * (input.tileSize.width + input.grid),
                                        randomTileDefinition.position.y * (input.tileSize.height + input.grid)
                                    ),
                                    input.tileSize,
                                    randomTileDefinition.probability
                                )
                        ),
                        input.patternOffsetTileSetDefinitionList?.map(
                            (patternOffsetTileSetDefinition) =>
                                new PatternOffsetTileList(
                                    patternOffsetTileSetDefinition.pattern,
                                    patternOffsetTileSetDefinition.offsetTileDefinitionList.map(
                                        (offsetTileDefinition) =>
                                            new OffsetTile(
                                                resource,
                                                new PixelPosition(
                                                    offsetTileDefinition.position.x * (input.tileSize.width + input.grid),
                                                    offsetTileDefinition.position.y * (input.tileSize.height + input.grid)
                                                ),
                                                input.tileSize,
                                                offsetTileDefinition.offset
                                            )
                                    )
                                )
                        )
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
