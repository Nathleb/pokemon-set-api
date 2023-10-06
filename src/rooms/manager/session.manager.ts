import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Session } from "../entities/session";
import { DEFAULT } from "../enums/default.enum";
import { Trainers } from "./Trainers";


@Injectable()
export class SessionManager {
    private sessions: Map<string, Session> = new Map<string, Session>();

    createSession(socketId: string, deviceIdentifier: string): Session {
        const session: Session = {
            socketId: socketId,
            pseudo: `${Trainers[Math.floor(Math.random() * Trainers.length)]}${randomUUID().substring(0, 2)}`,
            team: new Array(),
            toChoseFrom: new Array(),
            hasPicked: false,
            inRoomId: DEFAULT.NO_ROOM,
            sit: -1,
            deviceIdentifier: deviceIdentifier,
            lastUpdated: new Date()
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
        session.lastUpdated = new Date();
        this.sessions.set(session.socketId, session);
        return session;
    }

    getAllSessions(): Session[] {
        return Array.from(this.sessions.values());
    }
}

export const sessionManager = new SessionManager();