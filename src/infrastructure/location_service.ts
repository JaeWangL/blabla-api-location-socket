import { ObjectId } from 'bson';
import { Injectable } from '@nestjs/common';
import { Locations as LocationEntity } from '@prisma/client';
import { LocationEntityRepository } from './location_entity_repository';

@Injectable()
export class LocationService {
  constructor(private readonly entityRepo: LocationEntityRepository) {}

  async findUniqueDeviceAsync(deviceType: 1 | 2, deviceId: string): Promise<LocationEntity | undefined> {
    return await this.entityRepo.findByDeviceTypeAndDeviceIdAsync(deviceType, deviceId);
  }

  async upsertAsync(deviceType: 1 | 2, deviceId: string, latitude: number, longitude: number): Promise<void> {
    const existing = this.entityRepo.findByDeviceTypeAndDeviceIdAsync(deviceType, deviceId);
    if (!existing) {
      await this.entityRepo.createAsync({
        id: new ObjectId().toString(),
        device_type: deviceType,
        device_id: deviceId,
        latitude,
        longitude,
      });
      return;
    }

    await this.entityRepo.updatePositionAsync({
      device_type: deviceType,
      device_id: deviceId,
      latitude,
      longitude,
    });
  }
}
