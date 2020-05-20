import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

export const STATISTIC_ID = 1;

@Entity('statistic')
@ObjectType()
export class StatisticEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ default: 0 })
  @Field(type => Int)
  total: number;
}
