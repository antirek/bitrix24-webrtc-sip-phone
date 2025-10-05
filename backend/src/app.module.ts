import { Module } from '@nestjs/common';

import { StaticFilesModule } from './serveStatic/serveStatis.module';

import { VaultModule } from './vault/vault.module';
import { DatabaseModule } from './database/database.module';

import { BitrixModule } from './bitrix/bitrix.module';

@Module({
  imports: [
    StaticFilesModule,
    VaultModule, 
    DatabaseModule, 
    BitrixModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
