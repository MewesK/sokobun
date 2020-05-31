import Resource from '../resource/Resource';
import Level from './Level';
import LevelParser from './LevelParser';

export default class LevelLoader {
    private cache: Array<Level> = [];

    /**
     * Loads the given levels using the the given world tile map.
     * @param resourceList
     */
    public load = (resourceList: Array<Resource>): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            resourceList.forEach((resource) => {
                console.debug(`Loading level ${resource.src}...`);

                this.cache.push(new LevelParser().parse(resource));
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
}
