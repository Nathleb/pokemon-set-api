import { PokemonSet } from 'src/pokemon/classes/pokemonSet';
import { Player } from '../entities/player';

export class PlayerDTO {
    pseudo: string;
    toChoseFrom: PokemonSet[];
    team: PokemonSet[];
    sit: number;
    hasPicked: boolean;

    constructor(player: Player) {
        this.pseudo = player.pseudo;
        this.team = player.team;
        this.toChoseFrom = player.toChoseFrom;
        this.sit = player.sit;
        this.hasPicked = player.hasPicked;
    }
}