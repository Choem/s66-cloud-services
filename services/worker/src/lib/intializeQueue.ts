import { Queue, Job, QueueScheduler, Worker } from 'bullmq';
import { PubSubEngine } from 'graphql-subscriptions';
import { EventsStatusChangedPayload } from 'src/modules/event/payloads/eventsStatusChangedPayload';
import { Connection, Repository } from 'typeorm';

import { EventEntity } from '../database/entities/event.entity';
import {
  STATISTIC_ID,
  StatisticEntity,
} from '../database/entities/statistic.entity';
import { EventStatusType } from '../database/enums/eventStatusType';
import { MutationType } from '../database/enums/mutationType';

import { PROCESS_EVENTS_JOB, PROCESS_EVENTS_QUEUE } from './constants';
import { getPubSub } from './getPubSub';
import { getRedisOptions } from './getRedisOptions';
import { Topic } from './topic';
import { v4 as uuidv4 } from 'uuid';

export async function initializeQueue(connection: Connection) {
  // Generate service specific uuid
  const uuid = uuidv4();

  // Get pubSub
  const pubSub = getPubSub();

  // Get repositories
  const eventRepository = connection.getRepository(EventEntity);
  const statisticRepository = connection.getRepository(StatisticEntity);

  // Initialize new queue
  const queueName = `${PROCESS_EVENTS_QUEUE}-${uuid}`;
  const options = {
    connection: getRedisOptions(),
  };
  const queueScheduler = new QueueScheduler(queueName, options);
  const queue = new Queue(queueName, options);
  const worker = new Worker(
    queueName,
    async (job: Job) =>
      processJob(job, {
        eventRepository,
        statisticRepository,
        pubSub,
      }),
    options,
  );

  await queueScheduler.waitUntilReady();
  await queue.waitUntilReady();
  await worker.waitUntilReady();

  // Add repeatable job to queue
  queue.add(`${PROCESS_EVENTS_JOB}-${uuid}`, null, {
    repeat: { cron: process.env.CRON },
  });
}

async function processJob(
  job: Job,
  settings: {
    eventRepository: Repository<EventEntity>;
    statisticRepository: Repository<StatisticEntity>;
    pubSub: PubSubEngine;
  },
) {
  console.info(`[${new Date()}] Started a job with id: ${job.id}`);

  const { eventRepository, statisticRepository, pubSub } = settings;

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

    if (!foundStatistic) {
      await setEventStatusType(eventIds, EventStatusType.FAILED, {
        repository: eventRepository,
        pubSub,
      });

      throw new Error('Statistic not found');
    }

    // Calculate new total
    const newTotal = foundStatistic.total + total;

    if (isNaN(newTotal)) {
      await setEventStatusType(eventIds, EventStatusType.FAILED, {
        repository: eventRepository,
        pubSub,
      });

      throw new Error('New total is NaN');
    }

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
