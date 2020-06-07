import Resource from '../resource/Resource';

export enum FontColor {
    Bright,
    Dark
}

export default class Font {
    public readonly resource: Resource;
    public readonly color: FontColor;
    public readonly family: string;
    public readonly size: number;
    protected readonly height: number;
    protected readonly chars: Record<string, any>;

    constructor(
        resource: Resource,
        color: FontColor,
        family: string,
        size: number,
        height: number,
        chars: Record<string, any>
    ) {
        this.resource = resource;
        this.color = color;
        this.family = family;
        this.size = size;
        this.height = height;
        this.chars = chars;
    }

    /**
     * Draws the given text.
     * @param x
     * @param y
     * @param text
     * @param context
     */
    public draw = (text: string, x: number, y: number, context: CanvasRenderingContext2D): Font => {
        let charDefinition: any;
        let charX = x;
        let charY = y;

        [...text].forEach((char) => {
            charDefinition = this.chars[char];
            if (charDefinition !== undefined) {
                context.imageSmoothingEnabled = false;
                context.drawImage(
                    this.resource.data,
                    charDefinition.x,
                    charDefinition.y,
                    charDefinition.w,
                    charDefinition.h,
                    charX,
                    charY + (this.size - charDefinition.oy),
                    charDefinition.w,
                    charDefinition.h
                );

                charX += charDefinition.width - charDefinition.ox;
            }
        });

        return this;
    };

    /**
     * Calculates the size of the given text.
     * @param text
     */
    public calculateSize = (text: string): [number, number] => {
        let charDefinition: any;
        let width = 0;

        [...text].forEach((char) => {
            charDefinition = this.chars[char];
            if (charDefinition !== undefined) {
                width += charDefinition.width - charDefinition.ox;
            }
        });

        return [width, this.height];
    };
}
