import * as WorkerEventStatusChangedSubscriber from './worker/workerEventStatusChangedSubscriber';
import * as workerStatisticUpdatedSubscriber from './worker/workerStatisticUpdatedSubscriber';
import { PubSubEngine } from 'graphql-subscriptions';

export function intializeSubscribers(pubSub: PubSubEngine) {
  // Worker service
  WorkerEventStatusChangedSubscriber.initSubscription(pubSub);
  workerStatisticUpdatedSubscriber.initSubscription(pubSub);
}
