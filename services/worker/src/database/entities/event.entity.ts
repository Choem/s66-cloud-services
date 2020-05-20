import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { MutationType } from "../enums/mutationType";
import { EventStatusType } from "../enums/eventStatusType";

@Entity("event")
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "mutation_type",
    type: "simple-enum",
    enum: MutationType,
  })
  mutationType: MutationType;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "event_status_type",
    type: "simple-enum",
    enum: EventStatusType,
  })
  eventStatusType: EventStatusType;
}
