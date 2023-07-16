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
            throw new Error;
        }

        this.quitRoom(playerSession);
        playerSession = this.sessionService.resetPlayer(playerSession, room.id, room.players.size + 1);

        if (room.players.size < room.size) {
            room.players.set(playerSession.socketId, playerSession);
        }

        return this.roomanager.updateRoom(room);
    }

    quitRoom(playerSession: Session): void {
        if (playerSession.inRoomId !== DEFAULT.NO_ROOM) {
            let room = this.roomanager.getRoom(playerSession.inRoomId);
            if (room) {
                room.players.delete(playerSession.socketId);
            }
        }
    }

    getAllRooms(): Room[] {
        return this.roomanager.getAllRoom();
    }
}