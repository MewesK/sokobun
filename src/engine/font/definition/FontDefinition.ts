import { CharacterDefinition } from '../Font';

export interface FontDefinition {
    family: string;
    size: number;
    height: number;
    characterDefinitionList: Record<string, CharacterDefinition>;
}
