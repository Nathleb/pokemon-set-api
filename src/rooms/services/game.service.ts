import { Injectable } from '@nestjs/common';
import { GetRandomPokemonsParameterDto } from 'src/pokemon/dtos/get-random-pokemons-parameter.dto';
import { PokemonService } from 'src/pokemon/services/pokemon.service';
import { Room } from '../entities/room';
import { Session } from '../entities/session';
import { DEFAULT } from '../enums/default.enum';
import { RoomManager } from '../manager/room.manager';
import { SessionService } from './session.service';

@Injectable()
export class GameService {

    constructor(private readonly roomanager: RoomManager, private readonly sessionService: SessionService, private readonly pokemonService: PokemonService) {

    }

    async nextBooster(session: Session, roomId: string) {
        try {
            // ... Your code here ...

            let room = this.roomanager.getRoom(roomId);
            if (!room) {
                throw new Error("Room not found.");
            }

            if (room.ownerId !== session.socketId) {
                throw new Error("Bad privileges");
            }

            if (room.boostersLeft > 0) {
                room.boostersLeft--;
                const parameters: GetRandomPokemonsParameterDto = new GetRandomPokemonsParameterDto();
                parameters.size = (room.players.size * room.pkmnPerBooster).toString();

                await this.pokemonService.findManyAtRandom(parameters).then(pokemonSets => {
                    this.shuffleArray(pokemonSets);
                    room!.players.forEach(player => {
                        player.toChoseFrom = pokemonSets.splice(0, room!.pkmnPerBooster);
                    });
                }
                );
            }
            return this.roomanager.updateRoom(room);
        }
        catch (error) {
            console.error(error);
        }
    }


    private shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}