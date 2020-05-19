import { Resource } from "./Resource";
export declare class ResourceLoader {
    cache: Array<Resource>;
    constructor();
    /**
     * Load an array of image URLs.
     * @param srcList
     */
    load: (srcList: string[]) => Promise<void>;
    get: (src: string) => Resource;
}
