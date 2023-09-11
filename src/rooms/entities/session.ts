import { PokemonSet } from "src/pokemon/classes/pokemonSet";

export interface Session {
    socketId: string;

    inRoomId: string;

    //Player
    pseudo: string;
    toChoseFrom: PokemonSet[];
    team: PokemonSet[];
    sit: number;
    hasPicked: boolean;
    deviceIdentifier: string;
}