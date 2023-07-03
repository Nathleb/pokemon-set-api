import { PokemonSet } from "src/pokemon/classes/pokemonSet";

export interface Player {
    id: string;
    pseudo: string;
    toChoseFrom: PokemonSet[];
    team: PokemonSet[];
}