import { GameParameters } from "./gameParameters";
import { Player } from "./player";
import { Session } from "./session";


export interface Room {
    id: string;
    owner: Session,
    size: number,
    players: Map<string, Player>;
    gameParameters?: GameParameters;
    readyToPick: boolean;
}
