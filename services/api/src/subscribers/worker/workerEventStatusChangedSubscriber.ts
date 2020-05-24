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
          ${Topic.EVENTS_STATUS_CHANGED} {
            changedEvents {
              id
              eventStatusType
            }
          }
        }
      `,
    })
    .subscribe(async (value: FetchResult) => {
      if (!value.data) {
        return;
      }

      const pubSub = getPubSub();

      await pubSub.publish(
        Topic.EVENTS_STATUS_CHANGED,
        value.data[Topic.EVENTS_STATUS_CHANGED],
      );
    }, console.error);
}
