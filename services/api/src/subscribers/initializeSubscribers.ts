import * as WorkerEventStatusChangedSubscriber from './worker/workerEventStatusChangedSubscriber';
import * as workerStatisticUpdatedSubscriber from './worker/workerStatisticUpdatedSubscriber';

export function intializeSubscribers() {
  // Worker service
  WorkerEventStatusChangedSubscriber.initSubscription();
  workerStatisticUpdatedSubscriber.initSubscription();
}
