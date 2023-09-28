import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room';
import { Session } from '../entities/session';
import { DEFAULT } from '../enums/default.enum';
import { RoomManager } from '../manager/room.manager';
import { SessionManager } from '../manager/session.manager';
import { RoomService } from './room.service';

@Injectable()
export class SessionService {

    constructor(private readonly sessionManager: SessionManager, private readonly roomanager: RoomManager) { };

    public createSession(socketId: string, deviceIdentifier: string): Session {
        return this.sessionManager.createSession(socketId, deviceIdentifier);
    }

    public getSession(socketId: string): Session | undefined {
        return this.sessionManager.getSession(socketId);
    }

    public getSessionByDeviceIdentifier(deviceIdentifier: string): Session | undefined {
        return this.sessionManager.getAllSessions().find(session => session.deviceIdentifier === deviceIdentifier);
    }

    public deleteSession(socketId: string): void {
        this.sessionManager.deleteSession(socketId);
    }

    public updateSession(playerSession: Session): Session {
        return this.sessionManager.updateSession(playerSession);
    }

    public resetPlayer(playerSession: Session, roomId: string, sit: number): Session {
        playerSession.hasPicked = false;
        playerSession.inRoomId = roomId;
        playerSession.sit = sit;
        playerSession.team = new Array();
        playerSession.toChoseFrom = new Array();
        return this.sessionManager.updateSession(playerSession);
    }

    public reconnectSessionByDeviceIdentifier(socketId: string, deviceIdentifier: string): Session | undefined {
        const sessions: Session[] = this.sessionManager.getAllSessions();
        const index = sessions.findIndex(session => session.deviceIdentifier === deviceIdentifier);
        if (index != -1) {
            let session = sessions[index];
            if (session.inRoomId !== DEFAULT.NO_ROOM) {
                const currentRoom = this.roomanager.getRoom(session.inRoomId);
                if (currentRoom === undefined) {
                    session.inRoomId = DEFAULT.NO_ROOM;
                }
                else {
                    currentRoom.players.delete(session.socketId);
                }
            }
            this.sessionManager.deleteSession(session.socketId);
            session.socketId = socketId;
            return this.sessionManager.updateSession(session);
        }
    }
}