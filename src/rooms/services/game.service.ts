import { Injectable } from '@nestjs/common';
import { PokemonSet } from 'src/pokemon/classes/pokemonSet';
import { GetRandomPokemonsParameterDto } from 'src/pokemon/dtos/get-random-pokemons-parameter.dto';
import { PokemonService } from 'src/pokemon/services/pokemon.service';
import { RoomDTO } from '../dtos/room.dto';
import { Room } from '../entities/room';
import { Session } from '../entities/session';
import { RoomManager } from '../manager/room.manager';
import { SessionService } from './session.service';

@Injectable()
export class GameService {

    constructor(private readonly roomanager: RoomManager, private readonly sessionService: SessionService, private readonly pokemonService: PokemonService) {

    }

    async nextBooster(deviceIdentifier: string, roomId: string): Promise<Room | undefined> {
        try {
            let room = this.roomanager.getRoom(roomId);
            if (!room) {
                throw new Error("Room not found.");
            }

            if (room.ownerId !== deviceIdentifier) {
                throw new Error("Bad privileges");
            }

            room.hasStarted = true;

            if (room.boostersLeft > 0) {
                room.boostersLeft--;
                room = await this.distributePokemons(room);
            }
            return this.roomanager.updateRoom(room);
        }
        catch (error) {
            if (error.message !== "Bad privileges") {
                throw new Error(error);
            }
        }
    }

    async distributePokemons(room: Room): Promise<Room> {
        const parameters: GetRandomPokemonsParameterDto = new GetRandomPokemonsParameterDto();
        parameters.size = (room.players.size * room.pkmnPerBooster * room.nbrBooster).toString();
        if (room.remainingPool.length == 0)
            await this.pokemonService.findManyAtRandom(parameters).then(pokemonSets => {
                this.shuffleArray(pokemonSets);
                room.remainingPool = pokemonSets;
            }
            );

        room.players.forEach(player => {
            player.hasPicked = false;
            player.toChoseFrom = room.remainingPool.splice(0, room.pkmnPerBooster);
        });

        return room;
    }

    nextPick(session: Session, roomId: string, pickedPokemonName: string): Room | undefined {
        try {
            let room = this.roomanager.getRoom(roomId);
            if (!room) {
                throw new Error("Room not found.");
            }

            let player = room.players.get(session.deviceIdentifier);

            if (!player || player.hasPicked) {
                throw new Error("Player not found.");
            }
            let index = player.toChoseFrom.findIndex(pokemonSet => pokemonSet.name == pickedPokemonName);
            if (index !== -1) {
                player.team.push(player.toChoseFrom[index]);
                player.toChoseFrom.splice(index, 1);
                player.hasPicked = true;
            }
            room.players.set(session.deviceIdentifier, player);
            return this.roomanager.updateRoom(room);
        } catch (error) {
            throw new Error(error);
        }

    }

    isNextRotation(room: Room): boolean {
        let isLastPick: boolean = room.boostersLeft == 0;
        for (const player of room.players.values()) {
            if (!player.hasPicked) {
                return false;
            }
            isLastPick = isLastPick && player.toChoseFrom.length == 0;
        }
        return !isLastPick;
    }

    async nextRotation(room: Room): Promise<Room> {
        let players: Session[] = Array.from(room.players.values());
        if (players[0].toChoseFrom.length == 0) {
            return (await this.nextBooster(room.ownerId, room.id))!;
        }

        const toChoseFromArr = players.map(player => player.toChoseFrom);
        if (room.boostersLeft % 2 !== 0) {
            toChoseFromArr.unshift(toChoseFromArr.pop()!);
        } else {
            toChoseFromArr.push(toChoseFromArr.shift()!);
        }

        players.forEach((player, index) => {
            player.toChoseFrom = toChoseFromArr[index];
            player.hasPicked = false;
            room.players.set(player.deviceIdentifier, player);
        });

        return this.roomanager.updateRoom(room);
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