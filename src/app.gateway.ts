import { Socket, Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { UpdateLocationRequest } from './dtos/location_dtos';
import { LocationService } from './infrastructure/location_service';

@WebSocketGateway(81, {
  transports: ['websocket'],
  namespace: 'ws-location',
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private locationSvc: LocationService) {}

  afterInit(server: Server): void {
    console.log('Init');
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client Disconnected : ${client.id}`);
    client.disconnect();
  }

  handleConnection(client: Socket, ...args: any[]): void {
    console.log(`Client Connected : ${client.id}`);
  }

  @SubscribeMessage('updatedLocation')
  async handleUpdateLocationAsync(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateLocationRequest,
  ): Promise<void> {
    await this.locationSvc.upsertAsync(data.deviceType, data.deviceId, data.latitude, data.longitude);
  }
}
