export default class Resource {
    src: string;
    resource: any;

    constructor(src: string, resource: any) {
        this.src = src;
        this.resource = resource;
    }
}