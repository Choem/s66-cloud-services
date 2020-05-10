import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatisticEntity } from '../../database/entities/statistic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(StatisticEntity)
    private readonly statisticRepository: Repository<StatisticEntity>,
  ) {}

  async findById(id: number): Promise<StatisticEntity> {
    return await this.statisticRepository.findOne({ where: { id } });
  }
}
