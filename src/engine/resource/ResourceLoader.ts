import Resource from './Resource';

export default class ResourceLoader {
    private readonly cache: Array<Resource> = [];

    /**
     * Loads resources from a list of data URLs.
     * @param srcList
     */
    public load = (srcList: Array<string>): Promise<Array<Resource>> => {
        return new Promise((resolve) => {
            let counter = srcList.length;

            const decreaseCounter = () => {
                if (--counter === 0) {
                    console.log('Resources finished loading...');
                    resolve(this.cache);
                }
            };

            // Create and load resources
            srcList.forEach((src) => {
                // Image data handling
                if (src.match(/^.*\.png$/)) {
                    const image = new Image();
                    image.addEventListener(
                        'load',
                        () => {
                            this.cache.push(new Resource(src, image));
                            decreaseCounter();
                        },
                        false
                    );
                    image.src = src;
                }

                // Other data handling
                else {
                    fetch(src).then((response) => {
                        response.text().then((value) => {
                            this.cache.push(new Resource(src, value));
                            decreaseCounter();
                        });
                    });
                }
            });
        });
    };

    /**
     * Returns the resource with the given data URL.
     * @param src
     */
    public get = (src: string): Resource => {
        let result = this.cache.find((resource) => resource.src === src);
        if (result === undefined) {
            throw new Error('Invalid src.');
        }
        return result;
    };
}
