import CharacterDefinition from './CharacterDefinition';

export default interface FontDefinition {
    family: string;
    size: number;
    height: number;
    characterDefinitionList: Record<string, CharacterDefinition>;
}
