import { GameParameters } from "./gameParameters";
import { Session } from "./session";


export interface Room {
    id: string;
    owner: Session,
    size: number,
    players: Map<string, Session>;
    gameParameters?: GameParameters;
    readyToPick: boolean;
}
