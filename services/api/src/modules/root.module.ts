import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RouterModule, Routes } from 'nest-router';
import { EventModule } from './event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { StatisticModule } from './statistic/statistic.module';
import { PUB_SUB } from '../lib/constants';
import { PubSub } from 'graphql-subscriptions';

const routes: Routes = [
  {
    path: '/events',
    module: EventModule,
  },
  {
    path: '/statistics',
    module: StatisticModule,
  },
];

@Module({
  imports: [
    EventModule,
    RouterModule.forRoutes(routes),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.TypeORMConfig,
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.GraphQLConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class RootModule {}
