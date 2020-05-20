import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export const STATISTIC_ID = 1;

@Entity("statistic")
export class StatisticEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  total: number;
}
