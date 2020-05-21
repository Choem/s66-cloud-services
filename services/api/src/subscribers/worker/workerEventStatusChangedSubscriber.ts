import { workerClient } from '../../lib/workerClient';
import { FetchResult } from 'apollo-link';
import { gql } from 'apollo-boost';
import { Topic } from '../../lib/topic';
import { getPubSub } from '../../lib/getPubSub';

export function initSubscription() {
  workerClient
    .subscribe({
      query: gql`
        subscription EventsStatusChanged {
          eventsStatusChanged {
            changedEvents {
              id
              eventStatusType
            }
          }
        }
      `,
    })
    .subscribe((value: FetchResult) => {
      if (!value.data) {
        return;
      }

      const pubSub = getPubSub();

      pubSub.publish(Topic.EVENTS_STATUS_CHANGED, value.data);
    }, console.error);
}
