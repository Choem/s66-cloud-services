module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'data',
  logging: true,
  timezone: 'UTC',
  entities: ['src/database/entities/**/**.entity.ts'],
  supportBigNumbers: true,
  bigNumberStrings: true,
  extra: { charset: 'utf8mb4_bin' },
};
