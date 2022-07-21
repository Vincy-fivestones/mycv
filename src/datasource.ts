import { DataSource } from 'typeorm';
import 'dotenv/config';
import { config } from 'dotenv';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: false,
  entities: ['dist/src/**/*.entity.{ts,js}'],
  migrations: ['dist/src/migrations/*.{ts,js}'],
});
// const dataSource = {
//   synchronize: false,
// };
// switch (process.env.NODE_ENV) {
//   case 'development':
//     Object.assign(dataSource, {
//       type: 'sqlite',
//       database: 'db.sqlite',
//       entities: ['dist/src/**/*.entity.{ts,js}'],
//       migrations: ['dist/src/migrations/*.{ts,js}'],
//     });
//     break;
//   case 'test':
//     Object.assign(dataSource, {
//       type: 'sqlite',
//       database: 'test.sqlite',
//       entities: ['dist/src/**/*.entity.{ts,js}'],
//       migrations: ['dist/src/migrations/*.{ts,js}'],
//     });
//     break;
//   case 'production':
//     break;
//   default:
//     throw new Error('unknown environment');
// }

// export = dataSource;
