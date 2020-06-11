import { OffsetTile } from './OffsetTile';

export class PatternOffsetTileList {
    public pattern: RegExp;
    public offsetTileList: Array<OffsetTile>;

    constructor(pattern: RegExp, offsetTileList: Array<OffsetTile>) {
        this.pattern = pattern;
        this.offsetTileList = offsetTileList;
    }
}
