import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomDTO } from 'src/rooms/dto/roomDTO';
import { Room } from 'src/rooms/entities/room';
import { RoomService } from 'src/rooms/services/room.service';
import { SessionService } from 'src/rooms/services/session.service';

@WebSocketGateway()
export class RoomGateway {

  constructor(private readonly roomService: RoomService, private readonly sessionService: SessionService) {
  }

  @WebSocketServer()
  private server: Server;

  //Room
  @SubscribeMessage('createRoom')
  createRoom(client: Socket, payload: any): RoomDTO {
    const { size, classification } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(this.roomService.createRoom(session, size, classification));
  }


  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: any): RoomDTO {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(this.roomService.joinRoom(session, roomId));
  }


  @SubscribeMessage('quitRoom')
  quitRoom(client: Socket, payload: any): RoomDTO {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(this.roomService.quitRoom(session, roomId));
  }
  // @SubscribeMessage('deleteRoom')
  // deleteRoom(client: Socket, payload: any): void {
  //   const { roomId } = JSON.parse(payload);

  //   return this.roomService.deleteRoom(roomId);
  // }
}
