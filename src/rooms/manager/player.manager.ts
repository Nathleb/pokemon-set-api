import { Injectable } from "@nestjs/common";
import { Player } from "../entities/player";
import { Session } from "../entities/session";


@Injectable()
export class PlayerManager {
    private players: Map<string, Player> = new Map<string, Player>();

    createPlayer(session: Session): Player {
        const player: Player = {
            id: session.id,
            pseudo: session.pseudo,
            team: new Array(),
            toChoseFrom: new Array()
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