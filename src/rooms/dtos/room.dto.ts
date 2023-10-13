import { Room } from '../entities/room';
import { PlayerDTO } from './player.dto';

export class RoomDTO {
    id: string;
    size: number;
    players: Partial<PlayerDTO>[];
    name: string;
    hasStarted: boolean;
    nbrBooster: number;
    pkmnPerBooster: number;
    boostersLeft: number;
    isPublic: boolean;

    constructor(room: Room) {
        this.id = room.id;
        this.size = room.size;
        this.players = Array.from(room.players.values()).map(player => {
            return {
                pseudo: player.pseudo,
                sit: player.sit,
                hasPicked: player.hasPicked,
                isConnected: player.isConnected
            };
        });
        this.name = room.name;
        this.hasStarted = room.hasStarted;
        this.nbrBooster = room.nbrBooster;
        this.pkmnPerBooster = room.pkmnPerBooster;
        this.boostersLeft = room.boostersLeft;
        this.isPublic = room.isPublic;
    }
}