import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GameParameters } from "../entities/gameParameters";
import { Room } from "../entities/room";
import { Session } from "../entities/session";

@Injectable()
export class RoomManager {
    private rooms: Map<string, Room> = new Map<string, Room>();

    createRoom(owner: Session, gameParameters: GameParameters): Room {
        const roomId = `${randomUUID()}`;

        const Room: Room = {
            id: roomId,
            ownerId: owner.deviceIdentifier,
            name: gameParameters.roomName,
            size: gameParameters.size,
            players: new Map<string, Session>(),
            boostersLeft: gameParameters.nbrBooster,
            nbrBooster: gameParameters.nbrBooster,
            pkmnPerBooster: gameParameters.pkmnPerBooster,
            remainingPool: new Array(),
            hasStarted: false,
            isPublic: gameParameters.isPublic
        };

        this.rooms.set(roomId, Room);
        return Room;
    }

    getRoom(roomId: string): Room | undefined {
        return this.rooms.get(roomId);
    }

    getAllRoom(): Room[] {
        return Array.from(this.rooms.values());
    }

    deleteRoom(roomId: string): undefined {
        this.rooms.delete(roomId);
        return undefined;
    }

    updateRoom(room: Room): Room {
        this.rooms.set(room.id, room);
        return room;
    }
}

export const roomManager = new RoomManager();