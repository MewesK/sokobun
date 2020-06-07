import Resource from '../resource/Resource';
import Level from './Level';
import LevelParser from './LevelParser';

export default class LevelLoader {
    private cache: Array<Level> = [];

    /**
     * Loads levels from a list of resources.
     * @param inputList
     */
    public load = (inputList: Array<Resource>): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            let counter = inputList.length;

            const decreaseCounter = () => {
                if (--counter === 0) {
                    console.log('Levels finished loading...');
                    resolve(this.cache);
                }
            };

            inputList.forEach((resource) => {
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
