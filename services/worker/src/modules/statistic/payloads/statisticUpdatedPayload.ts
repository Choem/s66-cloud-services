import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class StatisticUpdatedPayload {
  @Field(type => Int)
  id: number;

  @Field(type => Int)
  total: number;
}
