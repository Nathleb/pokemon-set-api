import { Room } from '../entities/room';
import { PlayerDTO } from './player.dto';

export class RoomDTO {
    id: string;
    size: number;
    players: Partial<PlayerDTO>[];
    name: string;

    constructor(room: Room) {
        this.id = room.id;
        this.size = room.size;
        this.players = Array.from(room.players.values()).map(player => {
            return {
                pseudo: player.pseudo,
                sit: player.sit
            };
        });
        this.name = room.name;
    }
}