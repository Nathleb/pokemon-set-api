import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from 'src/rooms/services/session.service';

@WebSocketGateway()
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly sessionService: SessionService) { };

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    const session = this.sessionService.createSession();
    client.data.sessionId = session.id;
    console.log('Client connected:', session.id);
  }

  handleDisconnect(client: Socket) {
    const sessionId = client.data.sessionId;
    this.sessionService.deleteSession(sessionId);
    console.log('Client disconnected:', sessionId);
  }

  @SubscribeMessage('pseudo')
  handleMessage(client: Socket, data: string) {
    const sessionId = client.data.sessionId;
    this.sessionService.updatePseudo(sessionId, data);
  }
} 	