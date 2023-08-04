import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room';
import { Session } from '../entities/session';
import { DEFAULT } from '../enums/default.enum';
import { RoomManager } from '../manager/room.manager';
import { SessionService } from './session.service';

@Injectable()
export class RoomService {

    constructor(private readonly roomanager: RoomManager, private readonly sessionService: SessionService) {

    }

    createRoom(ownerSession: Session, size: number): Room {
        let room = this.roomanager.createRoom(ownerSession, size);
        return this.joinRoom(ownerSession, room.id);
    }

    joinRoom(playerSession: Session, roomId: string): Room {
        let room = this.roomanager.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found.");
        }

        this.quitRoom(playerSession);
        playerSession = this.sessionService.resetPlayer(playerSession, room.id, room.players.size + 1);

        if (room.players.size < room.size) {
            room.players.set(playerSession.socketId, playerSession);
        }

        return this.roomanager.updateRoom(room);
    }

    quitRoom(playerSession: Session): string {
        const { inRoomId, socketId } = playerSession;
        if (inRoomId === DEFAULT.NO_ROOM) {
            return DEFAULT.NO_ROOM;
        }

        const room = this.roomanager.getRoom(inRoomId);
        if (!room) {
            throw new Error("Room not found.");
        }

        room.players.delete(socketId);
        if (room.players.size > 0) {
            this.roomanager.updateRoom(room);
        } else {
            this.roomanager.deleteRoom(room.id);
        }

        return room.players.size > 0 ? room.id : DEFAULT.NO_ROOM;
    }

    getAllRooms(): Room[] {
        return this.roomanager.getAllRoom();
    }
}