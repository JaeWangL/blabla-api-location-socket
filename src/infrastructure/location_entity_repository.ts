import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Locations as LocationEntity, Prisma } from '@prisma/client';

@Injectable()
export class LocationEntityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAsync(input: Prisma.LocationsCreateInput): Promise<LocationEntity | undefined> {
    return await this.prisma.locations.create({
      data: input,
    });
  }

  async findByIdAsync(id: string): Promise<LocationEntity | undefined> {
    return await this.prisma.locations.findUnique({
      where: {
        id,
      },
    });
  }

  async findByDeviceTypeAndDeviceIdAsync(deviceType: 1 | 2, deviceId: string): Promise<LocationEntity | undefined> {
    return await this.prisma.locations.findFirst({
      where: {
        device_type: deviceType,
        device_id: deviceId,
      },
    });
  }

  async updatePositionAsync(input: Prisma.LocationsUpdateInput): Promise<void> {
    await this.prisma.locations.updateMany({
      where: {
        device_type: input.device_type as number,
        device_id: input.device_id as string,
      },
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
      },
    });
  }
}
