import { Player } from "./player";
import { Session } from "./session";


export interface Room {
    id: string;
    owner: Session,
    size: number,
    classification: "private" | "public";
    players: Set<Player>;
}
