import Resource from '../resource/Resource';

export interface CharacterDefinition {
    width: number;
    x: number;
    y: number;
    w: number;
    h: number;
    ox: number;
    oy: number;
}

export interface FontDefinition {
    family: string;
    size: number;
    height: number;
    characterDefinitionList: Record<string, CharacterDefinition>;
}

export enum FontColor {
    Bright,
    Dark
}

export default class Font implements FontDefinition {
    public readonly resource: Resource;
    public readonly color: FontColor;
    public readonly family: string;
    public readonly size: number;
    public readonly height: number;
    public readonly characterDefinitionList: Record<string, CharacterDefinition>;

    constructor(
        resource: Resource,
        color: FontColor,
        family: string,
        size: number,
        height: number,
        characterDefinitionList: Record<string, CharacterDefinition>
    ) {
        this.resource = resource;
        this.color = color;
        this.family = family;
        this.size = size;
        this.height = height;
        this.characterDefinitionList = characterDefinitionList;
    }

    /**
     * Draws the given text.
     * @param x
     * @param y
     * @param text
     * @param context
     */
    public draw = (text: string, x: number, y: number, context: CanvasRenderingContext2D): Font => {
        let characterDefinition: CharacterDefinition;
        let charX = x;
        const charY = y;

        [...text].forEach((char) => {
            characterDefinition = this.characterDefinitionList[char];
            if (characterDefinition !== undefined) {
                context.imageSmoothingEnabled = false;
                context.drawImage(
                    <CanvasImageSource>this.resource.data,
                    characterDefinition.x,
                    characterDefinition.y,
                    characterDefinition.w,
                    characterDefinition.h,
                    charX,
                    charY + (this.size - characterDefinition.oy),
                    characterDefinition.w,
                    characterDefinition.h
                );

                charX += characterDefinition.width - characterDefinition.ox;
            }
        });

        return this;
    };

    /**
     * Calculates the size of the given text.
     * @param text
     */
    public calculateSize = (text: string): [number, number] => {
        let characterDefinition: CharacterDefinition;
        let width = 0;

        [...text].forEach((char) => {
            characterDefinition = this.characterDefinitionList[char];
            if (characterDefinition !== undefined) {
                width += characterDefinition.width - characterDefinition.ox;
            }
        });

        return [width, this.height];
    };
}
