import CharacterDefinition from './CharacterDefinition';
import KerningDefinition from './KerningDefinition';

export default interface FontDefinition {
    family: string;
    size: number;
    height: number;
    ascender: number;
    descender: number;
    characterDefinitionList: Array<CharacterDefinition>;
    kerningDefinitionList: Array<KerningDefinition>;
}
