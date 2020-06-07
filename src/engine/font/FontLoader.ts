import Font from './Font';

export default class FontLoader{
    private readonly cache: Array<Font> = [];

    /**
     * Loads fonts from a list of data URLs.
     * @param inputList
     */
    public load = (inputList: Array<Font>): Promise<Array<Font>> => {
        return new Promise((resolve) => {
            this.cache.push(...inputList);
            resolve();
        });
    };

    /**
     * Returns the font with the given family and size.
     * @param family
     * @param size
     */
    public get = (family: string, size: number): Font => {
        let result = this.cache.find((font) => font.family === family && font.size === size);
        if (result === undefined) {
            throw new Error('Invalid family or size.');
        }
        return result;
    };
}
