import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { KeyWord } from './keyWord';


export class PokemonSet {

    name: string;
    level: number;
    ability: KeyWord;
    item: KeyWord;
    moves: KeyWord[];
    teraType: string;
    role: string;
    evs: Map<string, number>;
    ivs: Map<string, number>;

    type: string[];
    baseStats: Map<string, number>;
}
