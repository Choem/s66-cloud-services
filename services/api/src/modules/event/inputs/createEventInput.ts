import { MutationType } from '../../../database/enums/mutationType';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(type => MutationType)
  mutationType: MutationType;
}
