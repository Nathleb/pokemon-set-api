import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Room } from "../entities/room";
import { Session } from "../entities/session";

@Injectable()
export class RoomManager {
    private rooms: Map<string, Room> = new Map<string, Room>();

    createRoom(owner: Session, size: number): Room {
        const roomId = `room::${randomUUID()}`;

        const Room: Room = {
            id: roomId,
            owner: owner,
            size: size,
            players: new Map<string, Session>(),
            readyToPick: true
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

    deleteRoom(roomId: string): void {
        this.rooms.delete(roomId);
    }

    updateRoom(room: Room): Room {
        this.rooms.set(room.id, room);
        return room;
    }
}

export const roomManager = new RoomManager();