import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayerDTO } from 'src/rooms/dtos/player.dto';
import { RoomDTO } from 'src/rooms/dtos/room.dto';
import { Room } from 'src/rooms/entities/room';
import { GameService } from 'src/rooms/services/game.service';
import { RoomService } from 'src/rooms/services/room.service';
import { SessionService } from 'src/rooms/services/session.service';

@WebSocketGateway(
  {
    cors: true
  }
)
export class RoomGateway {

  constructor(private readonly gameService: GameService, private readonly roomService: RoomService, private readonly sessionService: SessionService) {
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
    this.quitRoom(client);
    this.sessionService.deleteSession(session.socketId);
    console.log('Client disconnected:', session.socketId);
  }

  /*<--------------------------------------ROOM-------------------------------------->*/
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
      client.emit("error", "Error while creating room");
      return;
    }

    try {
      const room: Room = this.roomService.createRoom(session, size);
      this.server.in(session.socketId).socketsJoin(room.id);
      this.server.in(session.socketId).emit('createRoom', room.id);
    }
    catch (error) {
      client.emit("error", `Error while creating room: ${error}`);
    }
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
      client.emit("error", "Error while joining room");
      return;
    }
    try {
      const room: Room = this.roomService.joinRoom(session, roomId);
      this.server.in(session.socketId).socketsJoin(room.id);
      this.server.in(room.id).emit("joinRoom", new RoomDTO(room));
    }
    catch (error) {
      client.emit("error", `Error while joining room: ${error}`);
    }
  }

  /**
    * Let the client quit the room he is into, the roomId is provided in the payload
    * TODO payload validation
    * @param client 
    * @param payload 
    * @returns the updated Room
    */
  @SubscribeMessage('quitRoom')
  quitRoom(client: Socket): void {
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      throw new Error;
    }
    const roomId = this.roomService.quitRoom(session);
    this.server.in(session.socketId).socketsLeave(roomId);
    this.server.in(roomId).emit("quitRoom", `${roomId} left`);
  }

  /*<--------------------------------------GAME-------------------------------------->*/

  @SubscribeMessage('startGame')
  async nextBooster(client: Socket, payload: any) {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      throw new Error;
    }

    try {
      const room = await this.gameService.nextBooster(session.socketId, roomId);
      if (room) {
        room.players.forEach(player => {
          this.server.in(player.socketId).emit("nextPick", new PlayerDTO(player));
        });
      }
    } catch (error) {
      client.emit("error", `Error while starting game: ${error}`);
      this.server.in(roomId).emit("error", `Error while starting game: ${error}`);
    }
  }

  @SubscribeMessage('nextPick')
  async nextPick(client: Socket, payload: any) {
    const { roomId, pickedPokemonName } = JSON.parse(payload);

    const session = this.sessionService.getSession(client.id);
    if (!session) {
      client.emit("error", `Error while processing the game`);
      return;
    }

    try {
      let room: Room | undefined = this.gameService.nextPick(session, roomId, pickedPokemonName);
      if (room) {
        if (this.gameService.isNextRotation(room)) {
          room = await this.gameService.nextRotation(room);
          room.players.forEach(player => {
            this.server.in(player.socketId).emit("nextPick", new PlayerDTO(player));
          });
        }
        else {
          client.emit("nextPick", new PlayerDTO(room.players.get(session.socketId)!));
        }
      }
    }
    catch (error) {
      client.emit("error", `Error while processing the game: ${error}`);
      this.server.in(roomId).emit("error", `Error while processing the game: ${error}`);
    }
  }
} 
