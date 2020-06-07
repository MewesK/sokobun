import Level from './Level';
import LevelParser from './LevelParser';
import ResourceLoader from '../resource/ResourceLoader';

export default class LevelLoader {
    private readonly resourceLoader: ResourceLoader;
    private readonly cache: Array<Level> = [];

    constructor(resourceLoader: ResourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * Loads levels from a list of level URLs.
     * @param inputList
     */
    public load = (inputList: Array<string>): Promise<Array<Level>> => {
        return new Promise((resolve) => {
            let counter = inputList.length;

            const decreaseCounter = () => {
                if (--counter === 0) {
                    console.log('Levels finished loading...');
                    resolve(this.cache);
                }
            };

            inputList.forEach((input) => {
                console.debug(`Loading level ${input}...`);

                new LevelParser().parse(this.resourceLoader.get(input)).then((levelList) => {
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
