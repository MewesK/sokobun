import {Resource} from "./Resource";

export class ResourceLoader {
    cache: Array<Resource>;

    constructor() {
        this.cache = [];
    }

    /**
     * Load an array of image URLs.
     * @param srcList
     */
    load = (srcList: Array<string>): Promise<void> => {
        return new Promise((resolve) => {
            let counter = srcList.length;
            srcList.forEach((src) => {
                // Create and load image
                const image = new Image();
                image.addEventListener('load', () => {
                    if (--counter === 0) {
                        console.log('Resources finished loading...');
                        resolve();
                    }
                }, false);
                image.src = src;

                // Create resource
                this.cache.push(new Resource(src, image));
            });
        });
    }

    get = (src: string): Resource => {
        let result = this.cache.find(value => value.src === src);
        if (result === undefined) {
            throw new Error();
        }
        return result;
    }
}