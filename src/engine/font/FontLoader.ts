import Font from './Font';
import Resource from '../resource/Resource';

export default class FontLoader {
    private readonly cache: Array<Font> = [];

    /**
     * Loads fonts from a list of data URLs.
     * @param inputList [font definition, color name, bitmap font]
     */
    public load = (inputList: Array<[any, string, Resource]>): Promise<Array<Font>> => {
        console.log(inputList);
        return new Promise((resolve) => {
            inputList.forEach((input) => {
                this.cache.push(new Font(
                    input[2],
                    input[1],
                    input[0].family,
                    input[0].size,
                    input[0].height,
                    input[0].chars
                ));
            })
            resolve();
        });
    };

    /**
     * Returns the font with the given family and size.
     * @param family
     * @param size
     * @param color
     */
    public get = (family: string, size: number, color: string): Font => {
        let result = this.cache.find((font) => font.family === family && font.size === size && font.color === color);
        if (result === undefined) {
            throw new Error('Invalid family or size.');
        }
        return result;
    };
}
