import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { validate } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { RoomDTO } from 'src/rooms/dto/roomDTO';
import { GameParameters } from 'src/rooms/entities/gameParameters';
import { Player } from 'src/rooms/entities/player';
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
  /**
   * Create a new room owned by the client, the rooms parameters are passed as Json in the payload
   * TODO payload validation
   * @param client 
   * @param payload 
   * @returns the newly created room
   */
  @SubscribeMessage('createRoom')
  createRoom(client: Socket, payload: any): RoomDTO {
    const { size } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(this.roomService.createRoom(session, size));
  }


  /**
   * Let the client join an existing room, the roomId is provided in the payload
   * TODO payload validation
   * @param client 
   * @param payload 
   * @returns the updated Room
   */
  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: any): RoomDTO {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(this.roomService.joinRoom(session, roomId));
  }


  /**
   * Let the client leave an existing room, the roomId is provided in the payload
   * TODO payload validation
   * @param client 
   * @param payload 
   * @returns the updated Room
   */
  @SubscribeMessage('quitRoom')
  quitRoom(client: Socket, payload: any): RoomDTO {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(this.roomService.quitRoom(session, roomId));
  }

  /* @SubscribeMessage('deleteRoom')
   deleteRoom(client: Socket, payload: any): void {
     const { roomId } = JSON.parse(payload);

     return this.roomService.deleteRoom(roomId);
   } */

  // Game

  //TODO Validation payload
  @SubscribeMessage("startGame")
  async startGame(client: Socket, payload: any): Promise<RoomDTO> {
    const gameParameter: GameParameters = JSON.parse(payload);
    validate(gameParameter);

    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(await this.roomService.startGame(session, gameParameter));
  }

  @SubscribeMessage("getPlayer")
  getPlayer(client: Socket, payload: any): Player {
    const { roomId } = payload;
    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return this.roomService.getPlayer(session, roomId);
  }

  @SubscribeMessage("pickPokemon")
  pickPokemon(client: Socket, payload: any): RoomDTO {
    const { roomId, pkmnName } = payload;

    const session = this.sessionService.getSession(client.data.sessionId);
    if (!session) {
      throw new Error;
    }

    return new RoomDTO(this.roomService.pickPokemon(session, roomId, pkmnName));
  }
}
