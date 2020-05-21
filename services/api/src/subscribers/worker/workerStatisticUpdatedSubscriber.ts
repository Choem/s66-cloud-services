import { workerClient } from '../../lib/workerClient';
import { FetchResult } from 'apollo-link';
import { gql } from 'apollo-boost';
import { PubSubEngine } from 'graphql-subscriptions';
import { Topic } from '../../lib/topic';

export function initSubscription(pubSub: PubSubEngine) {
  workerClient
    .subscribe({
      query: gql`
        subscription StatisticUpdated {
          statisticUpdated {
            id
            total
          }
        }
      `,
    })
    .subscribe((value: FetchResult) => {
      if (!value.data) {
        return;
      }

      pubSub.publish(Topic.STATISTIC_UPDATED, value.data);
    }, console.error);
}
