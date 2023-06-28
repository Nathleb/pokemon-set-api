import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Room } from "../entities/room";

@Injectable()
export class RoomManager {
    private rooms: Map<string, Room> = new Map<string, Room>();

    createRoom(owner: string, size: number = 6, classification: string = "public"): Room {
        const roomId = `room::${randomUUID()}`;

        const Room: Room = {
            id: roomId,
            owner: owner,
            size: size,
            classification: classification,
            players: new Array()
        };

        this.rooms.set(roomId, Room);
        return Room;
    }

    getRoom(roomId: string): Room | undefined {
        return this.rooms.get(roomId);
    }

    deleteRoom(roomId: string): void {
        this.rooms.delete(roomId);
    }

    updateRoom(room: Room): void {
        this.rooms.set(room.id, room);
    }
}

export const roomManager = new RoomManager();