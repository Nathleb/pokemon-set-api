import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Player } from "../entities/player";
import { Session } from "../entities/session";


@Injectable()
export class PlayerManager {
    private players: Map<string, Player> = new Map<string, Player>();

    createPlayer(session: Session, sit: number): Player {
        const player: Player = {
            id: session.id,
            pseudo: `Player-${randomUUID().substring(0, 6)}`,
            team: new Array(),
            toChoseFrom: new Array(),
            sit: sit,
            hasPicked: false
        };

        this.players.set(player.id, player);
        return player;
    }

    getPlayer(playerId: string): Player | undefined {
        return this.players.get(playerId);
    }

    deletePlayer(playerId: string): void {
        this.players.delete(playerId);
    }

    updatePlayer(player: Player): void {
        this.players.set(player.id, player);
    }
}

export const playerManager = new PlayerManager();