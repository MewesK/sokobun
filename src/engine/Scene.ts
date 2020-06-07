import ResourceLoader from './resource/ResourceLoader';
import FontLoader from './font/FontLoader';
import TileMapLoader from './tile/TileMapLoader';

export default abstract class Scene {
    public finished = false;

    /**
     * Loads the scene.
     * @param resourceLoader
     * @param tileMapLoader
     * @param fontLoader
     * @param width
     * @param height
     */
    public abstract load(
        resourceLoader: ResourceLoader,
        tileMapLoader: TileMapLoader,
        fontLoader: FontLoader,
        width: number,
        height: number
    ): void;

    /**
     * Controls the scene.
     * @param pressedKey
     */
    public abstract control(pressedKey: string): void;

    /**
     * Updates the scene.
     * @param dt
     */
    public abstract update(dt: number): void;

    /**
     * Draws the scene.
     * @param canvas
     * @param context
     */
    public abstract draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
}
