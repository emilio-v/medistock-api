import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'medistock',
  password: process.env.POSTGRES_PASSWORD || 'medistock123',
  database: process.env.POSTGRES_DB || 'medistock',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false, // ALWAYS false in production
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
    lock_timeout: 5000,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
