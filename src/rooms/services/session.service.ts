import { Injectable } from '@nestjs/common';
import { Session } from '../entities/session';
import { SessionManager } from '../manager/session.manager';

@Injectable()
export class SessionService {

    constructor(private readonly sessionManager: SessionManager) { };

    public createSession(): Session {
        return this.sessionManager.createSession();
    }

    public getSession(sessionId: string): Session | undefined {
        return this.sessionManager.getSession(sessionId);
    }

    public deleteSession(sessionId: string): void {
        this.sessionManager.deleteSession(sessionId);
    }
}