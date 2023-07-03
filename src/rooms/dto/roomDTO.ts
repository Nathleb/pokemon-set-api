import { Room } from '../entities/room';
import { Player } from '../entities/player';

export class RoomDTO {
    id: string;
    ownerId: string;
    size: number;
    classification: "private" | "public";
    players: Player[];

    constructor(room: Room) {
        this.id = room.id;
        this.ownerId = room.owner.id;
        this.size = room.size;
        this.classification = room.classification;
        this.players = Array.from(room.players);
    }
}