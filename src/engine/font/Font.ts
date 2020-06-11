import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Resource from '../resource/Resource';
import { CharacterDefinition } from './definition/CharacterDefinition';
import { FontDefinition } from './definition/FontDefinition';

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
     * @param text
     * @param position
     * @param context
     */
    public draw = (text: string, position: PixelPosition, context: CanvasRenderingContext2D): Font => {
        let characterDefinition: CharacterDefinition;
        let charX = position.x;
        const charY = position.y;

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
     * Draws the given text.
     * @param text
     * @param position
     * @param parentSize
     * @param context
     */
    public drawCentered = (
        text: string,
        position: PixelPosition,
        parentSize: PixelSize,
        context: CanvasRenderingContext2D
    ): Font => {
        const textSize = this.measure(text);
        this.draw(
            text,
            new PixelPosition(
                position.x + (parentSize.width - textSize.width) / 2,
                position.y + (parentSize.height - textSize.height) / 2
            ),
            context
        );
        return this;
    };

    /**
     * Calculates the size of the given text.
     * @param text
     */
    public measure = (text: string): PixelSize => {
        let characterDefinition: CharacterDefinition;
        let width = 0;

        [...text].forEach((char) => {
            characterDefinition = this.characterDefinitionList[char];
            if (characterDefinition !== undefined) {
                width += characterDefinition.width - characterDefinition.ox;
            }
        });

        return new PixelSize(width, this.height);
    };
}
