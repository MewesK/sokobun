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

                new LevelParser().parse(resource).then((levelList) => {
                    this.cache.push(...levelList);
                    decreaseCounter();
                });
            });
        });
    };

    /**
     * Returns the first level;
     */
    public first = (): Level => {
        return this.cache[0];
    };

    /**
     * Returns the level with the given data URL.
     * @param name
     */
    public get = (name: string): Level => {
        let result = this.cache.find((level) => level.name === name);
        if (result === undefined) {
            throw new Error();
        }
        return result;
    };

    /**
     * Returns the next level;
     */
    public next = (currentLevel: Level): Level | undefined => {
        const currentIndex = this.cache.indexOf(currentLevel);
        if (currentIndex >= 0 && currentIndex < this.cache.length) {
            return this.cache[currentIndex + 1];
        }
        return undefined;
    };

}
