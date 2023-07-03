import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Player } from "../entities/player";
import { Room } from "../entities/room";
import { Session } from "../entities/session";

@Injectable()
export class RoomManager {
    private rooms: Map<string, Room> = new Map<string, Room>();

    createRoom(owner: Session, size: number, classification: "public" | "private"): Room {
        const roomId = `room::${randomUUID()}`;

        const Room: Room = {
            id: roomId,
            owner: owner,
            size: size,
            classification: classification,
            players: new Set<Player>()
        };

        this.rooms.set(roomId, Room);
        console.log(this.rooms);
        return Room;
    }

    getRoom(roomId: string): Room | undefined {
        console.log(this.rooms);
        return this.rooms.get(roomId);
    }

    deleteRoom(roomId: string): void {
        this.rooms.delete(roomId);
        console.log(this.rooms);
    }

    updateRoom(room: Room): Room {
        this.rooms.set(room.id, room);
        console.log(this.rooms);
        return room;
    }
}

export const roomManager = new RoomManager();