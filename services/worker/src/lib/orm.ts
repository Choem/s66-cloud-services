import { Connection, createConnection, ConnectionOptions } from "typeorm";
import { EventEntity } from "../database/entities/event.entity";
import { StatisticEntity } from "../database/entities/statistic.entity";

let connection: Connection;

export async function connect() {
  if (connection) {
    return;
  }

  const options: ConnectionOptions = {
    host: process.env.DB_HOST,
    type: process.env.DB_DRIVER,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    retryAttempts: 3,
    synchronize: false,
    entities: [EventEntity, StatisticEntity],
  } as ConnectionOptions;

  connection = await createConnection(options);
}

export function getOrmConnection() {
  return connection;
}
