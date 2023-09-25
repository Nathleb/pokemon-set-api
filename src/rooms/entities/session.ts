import { PokemonSet } from "src/pokemon/classes/pokemonSet";

export interface Session {
    socketId: string;
    deviceIdentifier: string;
    inRoomId: string;
    pseudo: string;

    //Player
    toChoseFrom: PokemonSet[];
    team: PokemonSet[];
    sit: number;
    hasPicked: boolean;
}