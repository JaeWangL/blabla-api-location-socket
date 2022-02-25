import { PrismaModule } from 'nestjs-prisma';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule.forRoot()],
  controllers: [],
})
export class AppModule {}
