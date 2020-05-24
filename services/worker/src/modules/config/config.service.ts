import { Injectable } from '@nestjs/common';
import { GqlModuleOptions } from '@nestjs/graphql';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { EventEntity } from '../../database/entities/event.entity';
import { StatisticEntity } from '../../database/entities/statistic.entity';
import { getPubSub } from '../../lib/getPubSub';

import { EnvConfig } from './envConfig';

@Injectable()
export class ConfigService {
  public readonly env: EnvConfig;

  constructor() {
    this.env = this.validateInput(process.env);
  }

  public get TypeORMConfig(): TypeOrmModuleOptions {
    const typeOrmConfig: any = {
      type: this.env.DB_DRIVER,
      host: this.env.DB_HOST,
      port: this.env.DB_PORT,
      username: this.env.DB_USERNAME,
      password: this.env.DB_PASSWORD,
      database: this.env.DB_NAME,
      retryAttempts: 3,
      entities: [EventEntity, StatisticEntity],
    };

    return typeOrmConfig as TypeOrmModuleOptions;
  }

  public get GraphQLConfig(): GqlModuleOptions {
    return {
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      playground: {
        endpoint: '/worker/graphql',
        subscriptionEndpoint: '/worker/graphql/subscriptions',
      },
      subscriptions: {
        path: '/graphql/subscriptions',
        keepAlive: 10000,
      },
    } as GqlModuleOptions;
  }

  private validateInput(envConfig: any): EnvConfig {
    const envConfigSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production'])
        .default('development'),
      DB_DRIVER: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      CRON: Joi.string().required(),
      BATCH_SIZE: Joi.number().required(),
      WORKER_REDIS_SERVICE: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envConfigSchema,
      { allowUnknown: true },
    );

    if (error) {
      throw new Error(`Config validation error: ${error}`);
    }

    return validatedEnvConfig;
  }
}
