import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { EventModule } from './event/event.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    EventModule,
    StatisticModule,
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
})
export class RootModule {}
