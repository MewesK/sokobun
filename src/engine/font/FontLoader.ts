import Font, { FontColor } from './Font';
import ResourceLoader from '../resource/ResourceLoader';

export default class FontLoader {
    private readonly resourceLoader: ResourceLoader;
    private readonly cache: Array<Font> = [];

    constructor(resourceLoader: ResourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * Loads fonts from a list of font URLs.
     * @param inputList [font definition, font color, font URL]
     */
    public load = (inputList: Array<[any, FontColor, string]>): Promise<Array<Font>> => {
        return new Promise((resolve) => {
            inputList.forEach((input) => {
                this.cache.push(
                    new Font(
                        this.resourceLoader.get(input[2]),
                        input[1],
                        input[0].family,
                        input[0].size,
                        input[0].height,
                        input[0].chars
                    )
                );
            });
            resolve();
        });
    };

    /**
     * Returns the font with the given family and size.
     * @param family
     * @param size
     * @param color
     */
    public get = (family: string, size: number, color: FontColor): Font => {
        const result = this.cache.find((font) => font.family === family && font.size === size && font.color === color);
        if (result === undefined) {
            throw new Error('Invalid family or size.');
        }
        return result;
    };
}
