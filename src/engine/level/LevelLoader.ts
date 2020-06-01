import Resource from '../resource/Resource';
import Level from './Level';
import LevelParser from './LevelParser';

export default class LevelLoader {
    private cache: Array<Level> = [];

    /**
     * Loads levels from a list of resources.
     * @param resourceList
     */
    public load = (resourceList: Array<Resource>): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            let counter = resourceList.length;

            const decreaseCounter = () => {
                if (--counter === 0) {
                    console.log('Levels finished loading...');
                    resolve(this.cache);
                }
            };

            resourceList.forEach((resource) => {
                console.debug(`Loading level ${resource.src}...`);

                new LevelParser().parse(resource).then((level) => {
                    this.cache.push(level);
                    decreaseCounter();
                });
            });
        });
    };

    /**
     * Returns the level with the given data URL.
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
