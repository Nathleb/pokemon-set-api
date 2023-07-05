import { Room } from '../entities/room';
import { PlayerDTO } from './playerDTO';

export class RoomDTO {
    id: string;
    size: number;
    players: Partial<PlayerDTO>[];
    readyToPick: boolean;

    constructor(room: Room) {
        this.id = room.id;
        this.size = room.size;
        this.players = Array.from(room.players.values()).map(player => {
            return {
                pseudo: player.pseudo,
                sit: player.sit
            };
        });
        this.readyToPick = room.readyToPick;
    }
}