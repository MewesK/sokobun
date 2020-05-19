declare class Resource {
    name: string;
    image: HTMLImageElement | null;
    constructor(name: string, image: HTMLImageElement | null);
}
export default class ResourceLoader {
    cache: Array<Resource>;
    constructor();
    /**
     * Load an array of image URLs.
     * @param urls
     */
    load(urls: Array<string>): Promise<void>;
    get(name: string): Resource | undefined;
    isReady(): boolean;
}
export {};
