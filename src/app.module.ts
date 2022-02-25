import { PrismaModule } from 'nestjs-prisma';
import { Module } from '@nestjs/common';
import { LocationGateway } from './gateways/location_gateway';
import { LocationEntityRepository } from './infrastructure/location_entity_repository';
import { LocationService } from './infrastructure/location_service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const entityRepositories = [LocationEntityRepository];
const services = [LocationService];

@Module({
  imports: [PrismaModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ...entityRepositories, ...services, LocationGateway],
})
export class AppModule {}
