import Resource from '../resource/Resource';

export default abstract class Font {
    public readonly resource: Resource;

    public readonly abstract family: string;
    public readonly abstract height: number;
    public readonly abstract size: number;
    public readonly abstract chars: Record<string, any>;

    constructor(resource: Resource) {
        this.resource = resource;
    }

    /**
     * Draws the given text.
     * @param x
     * @param y
     * @param text
     * @param context
     */
    public draw = (text: string, x: number, y: number, context: CanvasRenderingContext2D): void => {
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
    }
}
