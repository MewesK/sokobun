import ResourceLoader from './resource/ResourceLoader';

export default abstract class Scene {
    /**
     * Loads the scene.
     * @param resourceLoader
     * @param width
     * @param height
     */
    public abstract load(resourceLoader: ResourceLoader, width: number, height: number): void;

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
