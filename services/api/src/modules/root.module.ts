import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RouterModule, Routes } from 'nest-router';
import { EventModule } from './event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../database/entities/event.entity';
import { StatisticEntity } from '../database/entities/statistic.entity';

const routes: Routes = [
  {
    path: '/events',
    module: EventModule,
  },
];

@Module({
  imports: [
    EventModule,
    RouterModule.forRoutes(routes),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'data',
      entities: [EventEntity, StatisticEntity],
      migrations: [],
      synchronize: false,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      typePaths: ['./**/*.graphql'],
    }),
  ],
})
export class RootModule {}
