import { DataSource } from 'typeorm';
import { VaultService } from '../vault/vault.service';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [VaultService],
    useFactory: async (vaultService: VaultService) => {
      const {host, port, username, password, database} = await vaultService.getDatabaseCredentials();

      const dataSource = new DataSource({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
