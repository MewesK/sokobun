import Frame from './Frame';

export default class Animation {
    public readonly frameList: Array<Frame>;

    public constructor(frameList: Array<Frame>) {
        if (frameList.length === 0) {
            throw new Error('There must be at least one frame.');
        }

        this.frameList = frameList;
    }
}
