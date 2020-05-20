import { registerEnumType } from '@nestjs/graphql';

export enum MutationType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
}

registerEnumType(MutationType, {
  name: 'MutationType',
});
