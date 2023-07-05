import { Injectable } from '@nestjs/common';
import { GameParameters } from '../entities/gameParameters';
import { Player } from '../entities/player';
import { Room } from '../entities/room';
import { Session } from '../entities/session';
import { PlayerManager } from '../manager/player.manager';
import { RoomManager } from '../manager/room.manager';
import { GameService } from './game.service';

@Injectable()
export class RoomService {

    constructor(private readonly roomanager: RoomManager, private readonly playermanager: PlayerManager, private readonly gameService: GameService) {

    }

    createRoom(ownerSession: Session, size: number): Room {
        let room = this.roomanager.createRoom(ownerSession, size);
        return this.joinRoom(ownerSession, room.id);
    }

    joinRoom(playerSession: Session, roomId: string): Room {
        let room = this.roomanager.getRoom(roomId);
        if (!room) {
            throw new Error;
        }

        if (room.players.size < room.size) {
            const player = this.playermanager.createPlayer(playerSession, room.players.size + 1);
            room.players.set(player.id, player);
        }

        return this.roomanager.updateRoom(room);
    }

    quitRoom(playerSession: Session, roomId: string): Room {
        let room = this.roomanager.getRoom(roomId);
        if (!room) {
            throw new Error;
        }

        room.players.delete(playerSession.id);
        return this.roomanager.updateRoom(room);
    }

    deleteRoom(roomId: string): void {
        return this.roomanager.deleteRoom(roomId);
    }

    async startGame(session: Session, gameParameters: GameParameters): Promise<Room> {
        let room = this.roomanager.getRoom(gameParameters.roomId);
        if (!room || room.owner.id !== session.id) {
            throw new Error;
        }

        room.gameParameters = gameParameters;
        return this.roomanager.updateRoom(await this.gameService.launch(room));
    }

    getPlayer(session: Session, roomId: string): Player {
        let room = this.roomanager.getRoom(roomId);
        if (!room) {
            throw new Error;
        }

        const player = room.players.get(session.id);

        if (player === undefined) {
            throw new Error;
        }

        return player;
    }


    pickPokemon(session: Session, roomId: string, pkmnName: string): Room {
        let room = this.roomanager.getRoom(roomId);
        if (!room) {
            throw new Error;
        }

        room = this.gameService.pickPokemon(session, room, pkmnName);

        return this.roomanager.updateRoom(room);
    }
}