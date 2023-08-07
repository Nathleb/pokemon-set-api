import { PokemonSet } from "src/pokemon/classes/pokemonSet";
import { Session } from "./session";


export interface Room {
    id: string;
    ownerId: string;
    name: string,
    size: number,
    players: Map<string, Session>;
    nbrBooster: number,
    pkmnPerBooster: number,
    boostersLeft: number;
    remainingPool: PokemonSet[];
}
