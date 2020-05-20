import Resource from "./Resource";

export default class ResourceLoader {
    cache: Array<Resource>;

    constructor() {
        this.cache = [];
    }

    /**
     * Load an array of resource URLs.
     * @param srcList
     */
    load = (srcList: Array<string>): Promise<void> => {
        return new Promise((resolve) => {
            let counter = srcList.length;

            const decreaseCounter = () => {
                if (--counter === 0) {
                    console.log('Resources finished loading...');
                    resolve();
                }
            };

            // Create and load resources
            srcList.forEach((src) => {
                // Image resource handling
                if (src.match(/^.*\.png$/)) {
                    const image = new Image();
                    image.addEventListener('load', () => {
                        this.cache.push(new Resource(src, image));
                        decreaseCounter();
                    }, false);
                    image.src = src;
                }

                // Other resource handling
                else {
                    fetch(src).then(response => {
                        response.text().then(value => {
                            this.cache.push(new Resource(src, value));
                            decreaseCounter();
                        })
                    });
                }
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