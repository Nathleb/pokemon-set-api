import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomDTO } from 'src/rooms/dtos/room.dto';
import { Room } from 'src/rooms/entities/room';
import { RoomService } from 'src/rooms/services/room.service';
import { SessionService } from 'src/rooms/services/session.service';

@WebSocketGateway(
  {
    cors: true
  }
)
export class RoomGateway {

  constructor(private readonly roomService: RoomService, private readonly sessionService: SessionService) {
  }

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    const session = this.sessionService.createSession(client.id);
    console.log('Client connected:', session.socketId);
  }

  handleDisconnect(client: Socket) {
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      throw new Error;
    }
    this.roomService.quitRoom(session);
    this.sessionService.deleteSession(session.socketId);
    console.log('Client disconnected:', session.socketId);
  }

  //Room
  /**
   * Create a new room owned by the client, the rooms parameters are passed as Json in the payload
   * TODO payload validation
   * @param client 
   * @param payload 
   * @returns the newly created room
   */
  @SubscribeMessage('createRoom')
  createRoom(client: Socket, payload: string): void {
    const { size } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      throw new Error;
    }

    const room: Room = this.roomService.createRoom(session, size);
    this.server.in(session.socketId).socketsJoin(room.id);
    this.server.emit('createRoom', new RoomDTO(room));
  }

  /**
     * Let the client join an existing room, the roomId is provided in the payload
     * TODO payload validation
     * @param client 
     * @param payload 
     * @returns the updated Room
     */
  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: any): void {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      throw new Error;
    }
    const room: Room = this.roomService.joinRoom(session, roomId);
    this.server.in(session.socketId).socketsJoin(room.id);
    this.server.in(room.id).emit("joinRoom", new RoomDTO(room));
  }

}
