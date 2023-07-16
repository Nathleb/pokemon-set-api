import { Module } from "@nestjs/common";
import { PokemonModule } from "src/pokemon/pokemon.module";
import { RoomManager } from "./manager/room.manager";
import { SessionManager } from "./manager/session.manager";
import { RoomService } from "./services/room.service";
import { SessionService } from "./services/session.service";

@Module({
    imports: [PokemonModule],
    controllers: [],
    providers: [SessionService, RoomService, SessionManager, RoomManager],
    exports: [SessionService, RoomService]
})
export class RoomModule { }