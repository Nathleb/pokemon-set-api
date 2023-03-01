import { KeyWord } from '../entities/keyWord.entity';

export class PokemonSet {

    name: string;
    level: number;
    ability: KeyWord;
    item: KeyWord;
    moves: Array<KeyWord>;
    teraType: string;
    role: string;
    evs: Map<string, number>;
    ivs: Map<string, number>;

    type: Array<string>;
    baseStats: Map<string, number>;
}
