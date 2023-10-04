import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayerDTO } from 'src/rooms/dtos/player.dto';
import { RoomDTO } from 'src/rooms/dtos/room.dto';
import { GameParameters } from 'src/rooms/entities/gameParameters';
import { Room } from 'src/rooms/entities/room';
import { Session } from 'src/rooms/entities/session';
import { DEFAULT } from 'src/rooms/enums/default.enum';
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
    setInterval(() => {
      this.sessionService.cleanOldSessions();
    }, 3600000);
  }

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    this.getSessionInfos(client);
  }

  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('getSessionInfos')
  getSessionInfos(client: Socket): void {
    const deviceIdentifier = client.handshake.query.deviceIdentifier;
    if (typeof deviceIdentifier === 'string') {
      const session: Session = this.sessionService.reconnectSessionByDeviceIdentifier(client.id, deviceIdentifier) || this.sessionService.createSession(client.id, deviceIdentifier);

      client.emit("getSessionInfos", { pseudo: session.pseudo, inRoomId: session.inRoomId });
    }
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
    const gameParameters: GameParameters = JSON.parse(payload);
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      client.emit("error", "Error while creating room");
      return;
    }

    try {
      const room: Room = this.roomService.createRoom(session, gameParameters);
      this.server.in(session.socketId).socketsJoin(room.id);
      this.server.in(session.socketId).emit('createRoom', room.id);
    }
    catch (error) {
      client.emit("error", `Error while creating room: ${error}`);
    }
  };

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
      if (room.hasStarted) {
        this.server.in(session.socketId).emit("nextPick", new PlayerDTO(session));
      }
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
      throw new Error("session not found");
    }
    const room = this.roomService.quitRoom(session);
    if (room) {
      this.server.in(session.socketId).socketsLeave(room.id);
      const newOwner = this.sessionService.getSessionByDeviceIdentifier(room.ownerId);
      if (newOwner) {
        this.server.in(newOwner.socketId).emit('isPlayerOwner', true);
      }
      this.server.in(room.id).emit("joinRoom", new RoomDTO(room));
    }
  };

  @SubscribeMessage('updatePseudo')
  updatePseudo(client: Socket, payload: any): void {
    const session = this.sessionService.getSession(client.id);
    const { pseudo } = JSON.parse(payload);
    if (!session) {
      throw new Error("session not found");
    }
    session.pseudo = pseudo;
    this.sessionService.updateSession(session);
    const room = this.roomService.getRoom(session.inRoomId);
    if (room) {
      this.server.in(session.inRoomId).emit("joinRoom", new RoomDTO(room));
    }
    client.emit("getSessionInfos", { pseudo: session.pseudo, inRoomId: session.inRoomId });
  };

  /*<--------------------------------------GAME-------------------------------------->*/

  @SubscribeMessage('startGame')
  async nextBooster(client: Socket, payload: any) {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      throw new Error("session not found");
    }

    try {
      const room = await this.gameService.nextBooster(session.deviceIdentifier, roomId);
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
          client.emit("nextPick", new PlayerDTO(room.players.get(session.deviceIdentifier)!));
        }
        this.server.in(roomId).emit('updateHasPickedStatus', { players: new RoomDTO(room).players, boostersLeft: room.boostersLeft });
      }
    }
    catch (error) {
      client.emit("error", `Error while processing the game: ${error}`);
      this.server.in(roomId).emit("error", `Error while processing the game: ${error}`);
    }
  }


  @SubscribeMessage('isPlayerOwner')
  isPlayerOwner(client: Socket, payload: any) {
    const { roomId } = JSON.parse(payload);
    const session = this.sessionService.getSession(client.id);
    if (!session) {
      client.emit("error", `Error while processing the game`);
      return false;
    }
    client.emit('isPlayerOwner', this.roomService.isPlayerOwner(roomId, session));
  };
} 
