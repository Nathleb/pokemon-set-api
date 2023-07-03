import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Session } from "../entities/session";


@Injectable()
export class SessionManager {
    private sessions: Map<string, Session> = new Map<string, Session>();

    createSession(): Session {
        const sessionId = randomUUID();
        const session: Session = {
            id: sessionId,
        };

        this.sessions.set(sessionId, session);
        return session;
    }

    getSession(sessionId: string): Session | undefined {
        return this.sessions.get(sessionId);
    }

    deleteSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }

    updateSession(session: Session): void {
        this.sessions.set(session.id, session);
    }
}

export const sessionManager = new SessionManager();