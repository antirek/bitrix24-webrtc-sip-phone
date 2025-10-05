import { DataSource } from 'typeorm';
import { BitrixPortal } from '../entities/bitrix.portal.entity';
import { InstallCheck } from '../entities/bitrix.installCheck.entity';

export const bitrixDatabaseProviders = [
  {
    provide: 'B_PORTAL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(BitrixPortal),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'B_INSTALL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(InstallCheck),
    inject: ['DATA_SOURCE'],
  },
];
