import { connect, getOrmConnection } from "./lib/orm";
import {
  StatisticEntity,
  STATISTIC_ID,
} from "./database/entities/statistic.entity";
import { Queue } from "bullmq";
import { PROCESS_EVENTS_QUEUE, PROCESS_EVENTS_JOB } from "./lib/constants";
import { EventEntity } from "./database/entities/event.entity";
import { EventStatusType } from "./database/enums/eventStatusType";
import { MutationType } from "./database/enums/mutationType";

// Initialize queue
const queue = new Queue(PROCESS_EVENTS_QUEUE);

// Process event handlers
process.on("unhandledRejection", (err) => {
  throw err;
});
process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());
process.on("SIGQUIT", () => shutdown());

async function bootstrap() {
  // Connect to database
  await connect();

  console.log(await getOrmConnection().getRepository(StatisticEntity).find());

  // Get repositories
  const eventRepository = getOrmConnection().getRepository(EventEntity);
  const statisticRepository = getOrmConnection().getRepository(StatisticEntity);

  // Add repeatable job to queue
  await queue.add(PROCESS_EVENTS_JOB, null, {
    repeat: { cron: process.env.CRON },
  });
  queue.on("active", async () => {
    const events = await eventRepository
      .createQueryBuilder("event")
      .limit(Number(process.env.BATCH_SIZE))
      .where("event.eventStatusType = :eventStatusType", {
        eventStatusType: EventStatusType.IDLE,
      })
      .getMany();

    if (events.length) {
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

        // GraphQL client publish [Event status changed]
      }

      const foundStatistic = await statisticRepository.findOne({
        where: { id: STATISTIC_ID },
      });

      if (foundStatistic) {
        await statisticRepository
          .createQueryBuilder()
          .update(StatisticEntity)
          .set({
            total: foundStatistic.total + total,
          })
          .where("id = :id", { id: foundStatistic.id })
          .execute();

        // GraphQL client publish [Statistic updated]
      }
    }
  });
}

async function shutdown() {
  // Shutdown code
  console.info("Shutting down queue");
  await queue.close();
}

bootstrap();
