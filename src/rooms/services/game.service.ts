import { Injectable } from '@nestjs/common';
import { PokemonSet } from 'src/pokemon/classes/pokemonSet';
import { PokemonService } from 'src/pokemon/services/pokemon.service';
import { GameParameters } from '../entities/gameParameters';
import { Player } from '../entities/player';
import { Room } from '../entities/room';
import { Session } from '../entities/session';
import { PlayerManager } from '../manager/player.manager';
import { RoomManager } from '../manager/room.manager';

@Injectable()
export class GameService {


    constructor(private readonly pokemonService: PokemonService) {

    }


    async launch(room: Room): Promise<Room> {
        let { players, gameParameters } = room;
        const totalPokemon: number = players.size * gameParameters!.pkmnPerBooster;
        const pkmnPool = await this.pokemonService.findManyAtRandom({
            size: `${totalPokemon}`
        });

        players.forEach(player => {
            player.toChoseFrom = pkmnPool.splice(-gameParameters!.pkmnPerBooster);
        });

        room.players = players;
        return room;
    }

    pickPokemon(session: Session, room: Room, pkmnName: string): Room {
        const player = room.players.get(session.id);

        if (player === undefined) {
            throw new Error;
        }

        const pkmn = player.toChoseFrom.splice(player.toChoseFrom.findIndex(pkmn => pkmn.name === pkmnName), 1)[0];
        player.team.push(pkmn);
        player.hasPicked = true;

        room.players.set(player.id, player);
        if (this.haveAllPicked([...room.players.values()])) {
            room.readyToPick = true;
            room.players = this.resetHasPicked([...room.players.values()]);
        }

        return room;
    }


    private haveAllPicked(players: Player[]): boolean {
        for (let i = 0; i < players.length; i++) {
            if (!players[i].hasPicked) {
                return false;
            }
        }
        return true;
    }

    private resetHasPicked(players: Player[]): Map<string, Player> {
        return players.reduce((map, player) => map.set(player.id, player), new Map<string, Player>());
    }
}