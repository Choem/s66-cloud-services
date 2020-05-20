import { registerEnumType } from '@nestjs/graphql';

export enum EventStatusType {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

registerEnumType(EventStatusType, {
  name: 'EventStatusType',
});
