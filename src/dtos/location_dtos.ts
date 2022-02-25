export class UpdateLocationRequest {
  readonly deviceType: 1 | 2;

  readonly deviceId: string;

  readonly latitude: number;

  readonly longitude: number;
}
