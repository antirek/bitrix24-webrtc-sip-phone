import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { DatabaseModule } from 'src/database/database.module';
import { VaultModule } from 'src/vault/vault.module';

import { BitrixCreedService } from './services/bitrix.creed.service';
import { BitrixTokenService } from './services/bitrix.token.service';
import { BitrixAuthGuard } from './guards/bitrix.auth.guard';

import { BitrixHttpService } from './services/bitrix.http.service';
import { BitrixAppsService } from './services/bitrix.apps.service';
import { BitrixController } from './bitrix.controller';
import { bitrixDatabaseProviders } from './providers/bitrix.database.provider';
import { BitrixInstallerService } from './services/bitrix.installer.service';
import { BitrixWidgetService } from './services/bitrix.widget.service';

@Module({
  imports: [
    HttpModule, 
    VaultModule, 
    DatabaseModule
  ],
  controllers: [BitrixController],
  providers: [
    ...bitrixDatabaseProviders, 
    BitrixAppsService,
    BitrixHttpService,
    BitrixCreedService,
    BitrixTokenService,
    BitrixAuthGuard,
    BitrixInstallerService,
    BitrixWidgetService,
  ],
})
export class BitrixModule {}
