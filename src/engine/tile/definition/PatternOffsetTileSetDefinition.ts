import { OffsetTileDefinition } from './OffsetTileDefinition';

export class PatternOffsetTileSetDefinition {
    public pattern: RegExp;
    public offsetTileDefinitionList: Array<OffsetTileDefinition>;

    constructor(pattern: RegExp, offsetTileDefinitionList: Array<OffsetTileDefinition>) {
        this.pattern = pattern;
        this.offsetTileDefinitionList = offsetTileDefinitionList;
    }
}
