import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { VaultModule } from '../vault/vault.module';

@Module({
  imports: [VaultModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
