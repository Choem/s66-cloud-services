import { Injectable } from '@nestjs/common';
import { EnvConfig } from './envConfig';
import * as Joi from 'joi';
import { EventEntity } from '../../database/entities/event.entity';
import { StatisticEntity } from '../../database/entities/statistic.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GqlModuleOptions } from '@nestjs/graphql';

@Injectable()
export class ConfigService {
  public readonly env: EnvConfig;

  constructor() {
    this.env = this.validateInput(process.env);
  }

  public get TypeORMConfig() {
    const typeOrmConfig: any = {
      type: this.env.DB_DRIVER,
      host: this.env.DB_HOST,
      port: this.env.DB_PORT,
      username: this.env.DB_USERNAME,
      password: this.env.DB_PASSWORD,
      database: this.env.DB_NAME,
      retryAttempts: 3,
      entities: [EventEntity, StatisticEntity],
      migrations: [],
    };

    return typeOrmConfig as TypeOrmModuleOptions;
  }

  public get GraphQLConfig() {
    const graphQlConfig: any = {
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
    };

    return graphQlConfig as GqlModuleOptions;
  }

  private validateInput(envConfig: any): EnvConfig {
    const envConfigSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production'])
        .default('development'),
      BASE_HREF: Joi.string()
        .default('/')
        .required(),
      APP_HOST: Joi.string().required(),
      APP_PORT: Joi.number().default(3333),
      APP_URL: Joi.string().required(),
      DB_DRIVER: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_NAME: Joi.string().required(),
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
