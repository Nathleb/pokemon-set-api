import { Module } from "@nestjs/common";
import { PlayerManager } from "./manager/player.manager";
import { RoomManager } from "./manager/room.manager";
import { SessionManager } from "./manager/session.manager";
import { RoomService } from "./services/room.service";
import { SessionService } from "./services/session.service";

@Module({
    imports: [],
    controllers: [],
    providers: [SessionService, RoomService, SessionManager, RoomManager, PlayerManager],
    exports: [SessionService, RoomService]
})
export class RoomModule { }