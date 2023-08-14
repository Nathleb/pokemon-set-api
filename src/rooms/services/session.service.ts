import { Injectable } from '@nestjs/common';
import { Session } from '../entities/session';
import { DEFAULT } from '../enums/default.enum';
import { SessionManager } from '../manager/session.manager';

@Injectable()
export class SessionService {

    constructor(private readonly sessionManager: SessionManager) { };

    public createSession(socketId: string): Session {
        return this.sessionManager.createSession(socketId);
    }

    public getSession(socketId: string): Session | undefined {
        return this.sessionManager.getSession(socketId);
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
}