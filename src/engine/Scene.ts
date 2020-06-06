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
     * @param bufferCanvas
     * @param bufferContext
     */
    public abstract draw(bufferCanvas: HTMLCanvasElement, bufferContext: CanvasRenderingContext2D): void;
}
