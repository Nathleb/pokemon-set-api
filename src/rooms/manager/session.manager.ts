import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Session } from "../entities/session";


@Injectable()
export class SessionManager {
    private sessions: Map<string, Session> = new Map<string, Session>();

    createSession(socketId: string): Session {
        const session: Session = {
            socketId: socketId,
            pseudo: `Player-${randomUUID().substring(0, 6)}`,
            team: new Array(),
            toChoseFrom: new Array(),
            hasPicked: false,
            inRoomId: "Has not joined a room yet",
            sit: -1,
        };

        this.sessions.set(socketId, session);
        return session;
    }

    getSession(socketId: string): Session | undefined {
        return this.sessions.get(socketId);
    }

    deleteSession(socketId: string): void {
        this.sessions.delete(socketId);
    };

    updateSession(session: Session): Session {
        this.sessions.set(session.socketId, session);
        return session;
    }
}

export const sessionManager = new SessionManager();