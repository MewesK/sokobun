import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Resource from '../resource/Resource';
import CharacterDefinition from './definition/CharacterDefinition';
import FontDefinition from './definition/FontDefinition';
import KerningDefinition from './definition/KerningDefinition';

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
    public readonly ascender: number;
    public readonly descender: number;
    public readonly characterDefinitionList: Array<CharacterDefinition>;
    public readonly kerningDefinitionList: Array<KerningDefinition>;

    constructor(
        resource: Resource,
        color: FontColor,
        family: string,
        size: number,
        height: number,
        ascender: number,
        descender: number,
        characterDefinitionList: Array<CharacterDefinition>,
        kerningDefinitionList: Array<KerningDefinition>
    ) {
        this.resource = resource;
        this.color = color;
        this.family = family;
        this.size = size;
        this.height = height;
        this.ascender = ascender;
        this.descender = descender;
        this.characterDefinitionList = characterDefinitionList;
        this.kerningDefinitionList = kerningDefinitionList;
    }

    /**
     * Draws the given text.
     * @param text
     * @param position
     * @param context
     */
    public draw = (text: string, position: PixelPosition, context: CanvasRenderingContext2D): Font => {
        let characterDefinition: CharacterDefinition | undefined;
        let charX = position.x;
        const charY = position.y;

        [...text].forEach((char) => {
            characterDefinition = this.characterDefinitionList.find(
                (characterDefinition) => characterDefinition.char == char
            );
            if (characterDefinition !== undefined) {
                context.imageSmoothingEnabled = false;
                if (characterDefinition.w > 0 && characterDefinition.h > 0) {
                    context.drawImage(
                        <CanvasImageSource>this.resource.data,
                        characterDefinition.x,
                        characterDefinition.y,
                        characterDefinition.w,
                        characterDefinition.h,
                        charX,
                        charY + (this.ascender - characterDefinition.oy),
                        characterDefinition.w,
                        characterDefinition.h
                    );
                }

                charX += characterDefinition.width - characterDefinition.ox;
            }
        });
        return this;
    };

    /**
     * Calculates the size of the given text.
     * @param text
     */
    public measure = (text: string): PixelSize => {
        let characterDefinition: CharacterDefinition | undefined;
        let width = 0;

        [...text].forEach((char) => {
            characterDefinition = this.characterDefinitionList.find(
                (characterDefinition) => characterDefinition.char == char
            );
            if (characterDefinition !== undefined) {
                width += characterDefinition.width - characterDefinition.ox;
            }
        });

        return new PixelSize(width, this.height);
    };
}
