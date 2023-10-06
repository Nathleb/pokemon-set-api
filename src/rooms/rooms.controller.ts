import { Controller, Get } from "@nestjs/common";
import { RoomDTO } from "./dtos/room.dto";
import { RoomService } from "./services/room.service";

@Controller('rooms')
export class RoomController {

    constructor(private readonly roomService: RoomService) { };

    @Get()
    async getAllPublicRooms(): Promise<RoomDTO[]> {
        return this.roomService.getAllRooms().filter(room => room.isPublic).map(room => new RoomDTO(room));
    }

}
