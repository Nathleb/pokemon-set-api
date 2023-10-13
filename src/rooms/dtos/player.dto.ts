import { PokemonSet } from 'src/pokemon/classes/pokemonSet';
import { Session } from '../entities/session';

export class PlayerDTO {
    pseudo: string;
    toChoseFrom: PokemonSet[];
    team: PokemonSet[];
    sit: number;
    hasPicked: boolean;
    isConnected: boolean;

    constructor(player: Session) {
        this.pseudo = player.pseudo;
        this.team = player.team;
        this.toChoseFrom = player.toChoseFrom;
        this.sit = player.sit;
        this.hasPicked = player.hasPicked;
        this.isConnected = player.isConnected;
    }
}