import { workerClient } from '../../lib/workerClient';
import { FetchResult } from 'apollo-link';
import { gql } from 'apollo-boost';
import { Topic } from '../../lib/topic';
import { getPubSub } from '../../lib/getPubSub';

export function initSubscription() {
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
    .subscribe(async (value: FetchResult) => {
      console.log(value);
      if (!value.data) {
        return;
      }

      const pubSub = getPubSub();

      await pubSub.publish(Topic.STATISTIC_UPDATED, value.data);
    }, console.error);
}
