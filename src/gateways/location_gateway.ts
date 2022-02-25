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
import { LocationSocketTypes } from '../configs/socket_keys';
import { UpdateLocationRequest } from '../dtos/location_dtos';
import { LocationService } from '../infrastructure/location_service';

@WebSocketGateway({
  transports: ['websocket', 'polling', 'flashsocket'],
  path: '/ws-location/',
})
export class LocationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  updatedLocations: UpdateLocationRequest[] = [];

  constructor(private locationSvc: LocationService) {
    // Store and publish event 'updated locations' every 5s
    setInterval(() => {
      this.updatedLocations.forEach(async (updatedLocation) => {
        await this.locationSvc.upsertAsync(
          updatedLocation.deviceType,
          updatedLocation.deviceId,
          updatedLocation.latitude,
          updatedLocation.longitude,
        );
      });

      // Reset 'updateLocations'
      this.updatedLocations.splice(0, this.updatedLocations.length);
    }, 5000);
  }

  afterInit(server: Server): void {
    // console.log('Init');
  }

  handleDisconnect(client: Socket): void {
    // console.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    // console.log(`Client Connected : ${client.id}`);
  }

  @SubscribeMessage(LocationSocketTypes.UPDATE_LOCATION)
  async handleUpdateLocationAsync(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateLocationRequest,
  ): Promise<void> {
    this.updatedLocations.push(data);
  }
}
