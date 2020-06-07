export default class Resource {
    public readonly src: string;
    public readonly data: string | CanvasImageSource | HTMLAudioElement;

    public constructor(src: string, resource: string | CanvasImageSource | HTMLAudioElement) {
        this.src = src;
        this.data = resource;
    }
}
