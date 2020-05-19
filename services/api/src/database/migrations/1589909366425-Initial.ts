import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1589909366425 implements MigrationInterface {
    name = 'Initial1589909366425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `event` (`id` int NOT NULL AUTO_INCREMENT, `mutation_type` enum ('ADDITION', 'SUBTRACTION') NOT NULL, `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `event_status_type` enum ('IDLE', 'WORKING', 'PROCESSED', 'FAILED') NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `statistic` (`id` int NOT NULL AUTO_INCREMENT, `total` int NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `statistic`", undefined);
        await queryRunner.query("DROP TABLE `event`", undefined);
    }

}
