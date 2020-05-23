export default class Resource {
    src: string;
    data: any;

    constructor(src: string, resource: any) {
        this.src = src;
        this.data = resource;
    }
}
