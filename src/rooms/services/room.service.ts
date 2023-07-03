import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room';
import { Session } from '../entities/session';
import { PlayerManager } from '../manager/player.manager';
import { RoomManager } from '../manager/room.manager';

@Injectable()
export class RoomService {

    constructor(private readonly roomanager: RoomManager, private readonly playermanager: PlayerManager) {

    }

    createRoom(ownerSession: Session, size: number, classification: "public" | "private"): Room {
        let room = this.roomanager.createRoom(ownerSession, size, classification);
        return this.joinRoom(ownerSession, room.id);
    }

    joinRoom(playerSession: Session, roomId: string): Room {
        let room = this.roomanager.getRoom(roomId);
        if (!room) {
            throw new Error;
        }

        const player = this.playermanager.createPlayer(playerSession);
        room.players.add(player);
        return this.roomanager.updateRoom(room);
    }

    quitRoom(playerSession: Session, roomId: string): Room {
        let room = this.roomanager.getRoom(roomId);
        if (!room) {
            throw new Error;
        }

        room.players = new Set([...room.players].filter(player => player.id !== playerSession.id));
        return this.roomanager.updateRoom(room);
    }

    deleteRoom(roomId: string): void {
        return this.roomanager.deleteRoom(roomId);
    }
}