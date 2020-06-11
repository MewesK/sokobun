import PixelSize from './core/PixelSize';
import FontLoader from './font/FontLoader';
import ResourceLoader from './resource/ResourceLoader';
import TileMapLoader from './tile/TileMapLoader';

export default abstract class Scene {
    public finished = false;

    /**
     * Loads the scene.
     * @param resourceLoader
     * @param tileMapLoader
     * @param fontLoader
     * @param size
     */
    public abstract load(
        resourceLoader: ResourceLoader,
        tileMapLoader: TileMapLoader,
        fontLoader: FontLoader,
        size: PixelSize
    ): void;

    /**
     * Controls the scene.
     * @param pressedKey
     * @param lastTime
     */
    public abstract control(pressedKey: string, lastTime: number): void;

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
