export default class Resource {
    public readonly src: string;
    public readonly data: any;

    public constructor(src: string, resource: any) {
        this.src = src;
        this.data = resource;
    }
}
