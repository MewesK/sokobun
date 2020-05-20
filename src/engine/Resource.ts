export default class Resource {
    src: string;
    image: HTMLImageElement;

    constructor(src: string, image: HTMLImageElement) {
        this.src = src;
        this.image = image;
    }
}