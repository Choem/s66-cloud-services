import { Connection, Repository } from 'typeorm';
import { EventEntity } from '../database/entities/event.entity';
import {
  StatisticEntity,
  STATISTIC_ID,
} from '../database/entities/statistic.entity';
import { PROCESS_EVENTS_QUEUE, PROCESS_EVENTS_JOB } from './constants';
import { EventStatusType } from '../database/enums/eventStatusType';
import { MutationType } from '../database/enums/mutationType';
import { Queue } from 'bullmq';
import { Topic } from './topic';
import { EventsStatusChangedPayload } from 'src/modules/event/payloads/eventsStatusChangedPayload';
import { getPubSub } from './getPubSub';
import { PubSubEngine } from 'graphql-subscriptions';

export async function initializeQueue(connection: Connection) {
  // Get pubSub
  const pubSub = getPubSub();

  // Get repositories
  const eventRepository = connection.getRepository(EventEntity);
  const statisticRepository = connection.getRepository(StatisticEntity);

  // Initialize new queue
  const queue = new Queue(PROCESS_EVENTS_QUEUE);

  // Add repeatable job to queue
  await queue.add(PROCESS_EVENTS_JOB, null, {
    repeat: { cron: process.env.CRON },
  });

  // Handle active jobs
  queue.on('active', async () => {
    const events = await eventRepository
      .createQueryBuilder('event')
      .limit(Number(process.env.BATCH_SIZE))
      .where('event.eventStatusType = :eventStatusType', {
        eventStatusType: EventStatusType.IDLE,
      })
      .getMany();

    if (events.length) {
      const eventIds = events.map(event => event.id);

      // Set event status type to working
      await setEventStatusType(eventIds, EventStatusType.WORKING, {
        repository: eventRepository,
        pubSub,
      });

      // Loop over events to adjust the total
      let total = 0;

      for (const event of events) {
        switch (event.mutationType) {
          case MutationType.ADDITION:
            total += 1;
            break;
          case MutationType.SUBTRACTION:
            total -= 1;
            break;
        }
      }

      // Try and find the corresponding statistic
      const foundStatistic = await statisticRepository.findOne({
        where: { id: STATISTIC_ID },
      });

      // Calculate new total
      const newTotal = foundStatistic.total + total;

      // Check if the statistic is found and the new total is a number
      if (foundStatistic && !isNaN(newTotal)) {
        try {
          // Save statistic and publish accordingly
          await statisticRepository
            .createQueryBuilder()
            .update(StatisticEntity)
            .set({
              total: newTotal,
            })
            .where('id = :id', { id: foundStatistic.id })
            .execute();

          await setEventStatusType(eventIds, EventStatusType.PROCESSED, {
            repository: eventRepository,
            pubSub,
          });

          await pubSub.publish(Topic.STATISTIC_UPDATED, {
            id: foundStatistic.id,
            total: newTotal,
          });
        } catch (e) {
          // Don't save the statistic and set events to failed status
          await setEventStatusType(eventIds, EventStatusType.FAILED, {
            repository: eventRepository,
            pubSub,
          });

          throw new Error(e);
        }
      }
    }
  });
}

async function setEventStatusType(
  eventIds: number[],
  eventStatusType: EventStatusType,
  settings: { repository: Repository<EventEntity>; pubSub: PubSubEngine },
) {
  await settings.repository
    .createQueryBuilder()
    .update(EventEntity)
    .set({ eventStatusType })
    .where('id IN (:...eventIds)', {
      eventIds,
    })
    .execute();

  await settings.pubSub.publish(Topic.EVENTS_STATUS_CHANGED, {
    changedEvents: eventIds.map(eventId => ({ id: eventId, eventStatusType })),
  } as EventsStatusChangedPayload);
}
