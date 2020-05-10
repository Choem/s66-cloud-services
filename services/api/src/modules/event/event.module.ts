import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../database/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
})
export class EventModule {}
