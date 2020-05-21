import { workerClient } from '../../lib/workerClient';
import { FetchResult } from 'apollo-link';
import { gql } from 'apollo-boost';
import { PubSubEngine } from 'graphql-subscriptions';
import { Topic } from '../../lib/topic';

export function initSubscription(pubSub: PubSubEngine) {
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

      pubSub.publish(Topic.EVENTS_STATUS_CHANGED, value.data);
    }, console.error);
}
