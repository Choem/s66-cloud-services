import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MutationType } from '../enums/mutationType';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { EventStatusType } from '../enums/eventStatusType';

@Entity('event')
@ObjectType()
export class EventEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: 'mutation_type',
    type: 'simple-enum',
    enum: MutationType,
  })
  @Field(type => MutationType)
  mutationType: MutationType;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field()
  createdAt: Date;

  @Column({
    name: 'event_status_type',
    type: 'simple-enum',
    enum: EventStatusType,
  })
  @Field(type => EventStatusType)
  eventStatusType: EventStatusType;
}
